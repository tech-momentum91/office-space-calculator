import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import leftpanelBg from '@/assets/image/leftpannel.png';
import OfficeRangeSlider from '@/components/office-space-calculator/OfficeRangeSlider';
import OfficeLayoutOption from '@/components/office-space-calculator/OfficeLayoutOption';
import OfficeSpaceSummaryPanel from '@/components/office-space-calculator/OfficeSpaceSummaryPanel';
import OfficeSpaceFormPanel from '@/components/office-space-calculator/OfficeSpaceFormPanel';
import iconInfo from '@/assets/image/info.png';
import iconCompact from '@/assets/image/compact.png';
import iconStandard from '@/assets/image/standard.png';
import iconLavish from '@/assets/image/lavish.png';
import {
  clearErrors,
  selectOfficeCalculatorErrors,
  selectOfficeCalculatorShowSummary,
  selectOfficeCalculatorValues,
  setErrors,
  setField,
  setShowSummary,
} from '@/store/slices/officeCalculatorSlice';
import {
  calculatorSchema,
  zodIssuesToFieldErrors,
} from '@/schemas/office-space-calculator/calculatorSchema';

function formatLayoutLabel(layoutType) {
  if (layoutType === 'compact') return 'Compact Office';
  if (layoutType === 'standard') return 'Standard Office';
  return 'Lavish Office';
}

function roundToNearest10(n) {
  return Math.round(n / 10) * 10;
}

function calcResults(data) {
  const workstations = Number(data?.workstationsRequired ?? 0) || 0;
  const meetingRooms = Number(data?.meetingRooms ?? 0) || 0;
  const leadershipCabins = Number(data?.leadershipCabins ?? 0) || 0;
  const managerCabins = Number(data?.managerCabins ?? 0) || 0;
  const existing =
    data?.existingCarpetArea === undefined ? undefined : Number(data.existingCarpetArea) || 0;

  const spacePerPerson =
    data?.layoutType === 'lavish' ? 90 : data?.layoutType === 'compact' ? 70 : 77;

  const base =
    workstations * spacePerPerson + meetingRooms * 30 + leadershipCabins * 50 + managerCabins * 40;

  const estimatedSpaceNeeded = roundToNearest10(base * 1.15);
  const delta =
    existing === undefined ? undefined : roundToNearest10(estimatedSpaceNeeded - existing);

  const seatingSqft = Math.round(workstations * 40.77); // matches Figma sample: 30 -> 1223

  const productivitySqft = Math.round((estimatedSpaceNeeded * 55) / 100);
  const utilitySqft = Math.round((estimatedSpaceNeeded * 30) / 100);
  // Requirement: Circulation area (15%) = 15% of (Productivity area + Utility area)
  const circulationSqft = Math.round(((productivitySqft + utilitySqft) * 15) / 100);

  const zonal = [
    { label: 'Productivity', pct: 55, sqft: productivitySqft },
    { label: 'Utility', pct: 30, sqft: utilitySqft },
    { label: 'Circulation space', pct: 15, sqft: circulationSqft },
  ];

  const collaboration = [
    { label: 'Meeting Room', count: meetingRooms, sqft: Math.round(meetingRooms * 30) },
    { label: 'Manager Cabins', count: managerCabins, sqft: Math.round(managerCabins * 40) },
    {
      label: 'Leadership Cabins',
      count: leadershipCabins,
      sqft: Math.round(leadershipCabins * 50),
    },
  ];

  return {
    workstations,
    meetingRooms,
    leadershipCabins,
    managerCabins,
    existing,
    spacePerPerson,
    seatingSqft,
    estimatedSpaceNeeded,
    delta,
    zonal,
    collaboration,
  };
}

function LeftMarketingPanel() {
  return (
    <div className='relative flex h-full w-[608px] items-center justify-center overflow-hidden bg-[#e7eaf1]'>
      <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
        <div className='absolute inset-0 bg-[#e7eaf1]' />
        <div className='absolute inset-0 overflow-hidden opacity-90'>
          <img
            alt=''
            src={leftpanelBg}
            className='absolute left-0 top-[-17.71%] h-[135.42%] w-full max-w-none object-cover'
          />
        </div>
      </div>

      {/* Figma: 58px left/right padding => content width 492px */}
      <div className='relative w-full px-[58px] py-0'>
        <div className="flex w-[492px] flex-col gap-4 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className='text-[44px] font-semibold leading-[56.2px] tracking-[-2.56px]'>
            <span className='text-[#1b094e]'>Office Space </span>
            <span className='text-[#8b8b8c]'>Calculator</span>
          </div>
          <p className='w-full max-w-[470px] text-[18px] font-normal leading-[1.28] text-[#525866]'>
            Select your areas, define your needs, and instantly know how much space your office
            requires.
          </p>
        </div>
      </div>
    </div>
  );
}

function RightPanelShell({ children, showDivider = true }) {
  return (
    <div className='relative h-full w-[608px] overflow-hidden bg-[#fcfcfc]'>
      {/* subtle divider */}
      {showDivider ? (
        <div className='absolute left-0 top-0 h-full w-px bg-[rgba(66,71,112,0.3)]' />
      ) : null}
      {children}
    </div>
  );
}

function normalizeForCalc(values) {
  const workstationsRequired =
    values?.workstationsRequired === '' || values?.workstationsRequired === undefined
      ? 0
      : Number(values.workstationsRequired);
  const existingCarpetArea =
    values?.existingCarpetArea === '' || values?.existingCarpetArea === undefined
      ? undefined
      : Number(values.existingCarpetArea);

  return {
    workstationsRequired: Number.isFinite(workstationsRequired) ? workstationsRequired : 0,
    existingCarpetArea: Number.isFinite(existingCarpetArea) ? existingCarpetArea : undefined,
    meetingRooms: Number(values?.meetingRooms ?? 0) || 0,
    leadershipCabins: Number(values?.leadershipCabins ?? 0) || 0,
    managerCabins: Number(values?.managerCabins ?? 0) || 0,
    layoutType: values?.layoutType ?? 'compact',
  };
}

export default function OfficeSpaceCalculatorCard() {
  const dispatch = useDispatch();
  const values = useSelector(selectOfficeCalculatorValues);
  const errors = useSelector(selectOfficeCalculatorErrors);
  const showSummary = useSelector(selectOfficeCalculatorShowSummary);
  const layoutType = values?.layoutType ?? 'compact';

  // Live results derived from current form values (used when summary is visible)
  const results = useMemo(() => {
    if (!showSummary) return null;
    return calcResults(normalizeForCalc(values));
  }, [showSummary, values]);

  const summaryRows = useMemo(() => {
    if (!showSummary || !results) return [];

    return [
      {
        label: 'Estimated Space Needed',
        value: `${results.estimatedSpaceNeeded.toLocaleString()} sqft.`,
      },
      {
        label: 'Existing Carpet Area',
        value: results.existing === undefined ? '—' : `${results.existing.toLocaleString()} sqft.`,
      },
      {
        label: 'Difference',
        value:
          results.delta === undefined
            ? '—'
            : `${Math.abs(results.delta).toLocaleString()} sqft ${results.delta >= 0 ? 'higher' : 'lower'}`,
      },
      { label: 'Workstations Required', value: String(values?.workstationsRequired ?? '') },
      { label: 'Meeting Rooms', value: String(values?.meetingRooms ?? '') },
      { label: 'Leadership Cabins', value: String(values?.leadershipCabins ?? '') },
      { label: 'Manager Cabins', value: String(values?.managerCabins ?? '') },
      { label: 'Office Layout Type', value: formatLayoutLabel(layoutType) },
    ];
  }, [showSummary, results, values, layoutType]);

  const onCalculate = (e) => {
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
    <Card className='relative w-full overflow-hidden rounded-[12px] border-[10px] border-white bg-[#f6f9fc] shadow-[0px_2px_2px_rgba(27,28,29,0.12)] lg:h-[757px] lg:w-[1216px]'>
      {/* Mobile / tablet layout */}
      <div className='grid w-full grid-cols-1 lg:hidden'>
        <div className='relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[#e7eaf1]'>
          <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
            <div className='absolute inset-0 bg-[#e7eaf1]' />
            <div className='absolute inset-0 overflow-hidden opacity-90'>
              <img
                alt=''
                src={leftpanelBg}
                className='absolute left-0 top-[-17.71%] h-[135.42%] w-full max-w-none object-cover'
              />
            </div>
          </div>

          <div className='relative w-full px-6 py-12'>
            <div className="flex w-full flex-col gap-4 font-['Plus_Jakarta_Sans',sans-serif]">
              <div className='text-[44px] font-semibold leading-[56.2px] tracking-[-2.56px]'>
                <span className='text-[#1b094e]'>Office Space </span>
                <span className='text-[#8b8b8c]'>Calculator</span>
              </div>
              <p className='w-full max-w-[470px] text-[18px] font-normal leading-[1.28] text-[#525866]'>
                Select your areas, define your needs, and instantly know how much space your office
                requires.
              </p>
            </div>
          </div>
        </div>

        <div className='relative overflow-hidden bg-[#fcfcfc]'>
          <div className='mx-auto flex w-full max-w-[504px] flex-col gap-8 px-6 py-10'>
            <div className="font-['Plus_Jakarta_Sans',sans-serif] text-[32px] font-semibold tracking-[-0.96px] text-[#0a2540]">
              Tell us about your office needs
            </div>

            <form onSubmit={onCalculate} className='flex w-full flex-col gap-[30px]'>
              <div className='flex w-full flex-col gap-[27px]'>
                <div className='flex w-full flex-col gap-6 sm:flex-row sm:gap-[27px]'>
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
                        <img src={iconInfo} alt='' className='h-4 w-4' />
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

                  <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-2'>
                    <OfficeLayoutOption
                      selected={layoutType === 'compact'}
                      iconSrc={iconCompact}
                      title='Compact Office'
                      description='Efficient layout focused on maximum seating and functional spaces.'
                      onClick={() => dispatch(setField({ name: 'layoutType', value: 'compact' }))}
                    />
                    <OfficeLayoutOption
                      selected={layoutType === 'standard'}
                      iconSrc={iconStandard}
                      title='Standard Office'
                      description='A balanced mix of workstations, cabins, and collaboration areas.'
                      onClick={() => dispatch(setField({ name: 'layoutType', value: 'standard' }))}
                    />
                    <OfficeLayoutOption
                      selected={layoutType === 'lavish'}
                      iconSrc={iconLavish}
                      title='Lavish Office'
                      description='Premium layout with larger cabins & generous collaboration spaces.'
                      onClick={() => dispatch(setField({ name: 'layoutType', value: 'lavish' }))}
                    />
                  </div>
                  {errors.layoutType && (
                    <p className='text-sm text-error'>{errors.layoutType.message}</p>
                  )}
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

            {showSummary && (
              <div className='mt-8 rounded-[12px] border border-[#e5e7ec] bg-white p-5'>
                <div className="mb-4 font-['Plus_Jakarta_Sans',sans-serif] text-[20px] font-semibold text-[#0a2540]">
                  Summary
                </div>
                <div className='space-y-3'>
                  {summaryRows.map((row) => (
                    <div key={row.label} className='flex items-start justify-between gap-4'>
                      <div className='text-sm text-[#525866]'>{row.label}</div>
                      <div className='text-sm font-medium text-[#0a2540]'>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop interactive layout: right panel slides left, summary appears on right */}
      <div className='relative hidden h-full w-full lg:block'>
        {/* Left marketing */}
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[608px] transition-opacity duration-300',
            showSummary ? 'pointer-events-none opacity-0' : 'opacity-100',
          )}
        >
          <LeftMarketingPanel />
        </div>

        {/* Form panel (starts on right, slides to left on submit) */}
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[608px] transition-transform duration-500 ease-in-out',
            showSummary ? 'translate-x-0' : 'translate-x-[608px]',
          )}
        >
          <RightPanelShell showDivider={!showSummary}>
            <OfficeSpaceFormPanel />
          </RightPanelShell>
        </div>

        {/* Summary panel (appears on right after submit) */}
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-[608px] transition-opacity duration-300',
            showSummary ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <OfficeSpaceSummaryPanel
            results={results}
            onEdit={() => dispatch(setShowSummary(false))}
          />
        </div>
      </div>

      {/* vertical bar element from Figma */}
      <div
        aria-hidden='true'
        className='absolute bottom-0 left-1/2 h-[142px] w-[18px] -translate-x-1/2 bg-[#0a2540] lg:left-[calc(50%-8px)]'
      />

      {/* inset shadow like Figma */}
      <div className='pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_-2px_3px_#cfd1d3]' />
    </Card>
  );
}
