import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Reusable stat card for the details/analysis page.
 * @param {string} title - Card title
 * @param {string|number} value - Main value
 * @param {string} [unit] - Unit label (e.g. "sqft.")
 * @param {React.ReactNode} [icon] - Icon element
 * @param {string} [iconWrapperClassName] - Classes for the icon wrapper (e.g. bg-osc-primary)
 * @param {string} [gradient] - CSS gradient for background (use var(--color-osc-gradient-*) or custom)
 * @param {React.ReactNode} [meta] - Optional meta row below value (e.g. "space per person")
 * @param {string} [className] - Extra class names
 */
export default function StatCard({
  title,
  value,
  unit,
  icon,
  iconWrapperClassName,
  gradient,
  meta,
  className,
}) {
  return (
    <Card
      className={cn(
        'flex h-[160px] flex-1 flex-col gap-4 rounded-[12px] border border-osc-border-card bg-transparent p-4 shadow-[0px_1px_2px_var(--color-osc-shadow)]',
        className,
      )}
      style={gradient ? { backgroundImage: gradient } : undefined}
    >
      <div className='flex w-full items-center gap-3'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            iconWrapperClassName,
          )}
        >
          {icon}
        </div>
        <div className='flex-1 text-[16px] font-semibold leading-[24px] text-osc-text-muted font-[family-name:var(--font-family-sans)]'>
          {title}
        </div>
      </div>
      <div className='flex items-baseline gap-2'>
        <span className='inline-block whitespace-nowrap text-[32px] font-semibold leading-[1.2] tracking-[-1.6px] text-osc-text-primary font-[family-name:var(--font-family-sans)]'>
          {value}
        </span>
        {unit != null && (
          <span className='inline-block whitespace-nowrap text-[20px] font-semibold leading-[1.2] tracking-[-1px] text-osc-text-secondary font-[family-name:var(--font-family-sans)]'>
            {unit}
          </span>
        )}
      </div>
      {meta ? <div className='flex w-full items-center gap-1'>{meta}</div> : null}
    </Card>
  );
}
