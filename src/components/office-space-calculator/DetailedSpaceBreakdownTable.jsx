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
import { ChevronDown, ChevronUp, Coffee, DownloadCloud, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { LuMonitorSpeaker } from 'react-icons/lu';

import { useLazyGetAreaPerUnitQuery } from '@/store/api/officeSpaceCalculatorApi';

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

function getRowKey(groupKey, row) {
  return row?.__rowKey ?? toRowKey(groupKey, row?.name);
}

function toSpecDocName(spaceTypeLabel) {
  const s = String(spaceTypeLabel ?? '')
    .trim()
    .toLowerCase();
  if (s === 'compact') return 'compact';
  if (s === 'standard') return 'standard';
  if (s === 'lavish') return 'lavish';
  return s;
}

function getGroupStyles(variant) {
  if (variant === 'production') {
    return {
      rowBg: 'bg-osc-teal-bg',
      iconWrap: 'bg-osc-teal border border-white',
      icon: <LuMonitorSpeaker className='h-[11px] w-[11px] text-white' aria-hidden='true' />,
    };
  }
  if (variant === 'utility') {
    return {
      rowBg: 'bg-osc-purple-bg',
      iconWrap: 'bg-osc-purple border border-white',
      icon: <Coffee className='h-[11px] w-[11px] text-white' aria-hidden='true' />,
    };
  }
  return {
    rowBg: 'bg-osc-orange-bg',
    iconWrap: 'bg-osc-orange border border-white',
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

function toBaseRoomTypeName(raw) {
  const s = String(raw ?? '').trim();
  return s.replace(/\s+\d+$/, '');
}

function buildAutoNumberedLabels(baseLabelsInOrder) {
  const totals = {};
  for (const base of baseLabelsInOrder) {
    const b = String(base ?? '').trim();
    if (!b) continue;
    totals[b] = (totals[b] ?? 0) + 1;
  }

  const seen = {};
  return baseLabelsInOrder.map((base) => {
    const b = String(base ?? '').trim();
    if (!b) return '';
    seen[b] = (seen[b] ?? 0) + 1;
    if ((totals[b] ?? 0) > 1) return `${b} ${seen[b]}`;
    return b;
  });
}

function buildTableData(breakdownRows, grandTotalSqft, overrides) {
  const out = [];
  const areaPerUnitBySpaceType = overrides?.areaPerUnitBySpaceType || {};
  const areaPerUnitByRowKey = overrides?.areaPerUnitByRowKey || {};
  let circulationGroupIndex = -1;

  for (const group of breakdownRows ?? []) {
    const groupKey = group.areaGroup;
    const groupLabel = toGroupLabel(groupKey);
    const variant = toVariant(groupKey);

    if (groupKey === 'Circulation Area') {
      out.push({
        id: `group:${groupKey}`,
        type: 'group',
        groupKey,
        variant,
        roomType: groupLabel,
        // computed later: 15% of (Productivity + Utility)
        totalArea: 0,
      });
      circulationGroupIndex = out.length - 1;
      continue;
    }

    const childRows = [];
    const rowsInOrder = group.rows ?? [];
    const rowKeysInOrder = rowsInOrder.map((r) => getRowKey(groupKey, r));
    const baseLabelsInOrder = rowsInOrder.map((r, idx) => {
      const rowKey = rowKeysInOrder[idx];
      const overrideBase = overrides?.roomTypeByRowKey?.[rowKey];
      if (typeof overrideBase === 'string' && overrideBase.trim()) return overrideBase.trim();
      return toBaseRoomTypeName(r?.name) || String(r?.name ?? '').trim();
    });
    const displayLabelsInOrder = buildAutoNumberedLabels(baseLabelsInOrder);

    for (let i = 0; i < rowsInOrder.length; i += 1) {
      const row = rowsInOrder[i];
      const rowKey = rowKeysInOrder[i];
      // IMPORTANT: keep empty string when unset so the Select placeholder shows.
      const displayRoomType = displayLabelsInOrder[i] || String(row?.name ?? '').trim() || '';

      const countRaw = overrides?.countByRowKey?.[rowKey];
      const countStr = typeof countRaw === 'string' ? countRaw : String(row.count ?? '');
      const countNum = parseCount(countStr, row.count ?? 0);

      const spaceTypeRaw = overrides?.spaceTypeByRowKey?.[rowKey];
      const spaceType = typeof spaceTypeRaw === 'string' ? spaceTypeRaw : (row.layout ?? 'Compact');

      const rowOverrideArea = areaPerUnitByRowKey?.[rowKey];
      const rowAreaPerUnit = row.areaPerUnit != null ? Number(row.areaPerUnit) : Number.NaN;
      const effectiveAreaPerUnit =
        rowOverrideArea !== undefined
          ? Number(rowOverrideArea) || 0
          : Number.isFinite(rowAreaPerUnit) && rowAreaPerUnit > 0
            ? rowAreaPerUnit
            : areaPerUnitBySpaceType?.[spaceType] !== undefined
              ? Number(areaPerUnitBySpaceType[spaceType]) || 0
              : (row.areaPerUnit ?? 0);

      childRows.push({
        id: `row:${rowKey}`,
        type: 'row',
        groupKey,
        rowKey,
        roomType: displayRoomType,
        spaceType,
        countStr,
        countNum,
        areaPerUnit: effectiveAreaPerUnit,
        totalArea: countNum * effectiveAreaPerUnit,
        order: row?.order != null ? Number(row.order) : 999,
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

  // Circulation = 15% of (Productivity + Utility)
  if (circulationGroupIndex >= 0) {
    const productivityTotal =
      out.find((r) => r.type === 'group' && r.groupKey === 'Productivity Area')?.totalArea ?? 0;
    const utilityTotal =
      out.find((r) => r.type === 'group' && r.groupKey === 'Utility and Breakout')?.totalArea ?? 0;
    out[circulationGroupIndex].totalArea =
      0.15 * (Number(productivityTotal) + Number(utilityTotal));
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

const DEFAULT_SPEC_TYPE_OPTIONS = ['Compact', 'Standard', 'Lavish'];

export default function DetailedSpaceBreakdownTable({
  breakdownRows,
  roomTypes,
  grandTotalSqft,
  efficiencyOpportunitiesCount,
  areaPerUnitBySpaceType,
  specTypeOptions = DEFAULT_SPEC_TYPE_OPTIONS,
  getSpecTypeOptionsForRoomType,
  onPersistRowChange,
  onDeleteRoomRow,
  persistedCustomRowKeys = [],
  readOnly = false,
}) {
  const [fetchAreaPerUnit] = useLazyGetAreaPerUnitQuery();
  const [customRowsByGroupKey, setCustomRowsByGroupKey] = React.useState(() => ({}));
  const [areaPerUnitByRowKey, setAreaPerUnitByRowKey] = React.useState(() => ({}));
  const persistTimersRef = React.useRef({});

  const [spaceTypeByRowKey, setSpaceTypeByRowKey] = React.useState(() => {
    const next = {};
    for (const group of breakdownRows ?? []) {
      for (const row of group.rows ?? []) {
        next[getRowKey(group.areaGroup, row)] = row.layout ?? 'Compact';
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
          const key = getRowKey(group.areaGroup, row);
          if (next[key] === undefined) next[key] = row.layout ?? 'Compact';
        }
      }
      return next;
    });
  }, [breakdownRows]);

  const [roomTypeByRowKey, setRoomTypeByRowKey] = React.useState(() => {
    const next = {};
    for (const group of breakdownRows ?? []) {
      for (const row of group.rows ?? []) {
        const key = getRowKey(group.areaGroup, row);
        const base = toBaseRoomTypeName(row?.name) || String(row?.name ?? '').trim();
        if (base) next[key] = base;
      }
    }
    return next;
  });

  React.useEffect(() => {
    setRoomTypeByRowKey((prev) => {
      const next = { ...prev };
      for (const group of breakdownRows ?? []) {
        for (const row of group.rows ?? []) {
          const key = getRowKey(group.areaGroup, row);
          if (next[key] === undefined) {
            const base = toBaseRoomTypeName(row?.name) || String(row?.name ?? '').trim();
            if (base) next[key] = base;
          }
        }
      }
      return next;
    });
  }, [breakdownRows]);

  const [countByRowKey, setCountByRowKey] = React.useState(() => {
    const next = {};
    for (const group of breakdownRows ?? []) {
      for (const row of group.rows ?? []) {
        next[getRowKey(group.areaGroup, row)] = String(row.count ?? '');
      }
    }
    return next;
  });

  React.useEffect(() => {
    setCountByRowKey((prev) => {
      const next = { ...prev };
      for (const group of breakdownRows ?? []) {
        for (const row of group.rows ?? []) {
          const key = getRowKey(group.areaGroup, row);
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

  const getRoomTypeOptionsForGroup = React.useCallback(
    (groupKey) => {
      const all = Array.isArray(roomTypes) ? roomTypes : [];
      const variant = toVariant(groupKey);
      const filtered =
        variant === 'production'
          ? all.filter((r) => r?.production)
          : variant === 'utility'
            ? all.filter((r) => r?.utility_area)
            : [];

      const labels = filtered
        .map((r) => String(r?.room_type_name ?? r?.name ?? '').trim())
        .filter(Boolean);

      // Fallback: derive from current rows if API list isn't available.
      if (labels.length === 0) {
        const inGroup = breakdownRows?.find((g) => g.areaGroup === groupKey)?.rows ?? [];
        const derived = [
          ...new Set(inGroup.map((r) => toBaseRoomTypeName(r?.name)).filter(Boolean)),
        ];
        derived.sort((a, b) => a.localeCompare(b));
        return derived;
      }

      return [...new Set(labels)].sort((a, b) => a.localeCompare(b));
    },
    [roomTypes, breakdownRows],
  );

  const addRoomToGroup = React.useCallback(
    (groupKey) => {
      if (!groupKey || groupKey === 'Circulation Area') return;

      // Ensure the group is expanded so the new row is visible.
      setExpandedGroups((prev) => ({ ...prev, [groupKey]: true }));

      const initialSpaceType = 'Compact';
      const initialAreaPerUnit = Number(areaPerUnitBySpaceType?.[initialSpaceType] ?? 0) || 0;
      const initialCount = 1;

      const id =
        (typeof globalThis !== 'undefined' &&
          globalThis.crypto &&
          typeof globalThis.crypto.randomUUID === 'function' &&
          globalThis.crypto.randomUUID()) ||
        `tmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const rowKey = `${groupKey}:custom:${id}`;

      setCustomRowsByGroupKey((prev) => ({
        ...prev,
        [groupKey]: [
          ...(prev?.[groupKey] ?? []),
          {
            __rowKey: rowKey,
            name: '',
            layout: initialSpaceType,
            count: initialCount,
            areaPerUnit: initialAreaPerUnit,
            total: initialCount * initialAreaPerUnit,
          },
        ],
      }));

      // Seed overrides for the new row so the inputs have values immediately.
      setSpaceTypeByRowKey((prev) => ({ ...prev, [rowKey]: initialSpaceType }));
      setCountByRowKey((prev) => ({ ...prev, [rowKey]: String(initialCount) }));
    },
    [areaPerUnitBySpaceType],
  );

  const removeRoomFromGroup = React.useCallback((rowKey) => {
    if (!rowKey || !String(rowKey).includes(':custom:')) return;
    const [groupKey] = String(rowKey).split(':custom:');
    if (!groupKey) return;
    setCustomRowsByGroupKey((prev) => {
      const list = prev?.[groupKey] ?? [];
      const nextList = list.filter((r) => getRowKey(groupKey, r) !== rowKey);
      if (nextList.length === 0) {
        const { [groupKey]: _, ...rest } = prev ?? {};
        return rest;
      }
      return { ...prev, [groupKey]: nextList };
    });
  }, []);

  const persistedSet = React.useMemo(
    () => new Set(Array.isArray(persistedCustomRowKeys) ? persistedCustomRowKeys : []),
    [persistedCustomRowKeys],
  );

  const mergedBreakdownRows = React.useMemo(() => {
    const custom = customRowsByGroupKey ?? {};
    return (breakdownRows ?? []).map((g) => {
      const extras = (custom[g.areaGroup] ?? []).filter(
        (r) => !persistedSet.has(getRowKey(g.areaGroup, r)),
      );
      if (extras.length === 0) return g;
      return { ...g, rows: [...(g.rows ?? []), ...extras] };
    });
  }, [breakdownRows, customRowsByGroupKey, persistedSet]);

  const data = React.useMemo(
    () =>
      buildTableData(mergedBreakdownRows, grandTotalSqft, {
        spaceTypeByRowKey,
        roomTypeByRowKey,
        countByRowKey,
        areaPerUnitBySpaceType,
        areaPerUnitByRowKey,
      }),
    [
      mergedBreakdownRows,
      grandTotalSqft,
      spaceTypeByRowKey,
      roomTypeByRowKey,
      countByRowKey,
      areaPerUnitBySpaceType,
      areaPerUnitByRowKey,
    ],
  );

  const updateAreaPerUnitForRow = React.useCallback(
    async (rowKey, nextRoomType, nextSpaceType) => {
      const roomType = String(nextRoomType ?? '').trim();
      const specType = toSpecDocName(nextSpaceType);
      if (!rowKey || !roomType || !specType) return;

      try {
        const v = await fetchAreaPerUnit({ spec_type: specType, room_type: roomType }).unwrap();
        setAreaPerUnitByRowKey((prev) => ({ ...prev, [rowKey]: Number(v ?? 0) || 0 }));
      } catch {
        // If lookup fails, keep existing value (fallbacks handle display).
      }
    },
    [fetchAreaPerUnit],
  );

  const persistRowChange = React.useCallback(
    (rowKey, overrides = {}) => {
      if (typeof onPersistRowChange !== 'function') return;

      const roomTypeLabel = overrides.roomTypeLabel ?? roomTypeByRowKey?.[rowKey] ?? '';
      const spaceTypeLabel = overrides.spaceTypeLabel ?? spaceTypeByRowKey?.[rowKey] ?? '';
      const countStr = overrides.countStr ?? countByRowKey?.[rowKey] ?? '';
      const countNum = Number.parseInt(String(countStr ?? '').trim() || '0', 10) || 0;

      onPersistRowChange({
        rowKey,
        roomTypeLabel: String(roomTypeLabel ?? '').trim(),
        spaceTypeLabel: String(spaceTypeLabel ?? '').trim(),
        count: countNum,
      });
    },
    [onPersistRowChange, roomTypeByRowKey, spaceTypeByRowKey, countByRowKey],
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
        cell: ({ row, table }) => {
          const item = row.original;
          if (item.type === 'group') {
            const styles = getGroupStyles(item.variant);
            return (
              <div className='flex h-full items-center gap-2'>
                <span
                  className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full border-[0.417px]',
                    styles.iconWrap,
                  )}
                >
                  {styles.icon}
                </span>
                <span className="text-[14px] font-medium leading-[20px] text-osc-text-primary font-['Inter',sans-serif]">
                  {item.roomType}
                </span>
              </div>
            );
          }

          if (item.type === 'add_room') {
            if (table.options.meta?.readOnly) return null;
            return (
              <div className='flex h-full items-center'>
                <button
                  type='button'
                  className={cn(
                    "flex h-auto min-w-[140px] w-auto cursor-pointer items-center justify-start gap-2 rounded-none border-0 bg-transparent p-0 font-['Inter',sans-serif] shadow-none",
                    'text-[14px] font-medium leading-[20px] text-osc-text-secondary',
                    'hover:text-osc-text-hover focus:outline-none focus:ring-0',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    table.options.meta?.addRoomToGroup?.(item.groupKey);
                  }}
                  aria-label='Add new room row'
                >
                  <Plus className='h-4 w-4 shrink-0 text-osc-text-secondary' aria-hidden='true' />
                  <span>Add new Room</span>
                </button>
              </div>
            );
          }

          if (item.type === 'grand_total') {
            return (
              <div className='flex h-full items-center'>
                <span className="text-[14px] font-medium leading-[20px] text-osc-text-primary font-['Inter',sans-serif]">
                  Grand Total
                </span>
              </div>
            );
          }

          if (item.type === 'row') {
            const options = table.options.meta?.getRoomTypeOptionsForGroup?.(item.groupKey) ?? [];
            const rawValue =
              table.options.meta?.roomTypeByRowKey?.[item.rowKey] ??
              toBaseRoomTypeName(item.roomType);
            const value = rawValue && options.includes(rawValue) ? rawValue : undefined;
            const displayLabel = value ? item.roomType : rawValue || item.roomType;
            if (table.options.meta?.readOnly) {
              return (
                <div className='flex h-full items-center'>
                  <span className="text-[14px] font-medium leading-[20px] text-osc-text-primary font-['Inter',sans-serif]">
                    {displayLabel}
                  </span>
                </div>
              );
            }
            const isNewlyAddedRoom = String(item.rowKey ?? '').includes(':custom:') && !value;
            const triggerLabel = value
              ? item.roomType
              : isNewlyAddedRoom
                ? 'Select a room Type'
                : 'Select room';
            return (
              <div className='flex h-full items-center'>
                <Select
                  value={value}
                  onValueChange={(v) =>
                    table.options.meta?.setRoomTypeByRowKey?.((prev) => {
                      const next = { ...prev, [item.rowKey]: v };
                      const nextSpaceType =
                        table.options.meta?.spaceTypeByRowKey?.[item.rowKey] ?? item.spaceType;
                      table.options.meta?.updateAreaPerUnitForRow?.(item.rowKey, v, nextSpaceType);
                      table.options.meta?.persistRowChange?.(item.rowKey, {
                        roomTypeLabel: v,
                        spaceTypeLabel: nextSpaceType,
                      });
                      return next;
                    })
                  }
                >
                  <SelectTrigger
                    variant='plain'
                    aria-label={`Room type for ${item.roomType}`}
                    className={cn(
                      isNewlyAddedRoom &&
                        '[&>span[data-placeholder]]:italic [&>span[data-placeholder]]:text-osc-text-secondary',
                    )}
                  >
                    <span data-placeholder={!value ? '' : undefined}>{triggerLabel}</span>
                  </SelectTrigger>
                  <SelectContent variant='table' position='popper'>
                    {options.map((label) => (
                      <SelectItem key={label} value={label} variant='table'>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          return (
            <div className='flex h-full items-center'>
              <span className="text-[14px] font-medium leading-[20px] text-osc-text-primary font-['Inter',sans-serif]">
                {item.roomType}
              </span>
            </div>
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
          const effectiveRoomType =
            table.options.meta?.roomTypeByRowKey?.[item.rowKey] ??
            toBaseRoomTypeName(item.roomType);
          const options =
            table.options.meta?.getSpecTypeOptionsForRoomType?.(effectiveRoomType) ??
            table.options.meta?.specTypeOptions ??
            DEFAULT_SPEC_TYPE_OPTIONS;

          if (table.options.meta?.readOnly) {
            return (
              <div className='flex h-full items-center'>
                <span className="text-[14px] font-medium leading-[20px] text-osc-text-primary font-['Inter',sans-serif]">
                  {options.includes(value) ? value : (options[0] ?? value)}
                </span>
              </div>
            );
          }

          return (
            <div className='flex h-full items-center'>
              <Select
                value={options.includes(value) ? value : (options[0] ?? value)}
                onValueChange={(v) => {
                  table.options.meta?.setSpaceTypeByRowKey?.((prev) => ({
                    ...prev,
                    [item.rowKey]: v,
                  }));
                  const nextRoomType =
                    table.options.meta?.roomTypeByRowKey?.[item.rowKey] ??
                    toBaseRoomTypeName(item.roomType);
                  table.options.meta?.updateAreaPerUnitForRow?.(item.rowKey, nextRoomType, v);
                  table.options.meta?.persistRowChange?.(item.rowKey, {
                    roomTypeLabel: nextRoomType,
                    spaceTypeLabel: v,
                  });
                }}
              >
                <SelectTrigger variant='bordered' aria-label={`Space type for ${item.roomType}`}>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent variant='table' position='popper'>
                  {options.map((label) => (
                    <SelectItem key={label} value={label} variant='table'>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          const value = table.options.meta?.countByRowKey?.[item.rowKey] ?? item.countStr ?? '';

          if (table.options.meta?.readOnly) {
            return (
              <div className='flex h-full items-center'>
                <span className="text-[14px] font-medium leading-[20px] text-osc-text-primary font-['Inter',sans-serif]">
                  {value}
                </span>
              </div>
            );
          }

          return (
            <div className='flex h-full items-center'>
              <input
                className="h-[30px] w-[117px] rounded-[6px] border border-osc-border-light bg-white px-[6px] py-[2px] text-[14px] font-medium leading-[18px] text-osc-text-primary shadow-[0px_1px_2px_var(--color-osc-shadow)] outline-none font-['Inter',sans-serif]"
                value={value}
                onChange={(e) => {
                  const nextVal = e.target.value.replaceAll(/\D/g, '');
                  table.options.meta?.setCountByRowKey?.((prev) => ({
                    ...prev,
                    [item.rowKey]: nextVal,
                  }));

                  if (table.options.meta?.persistTimersRef?.current) {
                    const t = table.options.meta.persistTimersRef.current[item.rowKey];
                    if (t) clearTimeout(t);
                    table.options.meta.persistTimersRef.current[item.rowKey] = setTimeout(() => {
                      table.options.meta?.persistRowChange?.(item.rowKey, { countStr: nextVal });
                    }, 500);
                  } else {
                    table.options.meta?.persistRowChange?.(item.rowKey, { countStr: nextVal });
                  }
                }}
                inputMode='numeric'
                pattern='[0-9]*'
                aria-label={`Count for ${item.roomType}`}
              />
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
            <div className='flex h-full items-center'>
              <span className="text-[14px] font-medium leading-[20px] text-osc-text-secondary font-['Inter',sans-serif] whitespace-nowrap">
                {formatSqft(item.areaPerUnit)}
              </span>
            </div>
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
              <div className='flex h-full items-center justify-end'>
                <span
                  className={cn(
                    "text-[14px] leading-[20px] font-['Inter',sans-serif] whitespace-nowrap",
                    item.type === 'grand_total'
                      ? 'font-semibold text-osc-text-primary'
                      : 'font-medium text-osc-text-secondary',
                  )}
                >
                  {formatSqft(item.totalArea ?? 0)}
                </span>
              </div>
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
          if (item.type === 'row') {
            if (table.options.meta?.readOnly) return null;
            const rowKey = item.rowKey ?? '';
            const isCustomRow = String(rowKey).includes(':custom:');
            const order = item.order != null ? Number(item.order) : 999;
            const showDelete = isCustomRow || order > 1;
            if (!showDelete) return null;
            return (
              <div className='flex h-full items-center justify-end'>
                <button
                  type='button'
                  className='inline-flex h-8 w-8 items-center justify-center rounded-md text-osc-text-secondary hover:bg-red-50 hover:text-red-600'
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCustomRow) {
                      table.options.meta?.removeRoomFromGroup?.(rowKey);
                    } else {
                      table.options.meta?.onDeleteRoomRow?.(rowKey);
                    }
                  }}
                  aria-label='Delete room'
                >
                  <Trash2 className='h-4 w-4' aria-hidden='true' />
                </button>
              </div>
            );
          }
          if (item.type !== 'group') return null;
          if (item.groupKey === 'Circulation Area') return null;

          const isExpanded = Boolean(table.options.meta?.expandedGroups?.[item.groupKey]);
          const Icon = isExpanded ? ChevronUp : ChevronDown;
          return (
            <div className='flex h-full items-center justify-end'>
              <button
                type='button'
                className='inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5'
                onClick={(e) => {
                  e.stopPropagation();
                  table.options.meta?.toggleGroup?.(item.groupKey);
                }}
                aria-label={isExpanded ? 'Collapse group' : 'Expand group'}
              >
                <Icon className='h-4 w-4 text-osc-text-secondary' aria-hidden='true' />
              </button>
            </div>
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
      addRoomToGroup,
      removeRoomFromGroup,
      onDeleteRoomRow,
      getRoomTypeOptionsForGroup,
      roomTypeByRowKey,
      setRoomTypeByRowKey,
      spaceTypeByRowKey,
      setSpaceTypeByRowKey,
      specTypeOptions:
        Array.isArray(specTypeOptions) && specTypeOptions.length > 0
          ? specTypeOptions
          : DEFAULT_SPEC_TYPE_OPTIONS,
      getSpecTypeOptionsForRoomType:
        typeof getSpecTypeOptionsForRoomType === 'function' ? getSpecTypeOptionsForRoomType : null,
      countByRowKey,
      setCountByRowKey,
      updateAreaPerUnitForRow,
      persistRowChange,
      persistTimersRef,
      readOnly,
    },
  });

  return (
    <Card className='overflow-hidden rounded-[12px] border border-osc-border bg-white shadow-[0px_1px_2px_var(--color-osc-shadow)]'>
      <div className='flex items-center gap-4 px-6 py-5'>
        <div className='flex flex-1 items-center gap-2'>
          <div className="text-[18px] font-semibold leading-[28px] text-osc-text-primary font-['Plus_Jakarta_Sans',sans-serif]">
            Detailed Space Breakdown
          </div>
          <div className='rounded-full border border-osc-purple-border bg-osc-purple-badge px-2 py-[2px]'>
            <span className="text-[12px] font-medium leading-[18px] text-osc-purple-text font-['Plus_Jakarta_Sans',sans-serif]">
              {efficiencyOpportunitiesCount} efficiency opportunities
            </span>
          </div>
        </div>
        {/* <Button
          type='button'
          variant='outline'
          className='h-10 rounded-[8px] border-osc-border-light'
        >
          <DownloadCloud className='h-4 w-4' aria-hidden='true' />
          Download
        </Button> */}
      </div>
      <div className='h-px w-full bg-osc-border' />

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
                      "h-[44px] bg-white border-b border-osc-border py-3 text-[12px] font-medium leading-[18px] text-osc-text-secondary font-['Inter',sans-serif]",
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
                ? cn('border-b border-osc-border', getGroupStyles(item.variant).rowBg)
                : item.type === 'add_room'
                  ? 'border-b border-osc-border bg-osc-bg-card'
                  : item.type === 'grand_total'
                    ? 'bg-osc-bg-total'
                    : 'border-b border-osc-border bg-white';

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
                  const rowPad = 'py-0';
                  const isNewlyAddedRoomCell =
                    cell.column.id === 'roomType' &&
                    item.type === 'row' &&
                    (() => {
                      if (!String(item.rowKey ?? '').includes(':custom:')) return false;
                      const options =
                        table.options.meta?.getRoomTypeOptionsForGroup?.(item.groupKey) ?? [];
                      const rawValue =
                        table.options.meta?.roomTypeByRowKey?.[item.rowKey] ??
                        toBaseRoomTypeName(item.roomType);
                      const value = rawValue && options.includes(rawValue) ? rawValue : undefined;
                      return !value;
                    })();
                  return (
                    <Table.Cell
                      key={cell.id}
                      className={cn(
                        rowHeightClass,
                        alignClass,
                        pad,
                        rowPad,
                        isNewlyAddedRoomCell && '!border !border-osc-primary',
                      )}
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
