import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

/**
 * Single efficiency opportunity row: title, body, save CTA, optional apply button.
 * Uses OSC color variables.
 */
export default function EfficiencyOpportunityItem({
  title,
  body,
  save,
  topBorderColor,
  applyLabel = 'Apply Suggestion',
  onApply,
}) {
  return (
    <div
      className='rounded-b-[10.66px] border-t-[4.442px]'
      style={{ borderTopColor: topBorderColor }}
    >
      <Card className='overflow-hidden rounded-b-[10.66px] border border-osc-border bg-white shadow-[0px_0.888px_1.777px_var(--color-osc-shadow)]'>
        <div className='flex flex-col gap-[14.213px] p-[21.32px]'>
          <div className='flex items-start gap-[23.985px]'>
            <div className='flex-1'>
              <div className='text-[14px] font-semibold leading-[21.32px] text-osc-text-primary font-[family-name:var(--font-family-sans)]'>
                {title}
              </div>
            </div>
            <div className='flex items-center gap-[3.553px] rounded-[6px] border border-osc-border-input bg-white px-[7.107px] py-[3.553px] pl-[3.553px]'>
              <CheckCircle2
                className='h-[21.32px] w-[21.32px] text-osc-success'
                aria-hidden='true'
              />
              <span className='text-[10.66px] font-medium leading-[14.213px] text-osc-text-tertiary font-[family-name:var(--font-family-sans)]'>
                {save}
              </span>
            </div>
          </div>
          <div className='text-[14px] font-normal leading-[17.766px] text-osc-text-secondary font-[family-name:var(--font-family-sans)]'>
            {body}
          </div>
        </div>

        <div className='border-t border-osc-border' />
        {/* <div className='flex items-center justify-center py-[14.213px]'>
          <button
            type='button'
            className='text-[14px] font-semibold leading-[17.766px] text-osc-link font-[family-name:var(--font-family-sans)]'
            onClick={onApply}
          >
            {applyLabel}
          </button>
        </div> */}
      </Card>
    </div>
  );
}
