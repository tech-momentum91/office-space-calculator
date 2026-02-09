import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import EfficiencyOpportunityItem from './EfficiencyOpportunityItem';

/**
 * Sidebar card listing efficiency opportunities with optional "Apply all" action.
 * Uses OSC color variables.
 */
export default function EfficiencyOpportunitiesCard({
  opportunities,
  applyAllLabel = 'Apply All',
  onApplyAll,
}) {
  return (
    <Card className='overflow-hidden rounded-[10.66px] border-[0.888px] border-osc-border bg-osc-bg-subtle shadow-[0px_0.888px_1.777px_var(--color-osc-shadow)]'>
      <div className='flex items-center gap-[10.66px] border-b-[0.888px] border-osc-border bg-osc-bg-subtle px-[21.32px] py-[14.213px]'>
        <div className='flex h-[42.64px] w-[42.64px] items-center justify-center rounded-full border border-osc-orange-icon-border bg-osc-orange-icon-bg'>
          <Lightbulb className='h-5 w-5 text-osc-orange-icon' aria-hidden='true' />
        </div>
        <div className='flex-1 text-[15.99px] font-semibold leading-[21.32px] text-osc-text-primary font-[family-name:var(--font-family-sans)]'>
          Efficiency Opportunities
        </div>
      </div>

      <div className='flex flex-col gap-[21.32px] px-[21.32px] py-[9.772px]'>
        {opportunities.map((item) => (
          <EfficiencyOpportunityItem
            key={item.title}
            title={item.title}
            body={item.body}
            save={item.save}
            topBorderColor={item.topBorderColor}
          />
        ))}
      </div>

      {/* <button
        type='button'
        className='w-full border-t-[0.888px] border-osc-border-light bg-white py-4 text-center text-[15.99px] font-semibold leading-[43.528px] text-osc-text-primary font-[family-name:var(--font-family-sans)]'
        onClick={onApplyAll}
      >
        {applyAllLabel}
      </button> */}
    </Card>
  );
}
