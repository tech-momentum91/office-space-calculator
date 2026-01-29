import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function OfficeLayoutOption({ selected, iconSrc, title, description, onClick }) {
  return (
    <Button
      type='button'
      onClick={onClick}
      variant='layoutOption'
      size='layoutOption'
      aria-pressed={selected}
      className={cn(
        'flex flex-1 flex-col items-start overflow-hidden border',
        selected ? 'border-[#375dfb]' : 'border-[#e5e7ec] hover:border-[#cfd6e6]',
      )}
    >
      <div className='flex w-full flex-col gap-[10px]'>
        {/* Figma node-id=1209:42097: 24px box with 16.25% inset */}
        <div className='relative size-6 overflow-hidden'>
          <div className='absolute inset-[16.25%]'>
            <img src={iconSrc} alt='' className='block h-full w-full max-w-none' />
          </div>
        </div>

        <div className='flex flex-col gap-[2px]'>
          <div className='text-[14px] font-medium tracking-[-0.084px] text-[#021a32]'>{title}</div>
          <div className='max-w-[140px] text-[10px] font-normal leading-[1.3] tracking-[-0.06px] text-[#525866]'>
            {description}
          </div>
        </div>
      </div>
    </Button>
  );
}
