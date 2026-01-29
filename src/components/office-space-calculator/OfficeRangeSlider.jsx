import { Slider } from '@/components/ui/slider';

export default function OfficeRangeSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) {
  return (
    <div className='flex w-full flex-col gap-1'>
      <div className='flex items-start gap-2'>
        <div className='text-[14px] font-medium tracking-[-0.084px] text-[#021a32]'>{label}</div>
        <div className='flex-1 text-right text-[12px] font-normal text-[#525866]'>
          {String(value).padStart(2, '0')}
        </div>
      </div>

      <Slider
        variant='calculator'
        aria-label={label}
        value={[Number(value ?? 0)]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange?.(v?.[0] ?? min)}
      />
    </div>
  );
}
