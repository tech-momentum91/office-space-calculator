import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import illustration from '@/assets/illustation.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, Coffee, Lightbulb } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectOfficeCalculatorValues } from '@/store/slices/officeCalculatorSlice';
import { calcResults, normalizeForCalc } from '@/utils/office-space-calculator/calcResults';
import buildingIcon from '@/assets/svg/building-05.svg';
import chairIcon from '@/assets/svg/chair-01.svg';
import monitorIcon from '@/assets/svg/monitor-05.svg';
import DetailedSpaceBreakdownTable from '@/components/office-space-calculator/DetailedSpaceBreakdownTable';

function formatLayoutLabel(layoutType) {
  if (layoutType === 'compact') return 'Compact';
  if (layoutType === 'standard') return 'Standard';
  return 'Lavish';
}

function StatCard({ title, value, unit, icon, iconWrapperClassName, gradient, meta, className }) {
  return (
    <Card
      className={cn(
        'flex h-[160px] flex-1 flex-col gap-4 rounded-[12px] border border-[#f8fcff] bg-transparent p-4 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]',
        className,
      )}
      style={gradient ? { backgroundImage: gradient } : undefined}
    >
      <div className='flex w-full items-center gap-3' data-node-id='1209:36520'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            iconWrapperClassName,
          )}
        >
          {icon}
        </div>
        <div className="flex-1 text-[16px] font-semibold leading-[24px] text-[#667085] font-['Plus Jakarta Sans',sans-serif]">
          {title}
        </div>
      </div>
      <div className='flex items-baseline gap-2'>
        <span className="inline-block whitespace-nowrap text-[32px] font-semibold leading-[1.2] tracking-[-1.6px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
          {value}
        </span>
        <span className="inline-block whitespace-nowrap text-[20px] font-semibold leading-[1.2] tracking-[-1px] text-[#475467] font-['Plus_Jakarta_Sans',sans-serif]">
          {unit}
        </span>
      </div>
      {meta ? (
        <div className='flex w-full items-center gap-1' data-node-id='1209:36544'>
          {meta}
        </div>
      ) : null}
    </Card>
  );
}

export default function DetailsSpaceAnalysisPage() {
  const values = useSelector(selectOfficeCalculatorValues);
  const layoutType = values?.layoutType ?? 'compact';

  const results = calcResults(normalizeForCalc(values));
  const productivity = results?.zonal?.find((z) => z.label === 'Productivity')?.sqft ?? 0;
  const utility = results?.zonal?.find((z) => z.label === 'Utility')?.sqft ?? 0;
  const spacePerPerson = results?.spacePerPerson ?? 0;

  const efficiencyOpportunities = [
    {
      title: 'Reduce Cabin Size',
      body: 'Reduce Manager Cabins from 100 sq ft. to 50 sq ft.(Compact Standard).',
      save: 'Save 300 sq ft.',
      topBorderColor: 'rgba(223, 78, 78, 0.6)',
    },
    {
      title: 'Change the size of Director Cabins',
      body: 'Reduce Manager Cabins from 100 sq ft. to 50 sq ft.(Compact Standard).',
      save: 'Save 300 sq ft.',
      topBorderColor: 'rgba(223, 78, 78, 0.6)',
    },
    {
      title: 'Reduce No. of Meeting Rooms',
      body: '10 meeting rooms will be sufficient for your team. Remove the access rooms',
      save: 'Save 1000 sq ft.',
      topBorderColor: '#eadf89',
    },
  ];

  const breakdownRows = [
    {
      areaGroup: 'Productivity Area',
      rows: [
        {
          name: 'Workstations',
          layout: formatLayoutLabel(layoutType),
          count: results.workstations,
          areaPerUnit: results.spacePerPerson,
          total: results.workstations * results.spacePerPerson,
        },
        {
          name: 'Meeting Rooms',
          layout: formatLayoutLabel(layoutType),
          count: results.meetingRooms,
          areaPerUnit: results?.unitAreas?.meetingRoom ?? 30,
          total: results.meetingRooms * (results?.unitAreas?.meetingRoom ?? 30),
        },
        {
          name: 'Manager Cabins',
          layout: formatLayoutLabel(layoutType),
          count: results.managerCabins,
          areaPerUnit: results?.unitAreas?.directorCabin ?? 40,
          total: results.managerCabins * (results?.unitAreas?.directorCabin ?? 40),
        },
        {
          name: 'Leadership Cabins',
          layout: formatLayoutLabel(layoutType),
          count: results.leadershipCabins,
          areaPerUnit: results?.unitAreas?.leadershipCabin ?? 50,
          total: results.leadershipCabins * (results?.unitAreas?.leadershipCabin ?? 50),
        },
      ],
      subtotal: productivity,
    },
    {
      areaGroup: 'Utility and Breakout',
      rows:
        results?.utilityBreakdown?.length > 0
          ? results.utilityBreakdown.map((row) => ({
            name: row.label,
            layout: formatLayoutLabel(layoutType),
            count: row.count,
            areaPerUnit: Math.round(row.sqft / Math.max(1, row.count)),
            total: Math.round(row.sqft),
          }))
          : [
            {
              name: 'Utility',
              layout: formatLayoutLabel(layoutType),
              count: 1,
              areaPerUnit: Math.round(utility),
              total: Math.round(utility),
            },
          ],
      subtotal: utility,
    },
    {
      areaGroup: 'Circulation Area',
      rows: [
        {
          name: 'Circulation',
          layout: formatLayoutLabel(layoutType),
          count: 1,
          areaPerUnit: results?.zonal?.find((z) => z.label === 'Circulation space')?.sqft ?? 0,
          total: results?.zonal?.find((z) => z.label === 'Circulation space')?.sqft ?? 0,
        },
      ],
      subtotal: results?.zonal?.find((z) => z.label === 'Circulation space')?.sqft ?? 0,
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      <Header />

      {/* Page content */}
      <div className='mx-auto w-full max-w-[1280px] px-6 pb-16 pt-10'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-[2px] items-start'>
            <div className='flex flex-col items-start'>
              <div className="text-[36px] font-semibold leading-[1.2] tracking-[-1.8px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
                Your Detailed Space Analysis
              </div>
            </div>
            <div className='flex flex-col items-start justify-center py-1 h-[38px]'>
              <div className="text-[20px] font-medium leading-[1.2] tracking-[-0.8px] text-[#667085] font-['Plus_Jakarta_Sans',sans-serif]">
                Optimise your office space with intelligent recommendations
              </div>
            </div>
          </div>

          {/* Top stats */}
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4' data-node-id='1209:36517'>
            <StatCard
              title='Total Space Needed'
              value={results.estimatedSpaceNeeded.toLocaleString()}
              unit='sqft.'
              gradient='linear-gradient(109deg, rgba(227, 235, 253, 0.00) -28.7%, #E3EBFD 216.83%)'
              iconWrapperClassName='bg-[#3c4fb7]'
              icon={<img src={buildingIcon} alt='' aria-hidden='true' className='h-4 w-4' />}
            />
            <StatCard
              title='Seating Capacity'
              value={results.workstations.toLocaleString()}
              unit='sqft.'
              gradient='linear-gradient(107deg, rgba(254, 239, 223, 0.00) -36.03%, #FEEFDF 100.13%)'
              iconWrapperClassName='bg-[#ec670b] border-[0.667px] border-white'
              icon={<img src={chairIcon} alt='' aria-hidden='true' className='h-4 w-4' />}
              meta={
                <>
                  <span className="text-[12px] font-medium leading-[20px] text-[#d92d20] font-['Plus_Jakarta_Sans',sans-serif]">
                    {spacePerPerson} sq ft.
                  </span>
                  <span className="text-[12px] font-medium leading-[20px] text-[#475467] font-['Plus_Jakarta_Sans',sans-serif]">
                    space per person
                  </span>
                </>
              }
            />
            <StatCard
              title='Production Area'
              value={productivity.toLocaleString()}
              unit='sqft.'
              gradient='linear-gradient(107deg, rgba(228, 247, 243, 0.00) -40.8%, #E4F7F3 100%)'
              iconWrapperClassName='bg-[#10a684] border-[0.667px] border-white'
              icon={<img src={monitorIcon} alt='' aria-hidden='true' className='h-4 w-4' />}
            />
            <StatCard
              title='Utility and Breakout'
              value={utility.toLocaleString()}
              unit='sqft.'
              gradient='linear-gradient(107deg, rgba(247, 241, 255, 0.00) -51.92%, #F7F1FF 100%)'
              iconWrapperClassName='bg-[#7f56d9]'
              icon={<Coffee className='h-4 w-4 text-white' aria-hidden='true' />}
            />
          </div>

          {/* Breakdown + opportunities */}
          <div className='grid gap-4 lg:grid-cols-[1fr_360px]'>
            <DetailedSpaceBreakdownTable
              breakdownRows={breakdownRows}
              grandTotalSqft={results.estimatedSpaceNeeded}
              efficiencyOpportunitiesCount={efficiencyOpportunities.length}
            />

            <Card className='overflow-hidden rounded-[10.66px] border-[0.888px] border-[#eaecf0] bg-[#fafbfc] shadow-[0px_0.888px_1.777px_rgba(16,24,40,0.05)]'>
              {/* Header */}
              <div className='flex items-center gap-[10.66px] border-b-[0.888px] border-[#eaecf0] bg-[#fafbfc] px-[21.32px] py-[14.213px]'>
                <div
                  className='flex h-[42.64px] w-[42.64px] items-center justify-center rounded-full border border-[#f6d67a] bg-[#fff4d6]'
                  data-node-id='1209:36712'
                >
                  <Lightbulb className='h-5 w-5 text-[#f97316]' aria-hidden='true' />
                </div>
                <div
                  className="flex-1 text-[15.99px] font-semibold leading-[21.32px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]"
                  data-node-id='1209:36713'
                >
                  Efficiency Opportunities
                </div>
              </div>

              {/* Cards */}
              <div
                className='flex flex-col gap-[21.32px] px-[21.32px] py-[9.772px]'
                data-node-id='1209:36714'
              >
                {efficiencyOpportunities.map((item) => (
                  <div
                    key={item.title}
                    className='rounded-b-[10.66px] border-t-[4.442px]'
                    style={{ borderTopColor: item.topBorderColor }}
                  >
                    <Card className='overflow-hidden rounded-b-[10.66px] border border-[#eaecf0] bg-white shadow-[0px_0.888px_1.777px_rgba(16,24,40,0.05)]'>
                      <div className='flex flex-col gap-[14.213px] p-[21.32px]'>
                        <div className='flex items-start gap-[23.985px]'>
                          <div className='flex-1'>
                            <div className="text-[14px] font-semibold leading-[21.32px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
                              {item.title}
                            </div>
                          </div>
                          <div className='flex items-center gap-[3.553px] rounded-[6px] border border-[#e2e4e9] bg-white px-[7.107px] py-[3.553px] pl-[3.553px]'>
                            <CheckCircle2
                              className='h-[21.32px] w-[21.32px] text-[#12b76a]'
                              aria-hidden='true'
                            />
                            <span className="text-[10.66px] font-medium leading-[14.213px] text-[#525866] font-['Plus_Jakarta_Sans',sans-serif]">
                              {item.save}
                            </span>
                          </div>
                        </div>
                        <div className="text-[14px] font-normal leading-[17.766px] text-[#475467] font-['Plus_Jakarta_Sans',sans-serif]">
                          {item.body}
                        </div>
                      </div>

                      <div className='border-t border-[#eaecf0]' />
                      <div className='flex items-center justify-center py-[14.213px]'>
                        <button
                          type='button'
                          className="text-[14px] font-semibold leading-[17.766px] text-[#2563eb] font-['Plus_Jakarta_Sans',sans-serif]"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Apply all */}
              <button
                type='button'
                className="w-full border-t-[0.888px] border-[#d0d5dd] bg-white py-4 text-center text-[15.99px] font-semibold leading-[43.528px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]"
                data-node-id='1209:36742'
              >
                Apply All
              </button>
            </Card>
          </div>
        </div>
      </div>

      {/* BOQ banner */}
      <div className='bg-[#071a2f]'>
        <div className='mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-6 py-6'>
          <div>
            <div className="text-[18px] font-semibold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Want to explore BOQ?
            </div>
            <div className="text-[12px] font-medium text-white/70 font-['Plus_Jakarta_Sans',sans-serif]">
              Check out our AI BOQ Estimator and make your plan full proof!
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='outline'
              className='h-10 rounded-[8px] border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
            >
              Dismiss
            </Button>
            <Button type='button' variant='gradient' className='h-10 rounded-[8px] px-4'>
              Checkout BOQ Estimator
            </Button>
          </div>
        </div>
      </div>

      {/* Illustration + footer */}
      <section className='py-0 bg-white border-t border-neutral-200'>
        <div className='container mx-auto px-6'>
          <div className='py-8'>
            <img
              src={illustration}
              alt='Office workspace illustration'
              loading='lazy'
              className='w-full h-auto'
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
