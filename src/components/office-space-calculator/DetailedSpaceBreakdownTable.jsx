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

import chairIcon from '@/assets/svg/chair-01.svg';
import monitorIcon from '@/assets/svg/monitor-05.svg';
function formatSqft(n) {
  return `${Math.round(n).toLocaleString()} sq ft.`;
}

function parseCount(raw, fallback = 0) {
  const n = typeof raw === 'string' ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(n) ? n : fallback;
}

function getGroupStyles(variant) {
  if (variant === 'production') {
    return {
      rowBg: 'bg-[#ebfdf5]',
      // Figma: size 20px, border 0.417px white
      iconWrap: 'bg-[#10a684] border border-white',
      icon: <img src={monitorIcon} alt='' aria-hidden='true' className='h-[11px] w-[11px]' />,
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

function GroupRow({ areaGroup, subtotalSqft, variant, isOpen, onToggle, showChevron }) {
  const styles = getGroupStyles(variant);
  return (
    <Table.Row
      className={cn(
        'border-b border-[#eaecf0]',
        styles.rowBg,
        showChevron ? 'cursor-pointer' : null,
      )}
      onClick={() => {
        if (!showChevron) return;
        onToggle?.();
      }}
    >
      <Table.Cell className='h-[40px] py-0 px-6'>
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
            {toGroupLabel(areaGroup)}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell className='h-[40px] py-0 px-6' />
      <Table.Cell className='h-[40px] py-0 px-6' />
      <Table.Cell className='h-[40px] py-0 px-6' />
      <Table.Cell className='h-[40px] p-0'>
        <div className="flex h-[40px] items-center justify-end px-6 text-[14px] font-medium leading-[20px] text-[#475467] font-['Inter',sans-serif] whitespace-nowrap">
          {formatSqft(subtotalSqft)}
        </div>
      </Table.Cell>
      <Table.Cell className='h-[40px] py-0 px-4 text-right'>
        {showChevron ? (
          <button
            type='button'
            className='inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5'
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            aria-label={isOpen ? 'Collapse group' : 'Expand group'}
          >
            {isOpen ? (
              <ChevronUp className='h-4 w-4 text-[#475467]' aria-hidden='true' />
            ) : (
              <ChevronDown className='h-4 w-4 text-[#475467]' aria-hidden='true' />
            )}
          </button>
        ) : null}
      </Table.Cell>
    </Table.Row>
  );
}

function DataRow({
  name,
  layout,
  onLayoutChange,
  count,
  onCountChange,
  countEditable = false,
  areaPerUnit,
  total,
}) {
  return (
    <Table.Row className='border-b border-[#eaecf0] bg-white'>
      {/* Room Type (Figma 1209:36586: px-6 py-4, Inter 14/20 medium) */}
      <Table.Cell className='p-0'>
        <div className="flex items-center px-6 text-[14px] font-medium leading-[20px] text-[#101828] font-['Inter',sans-serif]">
          {name}
        </div>
      </Table.Cell>

      {/* Space Type */}
      <Table.Cell className='p-0 min-w-0'>
        <div className='flex items-center px-6'>
          <Select value={layout} onValueChange={onLayoutChange}>
            <SelectTrigger
              className={cn(
                // Figma badge (1209:36615)
                "h-[30px] w-[117px] justify-center gap-[20px] rounded-[6px] border border-[#d0d5dd] bg-white px-[6px] py-[2px] font-['Inter',sans-serif] shadow-none",
                'focus:ring-0 focus:ring-offset-0',
                '[&>span]:truncate [&>span]:text-center [&>span]:text-[14px] [&>span]:font-medium [&>span]:leading-[18px] [&>span]:text-[#344054]',
                '[&>svg]:opacity-100 [&>svg]:text-[#344054]',
              )}
              aria-label={`Space type for ${name}`}
            >
              <SelectValue placeholder='Select' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Compact'>Compact</SelectItem>
              <SelectItem value='Standard'>Standard</SelectItem>
              <SelectItem value='Lavish'>Lavish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Table.Cell>

      {/* Count */}
      <Table.Cell className='p-0 min-w-0'>
        <div className='flex items-center py-2'>
          {countEditable ? (
            <input
              className="h-[30px] w-[117px] rounded-[6px] border border-[#d0d5dd] bg-white px-[6px] py-[2px] text-[14px] font-medium leading-[18px] text-[#101828] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] outline-none font-['Inter',sans-serif]"
              value={count}
              onChange={(e) => onCountChange?.(e.target.value)}
              inputMode='numeric'
              pattern='[0-9]*'
              aria-label={`Count for ${name}`}
            />
          ) : (
            <div className="flex h-[30px] w-[117px] items-center rounded-[6px] border border-[#d0d5dd] bg-white px-[6px] py-[2px] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] font-['Inter',sans-serif]">
              <span className='truncate text-[14px] font-medium leading-[18px] text-[#101828]'>
                {count}
              </span>
            </div>
          )}
        </div>
      </Table.Cell>

      {/* Area Per Unit */}
      <Table.Cell className='p-0'>
        <div className="flex items-center px-6 py-4 text-[14px] font-medium leading-[20px] text-[#475467] font-['Inter',sans-serif] whitespace-nowrap">
          {formatSqft(areaPerUnit)}
        </div>
      </Table.Cell>

      {/* Total Area */}
      <Table.Cell className='p-0'>
        <div className="flex items-center px-6 py-4 text-[14px] font-medium leading-[20px] text-[#475467] font-['Inter',sans-serif] whitespace-nowrap">
          {formatSqft(total)}
        </div>
      </Table.Cell>

      <Table.Cell className='p-0'>
        <div className='px-4 py-4' />
      </Table.Cell>
    </Table.Row>
  );
}

function AddRoomRow() {
  return (
    <Table.Row className='border-b border-[#eaecf0] bg-[#fcfdfe]'>
      <Table.Cell className='h-[48px] px-4 py-0'>
        <button
          type='button'
          className="inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-[14px] font-semibold leading-[20px] text-[#475467] font-['Inter',sans-serif]"
        >
          <Plus className='h-5 w-5' aria-hidden='true' />
          Add new Room
        </button>
      </Table.Cell>
      <Table.Cell className='h-[48px] px-6 py-0' />
      <Table.Cell className='h-[48px] px-6 py-0' />
      <Table.Cell className='h-[48px] px-6 py-0' />
      <Table.Cell className='h-[48px] px-6 py-0' />
      <Table.Cell className='h-[48px] px-4 py-0' />
    </Table.Row>
  );
}

function GrandTotalRow({ totalSqft }) {
  return (
    <Table.Row className='bg-[#f7f7f7]'>
      <Table.Cell className="h-[72px] px-6 text-[14px] font-medium leading-[20px] text-[#101828] font-['Inter',sans-serif]">
        Grand Total
      </Table.Cell>
      <Table.Cell className='h-[72px] px-3' />
      <Table.Cell className='h-[72px] px-3' />
      <Table.Cell className='h-[72px] px-3' />
      <Table.Cell className='h-[72px] p-0'>
        <div className="flex h-[72px] items-center px-3 text-[14px] font-semibold leading-[20px] text-[#101828] font-['Inter',sans-serif] whitespace-nowrap">
          {formatSqft(totalSqft)}
        </div>
      </Table.Cell>
      <Table.Cell className='h-[72px] px-4' />
    </Table.Row>
  );
}

export default function DetailedSpaceBreakdownTable({
  breakdownRows,
  grandTotalSqft,
  efficiencyOpportunitiesCount,
}) {
  const productionGroup = breakdownRows?.find((g) => g.areaGroup === 'Productivity Area');
  const utilityGroup = breakdownRows?.find((g) => g.areaGroup === 'Utility and Breakout');
  const circulationGroup = breakdownRows?.find((g) => g.areaGroup === 'Circulation Area');

  const [isProductionOpen, setIsProductionOpen] = React.useState(true);
  const [isUtilityOpen, setIsUtilityOpen] = React.useState(true);

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

  const productionSubtotal = React.useMemo(() => {
    if (!productionGroup) return 0;
    return (productionGroup.rows ?? []).reduce((acc, r) => {
      const key = `${productionGroup.areaGroup}:${r.name}`;
      const countNum = parseCount(countByRowKey[key], r.count ?? 0);
      return acc + countNum * (r.areaPerUnit ?? 0);
    }, 0);
  }, [productionGroup, countByRowKey]);

  const utilitySubtotal = React.useMemo(() => {
    if (!utilityGroup) return 0;
    return (utilityGroup.rows ?? []).reduce(
      (acc, r) => acc + (r.count ?? 0) * (r.areaPerUnit ?? 0),
      0,
    );
  }, [utilityGroup]);

  const circulationSubtotal = circulationGroup?.subtotal ?? 0;

  const computedGrandTotal = React.useMemo(() => {
    const hasAny = Boolean(productionGroup || utilityGroup || circulationGroup);
    if (!hasAny) return grandTotalSqft ?? 0;
    return productionSubtotal + utilitySubtotal + circulationSubtotal;
  }, [
    productionGroup,
    utilityGroup,
    circulationGroup,
    grandTotalSqft,
    productionSubtotal,
    utilitySubtotal,
    circulationSubtotal,
  ]);

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
          <Table.Row className='bg-white'>
            <Table.Head className="h-[44px] bg-white border-b border-[#eaecf0] px-6 py-3 text-left text-[12px] font-medium leading-[18px] text-[#475467] font-['Inter',sans-serif]">
              Room Type
            </Table.Head>
            <Table.Head className="h-[44px] bg-white border-b border-[#eaecf0] px-6 py-3 text-left text-[12px] font-medium leading-[18px] text-[#475467] font-['Inter',sans-serif]">
              Space Type
            </Table.Head>
            <Table.Head className="h-[44px] bg-white border-b border-[#eaecf0] py-3 text-left text-[12px] font-medium leading-[18px] text-[#475467] font-['Inter',sans-serif]">
              Count
            </Table.Head>
            <Table.Head className='h-[44px] bg-white border-b border-[#eaecf0] p-0'>
              <div className="flex h-[44px] items-center px-6 py-3 text-[12px] font-medium leading-[18px] text-[#475467] font-['Inter',sans-serif]">
                Area Per Unit
              </div>
            </Table.Head>
            <Table.Head className='h-[44px] bg-white border-b border-[#eaecf0] p-0'>
              <div className="flex h-[44px] items-center px-6 py-3 text-[12px] font-medium leading-[18px] text-[#475467] font-['Inter',sans-serif]">
                Total Area
              </div>
            </Table.Head>
            <Table.Head className='h-[44px] bg-white border-b border-[#eaecf0] px-4 py-3' />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {productionGroup ? (
            <>
              <GroupRow
                areaGroup={productionGroup.areaGroup}
                subtotalSqft={productionSubtotal || productionGroup.subtotal}
                variant={toVariant(productionGroup.areaGroup)}
                showChevron
                isOpen={isProductionOpen}
                onToggle={() => setIsProductionOpen((v) => !v)}
              />
              {isProductionOpen ? (
                <>
                  {productionGroup.rows.map((r) => (
                    <DataRow
                      key={`prod-${r.name}`}
                      name={r.name}
                      layout={
                        spaceTypeByRowKey[`${productionGroup.areaGroup}:${r.name}`] ??
                        r.layout ??
                        'Compact'
                      }
                      onLayoutChange={(v) => {
                        setSpaceTypeByRowKey((prev) => ({
                          ...prev,
                          [`${productionGroup.areaGroup}:${r.name}`]: v,
                        }));
                      }}
                      count={
                        countByRowKey[`${productionGroup.areaGroup}:${r.name}`] ??
                        String(r.count ?? '')
                      }
                      onCountChange={(nextVal) => {
                        setCountByRowKey((prev) => ({
                          ...prev,
                          [`${productionGroup.areaGroup}:${r.name}`]: nextVal.replaceAll(/\D/g, ''),
                        }));
                      }}
                      countEditable
                      areaPerUnit={r.areaPerUnit}
                      total={
                        parseCount(
                          countByRowKey[`${productionGroup.areaGroup}:${r.name}`],
                          r.count ?? 0,
                        ) * (r.areaPerUnit ?? 0)
                      }
                    />
                  ))}
                  <AddRoomRow />
                </>
              ) : null}
            </>
          ) : null}

          {utilityGroup ? (
            <>
              <GroupRow
                areaGroup={utilityGroup.areaGroup}
                subtotalSqft={utilitySubtotal || utilityGroup.subtotal}
                variant={toVariant(utilityGroup.areaGroup)}
                showChevron
                isOpen={isUtilityOpen}
                onToggle={() => setIsUtilityOpen((v) => !v)}
              />
              {isUtilityOpen ? (
                <>
                  {utilityGroup.rows.map((r) => (
                    <DataRow
                      key={`util-${r.name}`}
                      name={r.name}
                      layout={
                        spaceTypeByRowKey[`${utilityGroup.areaGroup}:${r.name}`] ??
                        r.layout ??
                        'Compact'
                      }
                      onLayoutChange={(v) => {
                        setSpaceTypeByRowKey((prev) => ({
                          ...prev,
                          [`${utilityGroup.areaGroup}:${r.name}`]: v,
                        }));
                      }}
                      count={String(r.count ?? '')}
                      areaPerUnit={r.areaPerUnit}
                      total={(r.count ?? 0) * (r.areaPerUnit ?? 0)}
                    />
                  ))}
                  <AddRoomRow />
                </>
              ) : null}
            </>
          ) : null}

          {circulationGroup ? (
            <GroupRow
              areaGroup={circulationGroup.areaGroup}
              subtotalSqft={circulationGroup.subtotal}
              variant={toVariant(circulationGroup.areaGroup)}
              showChevron={false}
              isOpen={false}
            />
          ) : null}

          <GrandTotalRow totalSqft={computedGrandTotal} />
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
