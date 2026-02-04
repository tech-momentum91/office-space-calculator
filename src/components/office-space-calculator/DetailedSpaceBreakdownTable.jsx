import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import * as Table from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronUp, Coffee, DownloadCloud, Plus } from 'lucide-react';
import * as React from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { LuMonitorSpeaker } from 'react-icons/lu';

import chairIcon from '@/assets/svg/chair-01.svg';

function formatSqft(n) {
  return `${Math.round(n).toLocaleString()} sq ft.`;
}

function parseCount(raw, fallback = 0) {
  const n = typeof raw === 'string' ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(n) ? n : fallback;
}

function toRowKey(groupKey, roomType) {
  return `${groupKey}:${roomType}`;
}

function getGroupStyles(variant) {
  if (variant === 'production') {
    return {
      rowBg: 'bg-[#ebfdf5]',
      // Figma: size 20px, border 0.417px white
      iconWrap: 'bg-[#10a684] border border-white',
      icon: <LuMonitorSpeaker className='h-[11px] w-[11px] text-white' aria-hidden='true' />,
    };
  }
  if (variant === 'utility') {
    return {
      rowBg: 'bg-[#faf6fe]',
      iconWrap: 'bg-[#7f56d9] border border-white',
      icon: <Coffee className='h-[11px] w-[11px] text-white' aria-hidden='true' />,
    };
  }
  return {
    rowBg: 'bg-[#fffbeb]',
    iconWrap: 'bg-[#ec620b] border border-white',
    icon: <img src={chairIcon} alt='' aria-hidden='true' className='h-[11px] w-[11px]' />,
  };
}

function toVariant(areaGroup) {
  if (areaGroup === 'Productivity Area') return 'production';
  if (areaGroup === 'Utility and Breakout') return 'utility';
  return 'circulation';
}

function toGroupLabel(areaGroup) {
  return areaGroup === 'Productivity Area' ? 'Production Area' : areaGroup;
}

function buildTableData(breakdownRows, grandTotalSqft, overrides) {
  const out = [];

  for (const group of breakdownRows ?? []) {
    const groupKey = group.areaGroup;
    const groupLabel = toGroupLabel(groupKey);
    const variant = toVariant(groupKey);

    if (groupKey === 'Circulation Area') {
      // Figma: Circulation is not expandable and has no add-room row.
      out.push({
        id: `group:${groupKey}`,
        type: 'group',
        groupKey,
        variant,
        roomType: groupLabel,
        totalArea: group.subtotal ?? 0,
      });
      continue;
    }

    const childRows = [];
    for (const row of group.rows ?? []) {
      const rowKey = toRowKey(groupKey, row.name);
      const isProduction = groupKey === 'Productivity Area';

      const countRaw = isProduction ? overrides?.countByRowKey?.[rowKey] : undefined;
      const countStr = typeof countRaw === 'string' ? countRaw : String(row.count ?? '');
      const countNum = isProduction ? parseCount(countStr, row.count ?? 0) : (row.count ?? 0);

      const spaceTypeRaw = overrides?.spaceTypeByRowKey?.[rowKey];
      const spaceType = typeof spaceTypeRaw === 'string' ? spaceTypeRaw : (row.layout ?? 'Compact');

      childRows.push({
        id: `row:${rowKey}`,
        type: 'row',
        groupKey,
        rowKey,
        roomType: row.name,
        spaceType,
        countStr,
        countNum,
        areaPerUnit: row.areaPerUnit ?? 0,
        totalArea: countNum * (row.areaPerUnit ?? 0),
      });
    }

    const groupTotal = childRows.reduce((acc, r) => acc + (r.totalArea ?? 0), 0);

    out.push({
      id: `group:${groupKey}`,
      type: 'group',
      groupKey,
      variant,
      roomType: groupLabel,
      totalArea: groupTotal || group.subtotal || 0,
    });

    out.push(...childRows);

    out.push({
      id: `add:${groupKey}`,
      type: 'add_room',
      groupKey,
    });
  }

  const groupsTotal = out
    .filter((r) => r.type === 'group')
    .reduce((acc, r) => acc + (r.totalArea ?? 0), 0);

  out.push({
    id: 'grand_total',
    type: 'grand_total',
    roomType: 'Grand Total',
    totalArea: groupsTotal || grandTotalSqft || 0,
  });

  return out;
}

export default function DetailedSpaceBreakdownTable({
  breakdownRows,
  grandTotalSqft,
  efficiencyOpportunitiesCount,
}) {
  const [spaceTypeByRowKey, setSpaceTypeByRowKey] = React.useState(() => {
    const next = {};
    for (const group of breakdownRows ?? []) {
      for (const row of group.rows ?? []) {
        next[`${group.areaGroup}:${row.name}`] = row.layout ?? 'Compact';
      }
    }
    return next;
  });

  React.useEffect(() => {
    // Merge in any new rows if breakdownRows changes.
    setSpaceTypeByRowKey((prev) => {
      const next = { ...prev };
      for (const group of breakdownRows ?? []) {
        for (const row of group.rows ?? []) {
          const key = `${group.areaGroup}:${row.name}`;
          if (next[key] === undefined) next[key] = row.layout ?? 'Compact';
        }
      }
      return next;
    });
  }, [breakdownRows]);

  const [countByRowKey, setCountByRowKey] = React.useState(() => {
    const next = {};
    for (const group of breakdownRows ?? []) {
      for (const row of group.rows ?? []) {
        next[`${group.areaGroup}:${row.name}`] = String(row.count ?? '');
      }
    }
    return next;
  });

  React.useEffect(() => {
    setCountByRowKey((prev) => {
      const next = { ...prev };
      for (const group of breakdownRows ?? []) {
        for (const row of group.rows ?? []) {
          const key = `${group.areaGroup}:${row.name}`;
          if (next[key] === undefined) next[key] = String(row.count ?? '');
        }
      }
      return next;
    });
  }, [breakdownRows]);

  const [expandedGroups, setExpandedGroups] = React.useState(() => ({
    'Productivity Area': true,
    'Utility and Breakout': true,
  }));

  const toggleGroup = React.useCallback((groupKey) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  }, []);

  const data = React.useMemo(
    () =>
      buildTableData(breakdownRows, grandTotalSqft, {
        spaceTypeByRowKey,
        countByRowKey,
      }),
    [breakdownRows, grandTotalSqft, spaceTypeByRowKey, countByRowKey],
  );

  const visibleData = React.useMemo(() => {
    const out = [];
    for (const row of data) {
      if (row.type === 'group' || row.type === 'grand_total') {
        out.push(row);
        continue;
      }
      if (row.groupKey && expandedGroups[row.groupKey]) out.push(row);
    }
    return out;
  }, [data, expandedGroups]);

  const columns = React.useMemo(
    () => [
      {
        id: 'roomType',
        header: 'Room Type',
        cell: ({ row }) => {
          const item = row.original;
          if (item.type === 'group') {
            const styles = getGroupStyles(item.variant);
            return (
              <div className='flex items-center gap-2'>
                <span
                  className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full border-[0.417px]',
                    styles.iconWrap,
                  )}
                >
                  {styles.icon}
                </span>
                <span className="text-[14px] font-medium leading-[20px] text-[#101828] font-['Inter',sans-serif]">
                  {item.roomType}
                </span>
              </div>
            );
          }

          if (item.type === 'add_room') {
            return (
              <button
                type='button'
                className="inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-[14px] font-semibold leading-[20px] text-[#475467] font-['Inter',sans-serif]"
              >
                <Plus className='h-5 w-5' aria-hidden='true' />
                Add new Room
              </button>
            );
          }

          if (item.type === 'grand_total') {
            return (
              <span className="text-[14px] font-medium leading-[20px] text-[#101828] font-['Inter',sans-serif]">
                Grand Total
              </span>
            );
          }

          return (
            <span className="text-[14px] font-medium leading-[20px] text-[#101828] font-['Inter',sans-serif]">
              {item.roomType}
            </span>
          );
        },
        meta: { pad: 'px-6', rowPad: 'py-4' },
      },
      {
        id: 'spaceType',
        header: 'Space Type',
        cell: ({ row, table }) => {
          const item = row.original;
          if (item.type !== 'row') return null;

          const value =
            table.options.meta?.spaceTypeByRowKey?.[item.rowKey] ?? item.spaceType ?? 'Compact';

          return (
            <Select
              value={value}
              onValueChange={(v) =>
                table.options.meta?.setSpaceTypeByRowKey?.((prev) => ({
                  ...prev,
                  [item.rowKey]: v,
                }))
              }
            >
              <SelectTrigger
                className={cn(
                  // Figma badge (1209:36615)
                  "h-[30px] w-[117px] justify-center gap-[20px] rounded-[6px] border border-[#d0d5dd] bg-white px-[6px] py-[2px] font-['Inter',sans-serif] shadow-none",
                  'focus:ring-0 focus:ring-offset-0',
                  '[&>span]:truncate [&>span]:text-center [&>span]:text-[14px] [&>span]:font-medium [&>span]:leading-[18px] [&>span]:text-[#344054]',
                  '[&>svg]:opacity-100 [&>svg]:text-[#344054]',
                )}
                aria-label={`Space type for ${item.roomType}`}
              >
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Compact'>Compact</SelectItem>
                <SelectItem value='Standard'>Standard</SelectItem>
                <SelectItem value='Lavish'>Lavish</SelectItem>
              </SelectContent>
            </Select>
          );
        },
        meta: { pad: 'px-6', rowPad: 'py-4' },
      },
      {
        id: 'count',
        header: 'Count',
        cell: ({ row, table }) => {
          const item = row.original;
          if (item.type !== 'row') return null;

          const isProduction = item.groupKey === 'Productivity Area';
          const value = isProduction
            ? (table.options.meta?.countByRowKey?.[item.rowKey] ?? item.countStr ?? '')
            : (item.countStr ?? '');

          if (isProduction) {
            return (
              <input
                className="h-[30px] w-[117px] rounded-[6px] border border-[#d0d5dd] bg-white px-[6px] py-[2px] text-[14px] font-medium leading-[18px] text-[#101828] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] outline-none font-['Inter',sans-serif]"
                value={value}
                onChange={(e) => {
                  const nextVal = e.target.value.replaceAll(/\D/g, '');
                  table.options.meta?.setCountByRowKey?.((prev) => ({
                    ...prev,
                    [item.rowKey]: nextVal,
                  }));
                }}
                inputMode='numeric'
                pattern='[0-9]*'
                aria-label={`Count for ${item.roomType}`}
              />
            );
          }

          return (
            <div className="flex h-[30px] w-[117px] items-center rounded-[6px] border border-[#d0d5dd] bg-white px-[6px] py-[2px] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] font-['Inter',sans-serif]">
              <span className='truncate text-[14px] font-medium leading-[18px] text-[#101828]'>
                {value}
              </span>
            </div>
          );
        },
        meta: { pad: 'px-6', rowPad: 'py-4' },
      },
      {
        id: 'areaPerUnit',
        header: 'Area Per Unit',
        cell: ({ row }) => {
          const item = row.original;
          if (item.type !== 'row') return null;
          return (
            <span className="text-[14px] font-medium leading-[20px] text-[#475467] font-['Inter',sans-serif] whitespace-nowrap">
              {formatSqft(item.areaPerUnit)}
            </span>
          );
        },
        meta: { pad: 'px-6', rowPad: 'py-4' },
      },
      {
        id: 'totalArea',
        header: 'Total Area',
        cell: ({ row }) => {
          const item = row.original;
          if (item.type === 'group' || item.type === 'row' || item.type === 'grand_total') {
            return (
              <span
                className={cn(
                  "text-[14px] leading-[20px] font-['Inter',sans-serif] whitespace-nowrap",
                  item.type === 'grand_total'
                    ? 'font-semibold text-[#101828]'
                    : 'font-medium text-[#475467]',
                )}
              >
                {formatSqft(item.totalArea ?? 0)}
              </span>
            );
          }
          return null;
        },
        meta: { align: 'right', pad: 'px-6', rowPad: 'py-4' },
      },
      {
        id: 'expand',
        header: '',
        cell: ({ row, table }) => {
          const item = row.original;
          if (item.type !== 'group') return null;
          if (item.groupKey === 'Circulation Area') return null;

          const isExpanded = Boolean(table.options.meta?.expandedGroups?.[item.groupKey]);
          const Icon = isExpanded ? ChevronUp : ChevronDown;
          return (
            <button
              type='button'
              className='inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5'
              onClick={(e) => {
                e.stopPropagation();
                table.options.meta?.toggleGroup?.(item.groupKey);
              }}
              aria-label={isExpanded ? 'Collapse group' : 'Expand group'}
            >
              <Icon className='h-4 w-4 text-[#475467]' aria-hidden='true' />
            </button>
          );
        },
        meta: { align: 'right', pad: 'px-4', rowPad: 'py-0', width: 44 },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: visibleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    meta: {
      expandedGroups,
      toggleGroup,
      spaceTypeByRowKey,
      setSpaceTypeByRowKey,
      countByRowKey,
      setCountByRowKey,
    },
  });

  return (
    <Card className='overflow-hidden rounded-[12px] border border-[#eaecf0] bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)]'>
      {/* Header */}
      <div className='flex items-center gap-4 px-6 py-5'>
        <div className='flex flex-1 items-center gap-2'>
          <div className="text-[18px] font-semibold leading-[28px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
            Detailed Space Breakdown
          </div>
          <div className='rounded-full border border-[#e9d7fe] bg-[#f9f5ff] px-2 py-[2px]'>
            <span className="text-[12px] font-medium leading-[18px] text-[#6941c6] font-['Plus_Jakarta_Sans',sans-serif]">
              {efficiencyOpportunitiesCount} efficiency opportunities
            </span>
          </div>
        </div>
        <Button type='button' variant='outline' className='h-10 rounded-[8px] border-[#d0d5dd]'>
          <DownloadCloud className='h-4 w-4' aria-hidden='true' />
          Download
        </Button>
      </div>
      <div className='h-px w-full bg-[#eaecf0]' />

      {/* Table */}
      <Table.Root variant='unstyled' className='overflow-x-hidden [&_table]:table-fixed'>
        <colgroup>
          <col style={{ width: '28%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '44px' }} />
        </colgroup>
        <Table.Header>
          {table.getHeaderGroups().map((hg) => (
            <Table.Row key={hg.id} className='bg-white'>
              {hg.headers.map((header) => {
                const meta = header.column.columnDef.meta || {};
                return (
                  <Table.Head
                    key={header.id}
                    className={cn(
                      "h-[44px] bg-white border-b border-[#eaecf0] py-3 text-[12px] font-medium leading-[18px] text-[#475467] font-['Inter',sans-serif]",
                      meta.align === 'right' ? 'text-right' : 'text-left',
                      meta.pad ?? 'px-6',
                    )}
                    style={meta.width ? { width: meta.width } : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {table.getRowModel().rows.map((row) => {
            const item = row.original;
            const isExpandableGroup = item.type === 'group' && item.groupKey !== 'Circulation Area';

            const rowClassName =
              item.type === 'group'
                ? cn('border-b border-[#eaecf0]', getGroupStyles(item.variant).rowBg)
                : item.type === 'add_room'
                  ? 'border-b border-[#eaecf0] bg-[#fcfdfe]'
                  : item.type === 'grand_total'
                    ? 'bg-[#f7f7f7]'
                    : 'border-b border-[#eaecf0] bg-white';

            const rowHeightClass =
              item.type === 'group'
                ? 'h-[40px]'
                : item.type === 'add_room'
                  ? 'h-[48px]'
                  : 'h-[72px]';

            return (
              <Table.Row
                key={row.id}
                className={cn(rowClassName, isExpandableGroup ? 'cursor-pointer' : null)}
                onClick={() => {
                  if (!isExpandableGroup) return;
                  toggleGroup(item.groupKey);
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta || {};
                  const alignClass = meta.align === 'right' ? 'text-right' : 'text-left';
                  const pad = cell.column.id === 'count' ? 'px-3' : (meta.pad ?? 'px-6');
                  const rowPad =
                    item.type === 'group'
                      ? 'py-0'
                      : item.type === 'add_room'
                        ? 'py-0'
                        : (meta.rowPad ?? 'py-4');
                  return (
                    <Table.Cell
                      key={cell.id}
                      className={cn(rowHeightClass, alignClass, pad, rowPad)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
