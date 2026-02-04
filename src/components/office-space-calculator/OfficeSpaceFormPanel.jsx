import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OfficeLayoutOption from '@/components/office-space-calculator/OfficeLayoutOption';
import OfficeRangeSlider from '@/components/office-space-calculator/OfficeRangeSlider';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillInfoCircleFill, BsGrid3X3GapFill } from 'react-icons/bs';

import { RiLayoutGridFill, RiLayoutColumnFill } from 'react-icons/ri';
import {
  selectOfficeCalculatorErrors,
  selectOfficeCalculatorShowSummary,
  selectOfficeCalculatorValues,
  setErrors,
  setField,
  setShowSummary,
  clearErrors,
} from '@/store/slices/officeCalculatorSlice';
import {
  calculatorSchema,
  zodIssuesToFieldErrors,
} from '@/schemas/office-space-calculator/calculatorSchema';

export default function OfficeSpaceFormPanel({ title = 'Tell us about your office needs' }) {
  const dispatch = useDispatch();
  const values = useSelector(selectOfficeCalculatorValues);
  const errors = useSelector(selectOfficeCalculatorErrors);
  const showSummary = useSelector(selectOfficeCalculatorShowSummary);
  const layoutType = values?.layoutType ?? 'compact';

  const onSubmit = (e) => {
    e?.preventDefault?.();

    const payload = {
      ...values,
      meetingRooms: Number(values?.meetingRooms ?? 0),
      leadershipCabins: Number(values?.leadershipCabins ?? 0),
      managerCabins: Number(values?.managerCabins ?? 0),
    };

    const parsed = calculatorSchema.safeParse(payload);
    if (!parsed.success) {
      dispatch(setErrors(zodIssuesToFieldErrors(parsed.error)));
      dispatch(setShowSummary(false));
      return;
    }

    dispatch(clearErrors());
    dispatch(setShowSummary(true));
  };

  return (
    <div className='mx-auto flex h-full w-full max-w-[504px] flex-col gap-8 px-0 py-0 lg:justify-center'>
      <div className="font-['Plus_Jakarta_Sans',sans-serif] text-[32px] font-semibold tracking-[-0.96px] text-[#0a2540]">
        {title}
      </div>

      <form onSubmit={onSubmit} className='flex w-full flex-col gap-[30px]'>
        <div className='flex w-full flex-col gap-[27px]'>
          <div className='flex w-full gap-[27px]'>
            <div className='flex flex-1 flex-col gap-1'>
              <div className="flex items-center gap-1 font-['Inter',sans-serif] text-[14px] font-medium tracking-[-0.084px] text-[#0a0d14]">
                <Label htmlFor='workstationsRequired' className='text-[#0a0d14]'>
                  Workstations Required
                </Label>
                <span className='text-[#375dfb]'>*</span>
              </div>
              <Input
                id='workstationsRequired'
                placeholder='eg. 40'
                inputMode='numeric'
                variant='basic'
                value={values?.workstationsRequired ?? ''}
                onChange={(e) =>
                  dispatch(setField({ name: 'workstationsRequired', value: e.target.value }))
                }
                className={errors.workstationsRequired ? 'border-error' : ''}
              />
              {errors.workstationsRequired && (
                <p className='text-sm text-error'>{errors.workstationsRequired.message}</p>
              )}
            </div>

            <div className='flex flex-1 flex-col gap-1'>
              <div className="flex items-center gap-1 font-['Inter',sans-serif] text-[14px] font-medium tracking-[-0.084px] text-[#0a0d14]">
                <Label htmlFor='existingCarpetArea' className='text-[#0a0d14]'>
                  Existing Carpet Area
                </Label>
                <span className='font-normal text-[#525866]'>(Optional)</span>
                <span className='relative ml-1 inline-flex size-4 items-center justify-center opacity-70'>
                  <BsFillInfoCircleFill className='size-4 shrink-0 text-gray-400' aria-hidden />
                </span>
              </div>
              <Input
                id='existingCarpetArea'
                placeholder='Enter carpet area in sq. ft.'
                inputMode='numeric'
                variant='basic'
                value={values?.existingCarpetArea ?? ''}
                onChange={(e) =>
                  dispatch(setField({ name: 'existingCarpetArea', value: e.target.value }))
                }
                className={errors.existingCarpetArea ? 'border-error' : ''}
              />
              {errors.existingCarpetArea && (
                <p className='text-sm text-error'>{errors.existingCarpetArea.message}</p>
              )}
            </div>
          </div>

          {/* Sliders */}
          <OfficeRangeSlider
            label='Meeting Rooms*'
            value={values?.meetingRooms ?? 0}
            min={0}
            max={20}
            onChange={(v) => dispatch(setField({ name: 'meetingRooms', value: v }))}
          />
          {errors.meetingRooms && (
            <p className='text-sm text-error'>{errors.meetingRooms.message}</p>
          )}

          <OfficeRangeSlider
            label='Leadership Cabins*'
            value={values?.leadershipCabins ?? 0}
            min={0}
            max={20}
            onChange={(v) => dispatch(setField({ name: 'leadershipCabins', value: v }))}
          />
          {errors.leadershipCabins && (
            <p className='text-sm text-error'>{errors.leadershipCabins.message}</p>
          )}

          <OfficeRangeSlider
            label='Manager Cabins*'
            value={values?.managerCabins ?? 0}
            min={0}
            max={20}
            onChange={(v) => dispatch(setField({ name: 'managerCabins', value: v }))}
          />
          {errors.managerCabins && (
            <p className='text-sm text-error'>{errors.managerCabins.message}</p>
          )}

          <div className='flex w-full flex-col gap-2'>
            <div className="text-[14px] font-medium tracking-[-0.084px] text-[#021a32] font-['Inter',sans-serif]">
              Choose your Office Layout Type
            </div>

            <div className='flex w-full gap-2'>
              <OfficeLayoutOption
                selected={layoutType === 'compact'}
                icon={BsGrid3X3GapFill}
                title='Compact Office'
                description='Efficient layout focused on maximum seating and functional spaces.'
                onClick={() => dispatch(setField({ name: 'layoutType', value: 'compact' }))}
              />
              <OfficeLayoutOption
                selected={layoutType === 'standard'}
                icon={RiLayoutGridFill}
                title='Standard Office'
                description='A balanced mix of workstations, cabins, and collaboration areas.'
                onClick={() => dispatch(setField({ name: 'layoutType', value: 'standard' }))}
              />
              <OfficeLayoutOption
                selected={layoutType === 'lavish'}
                icon={RiLayoutColumnFill}
                title='Lavish Office'
                description='Premium layout with larger cabins & generous collaboration spaces.'
                onClick={() => dispatch(setField({ name: 'layoutType', value: 'lavish' }))}
              />
            </div>
            {errors.layoutType && <p className='text-sm text-error'>{errors.layoutType.message}</p>}
          </div>
        </div>

        <Button
          type='submit'
          variant='gradient'
          disabled={showSummary}
          className='h-12 w-full rounded-[8px] text-[15px] font-bold leading-[24px] disabled:opacity-60'
        >
          Calculate Basic Space Requirement
        </Button>
      </form>
    </div>
  );
}
