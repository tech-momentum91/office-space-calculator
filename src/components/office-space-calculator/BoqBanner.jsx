import { Button } from '@/components/ui/button';

/**
 * Reusable dark CTA banner (e.g. BOQ). Uses OSC color variables.
 */
export default function BoqBanner({
  title = 'Want to explore BOQ?',
  description = 'Check out our AI BOQ Estimator and make your plan full proof!',
  dismissLabel = 'Dismiss',
  ctaLabel = 'Checkout BOQ Estimator',
  onDismiss,
  onCta,
}) {
  return (
    <div className='bg-osc-banner-bg'>
      <div className='mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-6 py-6'>
        <div>
          <div className='text-[18px] font-semibold text-white font-[family-name:var(--font-family-sans)]'>
            {title}
          </div>
          <div className='text-[12px] font-medium text-white/70 font-[family-name:var(--font-family-sans)]'>
            {description}
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            className='h-10 rounded-[8px] border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
            onClick={onDismiss}
          >
            {dismissLabel}
          </Button>
          <Button
            type='button'
            variant='gradient'
            className='h-10 rounded-[8px] px-4'
            onClick={onCta}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
