import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Ruler } from 'lucide-react';

/**
 * Reusable space utilization card with bar (needed vs available).
 * Uses OSC color variables.
 */
export default function SpaceUtilizationCard({ totalSpaceNeeded, availableCarpetArea }) {
  const needed = Number(totalSpaceNeeded) || 0;
  const available = Number(availableCarpetArea) || 0;

  const delta = needed - available;
  const isOverCapacity = delta > 0;
  const pct = available > 0 ? Math.round((needed / available) * 100) : 0;

  const barBase = Math.max(needed, available, 1);
  const bluePct = isOverCapacity
    ? Math.min(available / barBase, 1) * 100
    : (needed / barBase) * 100;
  const redPct = isOverCapacity
    ? Math.max((needed - available) / barBase, 0) * 100
    : Math.max((available - needed) / barBase, 0) * 100;

  return (
    <Card
      className='flex flex-col justify-between rounded-[12px] border border-osc-border-card p-6 shadow-[0px_1px_2px_var(--color-osc-shadow)] lg:col-span-2 sm:col-span-2 col-span-full'
      style={{ backgroundImage: 'var(--color-osc-gradient-utilization)' }}
    >
      <div className='flex items-start gap-2'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-osc-error-bg'>
          <Ruler className='h-4 w-4 text-osc-text-secondary' aria-hidden='true' />
        </div>
        <div className='text-[18px] font-semibold leading-[1.2] text-osc-text-primary font-[family-name:var(--font-family-sans)]'>
          Space Utilization
        </div>
      </div>

      <div className='mt-4 flex w-full flex-col gap-4'>
        <div className='flex w-full items-center justify-end gap-2'>
          <div className='flex items-center gap-[2px]'>
            {isOverCapacity ? (
              <ArrowUp className='h-5 w-5 text-osc-error' aria-hidden='true' />
            ) : (
              <ArrowDown className='h-5 w-5 text-osc-success' aria-hidden='true' />
            )}
            <span className='text-[14px] font-medium leading-[20px] text-osc-error font-[family-name:var(--font-family-sans)]'>
              {pct}%
            </span>
          </div>
          <span className='text-[14px] font-medium leading-[20px] text-osc-text-secondary font-[family-name:var(--font-family-sans)]'>
            {isOverCapacity ? 'sqft over Capacity' : 'sqft under Capacity'}
          </span>
        </div>

        <div className='flex w-full flex-col gap-2'>
          <div className='h-[12px] w-full overflow-hidden rounded-full bg-osc-bg-bar'>
            <div className='flex h-full w-full'>
              <div className='h-full bg-osc-bar-available' style={{ width: `${bluePct}%` }} />
              {redPct > 0 ? (
                <div className='h-full bg-osc-bar-over' style={{ width: `${redPct}%` }} />
              ) : null}
            </div>
          </div>

          <div className='flex w-full items-center justify-between text-[14px] font-medium leading-[20px] text-osc-text-secondary font-[family-name:var(--font-family-sans)]'>
            {isOverCapacity ? (
              <>
                <span>0 sq ft</span>
                <span>{Number(available).toLocaleString()} sqft</span>
                <span>{Number(needed).toLocaleString()} sqft</span>
              </>
            ) : (
              <>
                <span>0 sq ft</span>
                <span>{Number(needed).toLocaleString()} sqft</span>
                <span>{Number(available).toLocaleString()} sqft</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
