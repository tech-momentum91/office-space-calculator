import { cn } from '@/lib/utils';

/**
 * Reusable page section title with optional subtitle.
 */
export default function PageSectionTitle({ title, subtitle, className }) {
  return (
    <div className={cn('flex flex-col gap-[2px] items-start', className)}>
      <div className='flex flex-col items-start'>
        <h1 className='text-[36px] font-semibold leading-[1.2] tracking-[-1.8px] text-osc-text-primary font-[family-name:var(--font-family-sans)]'>
          {title}
        </h1>
      </div>
      {subtitle ? (
        <div className='flex flex-col items-start justify-center py-1 h-[38px]'>
          <p className='text-[20px] font-medium leading-[1.2] tracking-[-0.8px] text-osc-text-muted font-[family-name:var(--font-family-sans)]'>
            {subtitle}
          </p>
        </div>
      ) : null}
    </div>
  );
}
