import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import rightpanelBg from '@/assets/image/rightpannel.png';
import { useNavigate } from 'react-router-dom';
import { RiRuler2Line } from 'react-icons/ri';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { FaArrowRight } from 'react-icons/fa';
import { FiArrowUp } from 'react-icons/fi';

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatCompact(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return '—';
  // Intl outputs like "15K" → match UI style "15k"
  return compactNumberFormatter.format(num).replace('K', 'k').replace('M', 'm').replace('B', 'b');
}

function formatDeltaSqft(delta) {
  const abs = Math.abs(Number(delta) || 0);
  // Keep full numbers for small values (matches Figma “2000”)
  if (abs < 10000) return abs.toLocaleString();
  // Compact for very large values to avoid UI overflow
  return formatCompact(abs);
}

function formatTopSqft(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  // Keep full numbers up to 5 digits; compact beyond that to stay on one line.
  if (Math.abs(n) < 100000) return n.toLocaleString();
  return formatCompact(n);
}

export default function OfficeSpaceSummaryPanel({ results, onEdit }) {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <div className='relative h-full w-[608px] overflow-hidden'>
        <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
          <div className='absolute inset-0 bg-[#e7eaf1]' />
          <div className='absolute inset-0 overflow-hidden opacity-90'>
            <img
              alt=''
              src={rightpanelBg}
              className='absolute left-0 top-[-17.71%] h-[135.42%] w-full max-w-none object-cover'
            />
          </div>
        </div>

        {/* Top results (Figma node-id=1209:42115) */}
        <div className='absolute left-[124px] top-[48px] flex w-[360px] flex-col items-center gap-4'>
          <div className='flex w-[248px] flex-col items-center gap-6 text-center'>
            <div
              className='relative size-[48px] rounded-[999px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]'
              style={{
                backgroundImage:
                  'linear-gradient(115deg, #0D47A1 8.4861%, #0058A6 25.092%, #0066A4 41.697%, #00729E 58.303%, #007E97 74.908%, #00888F 91.514%)',
              }}
            >
              <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                <div className='relative size-6 overflow-hidden'>
                  <div className='absolute inset-[16.25%]'>
                    <RiRuler2Line className='size-6 shrink-0 text-white' aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex w-full flex-col items-center gap-2'>
              <div
                className="whitespace-nowrap bg-clip-text text-[48px] font-medium leading-[56px] tracking-[-1.2288px] text-transparent font-['Plus_Jakarta_Sans',sans-serif]"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #7D2255 0%, #2048B2 50%, #CA96E2 100%), linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.9) 100%)',
                }}
              >
                {results ? `${formatTopSqft(results.estimatedSpaceNeeded)}\u00A0sqft.` : '—'}
              </div>
              <div className="bg-[rgba(0,0,0,0.61)] bg-clip-text text-[16px] font-normal leading-[1.2] text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
                Estimated Space Needed
              </div>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center gap-2 rounded-[999px] border border-[#e2e4e9] bg-white py-1 pl-2 pr-3'>
                <div
                  className={cn('relative size-6 shrink-0', results?.delta < 0 ? 'rotate-180' : '')}
                >
                  <FiArrowUp className='size-6 shrink-0 text-[#375DFB]' aria-hidden />
                </div>
                <div className="min-w-0 flex-1 truncate text-center text-[14px] font-normal leading-[1.2] tracking-[-0.3584px] text-[#525866] font-['Plus_Jakarta_Sans',sans-serif]">
                  {results?.delta === undefined
                    ? 'Add existing carpet area to compare'
                    : `${formatDeltaSqft(results.delta)} sq ft ${
                      results.delta >= 0
                        ? 'higher than your existing carpet area'
                        : 'lower than your existing carpet area'
                    }`}
                </div>
              </div>
            </TooltipTrigger>
            {results?.delta !== undefined && (
              <TooltipContent
                variant='light'
                side='top'
                sideOffset={8}
                className='max-w-[320px] break-words'
              >
                {`${Math.abs(results.delta).toLocaleString()} sq ft ${
                  results.delta >= 0
                    ? 'higher than your existing carpet area'
                    : 'lower than your existing carpet area'
                }`}
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Key Insights (Figma node-id=1209:42129) */}
        <div className='absolute left-[63px] top-[275px] w-[497px]'>
          <div className='relative h-[309px] w-full overflow-hidden rounded-[16px] bg-[#fcfcfc]'>
            <div className='absolute left-6 top-6 flex w-[447px] flex-col gap-3'>
              <p className="bg-gradient-to-b from-[#101828] via-[#101828] to-[rgba(20,25,77,0.8)] bg-clip-text text-[16px] font-semibold leading-[1.2] tracking-[-0.32px] text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
                Key Insights
              </p>

              <div className='flex w-full flex-col gap-[6px] overflow-hidden rounded-[10px] border border-[#e2e4e9] bg-white px-4 py-3'>
                <div className='relative h-4 w-[120px]'>
                  <p className="absolute left-0 top-0 text-[12px] font-medium leading-[1.3] text-[#656a6b] font-['Plus_Jakarta_Sans',sans-serif]">
                    Seating capacity
                  </p>
                </div>

                <div className='flex items-end justify-between gap-4'>
                  <p className="bg-gradient-to-b from-[#101828] via-[#101828] to-[rgba(20,25,77,0.8)] bg-clip-text text-[20px] font-medium leading-[0] text-transparent font-['Inter',sans-serif]">
                    <span className='leading-[28px]'>{results ? results.workstations : '—'}</span>
                    <span className='leading-[28px]'> </span>
                    <span className='leading-[28px] text-[#656a6b]'>
                      {results ? `(${results.seatingSqft} sqft.)` : ''}
                    </span>
                  </p>

                  <div className='flex items-center gap-1'>
                    <div className='relative size-6 overflow-hidden'>
                      <div className='absolute inset-[18.75%]'>
                        <BsFillInfoCircleFill
                          className='size-4 shrink-0 text-gray-400'
                          aria-hidden
                        />
                      </div>
                    </div>
                    <div className="py-[5px] text-[12px] font-medium leading-[1.3] text-[#656a6b] font-['Plus_Jakarta_Sans',sans-serif]">
                      <span className='font-bold'>
                        {results ? `${results.spacePerPerson}sqft ` : '—'}
                      </span>
                      <span>Space per Person</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex w-full gap-4'>
                {/* Zonal distribution */}
                <div className='flex flex-col'>
                  <div className='rounded-tl-[8px] rounded-tr-[8px] bg-[#3f9cb4] px-[10px] py-1'>
                    <div className="text-[12px] font-medium leading-[1.3] text-white font-['Plus_Jakarta_Sans',sans-serif]">
                      Zonal Distribution
                    </div>
                  </div>
                  <div className='h-[120px] w-[215.5px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] bg-[#eaecf5] px-3'>
                    {results?.zonal?.map((row, idx) => (
                      <div
                        key={row.label}
                        className={cn(
                          // Figma row (1209:42147): no clipping when content fits
                          'flex items-center justify-between gap-2 py-[12px] text-[12px]',
                          idx !== results.zonal.length - 1 ? 'border-b border-[#d5d9eb]' : '',
                        )}
                      >
                        <div className="w-[110px] shrink-0 whitespace-pre-wrap font-medium leading-[1.3] tracking-[-0.36px] text-[#667085] font-['Plus_Jakarta_Sans',sans-serif]">
                          {row.label}
                        </div>
                        <div className='min-w-0 flex-1 text-right'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p
                                className="truncate bg-gradient-to-b from-[#101828] via-[#101828] to-[rgba(20,25,77,0.8)] bg-clip-text text-center font-semibold leading-[0] tracking-[-0.24px] text-transparent font-['Plus_Jakarta_Sans',sans-serif]"
                                style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                              >
                                <span className='leading-[1.2]'>{row.pct}% </span>
                                <span className='leading-[1.2] text-[#656a6b]'>
                                  ({formatCompact(row.sqft)} sqft.)
                                </span>
                              </p>
                            </TooltipTrigger>
                            <TooltipContent
                              variant='light'
                              side='top'
                              sideOffset={8}
                              className='max-w-[260px] break-words'
                            >
                              {row.pct}% ({row.sqft.toLocaleString()} sqft.)
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collaboration area */}
                <div className='flex flex-col'>
                  <div className='rounded-tl-[8px] rounded-tr-[8px] bg-[#366b9b] px-[10px] py-1'>
                    <div className="text-[12px] font-medium leading-[1.3] text-white font-['Plus_Jakarta_Sans',sans-serif]">
                      Collaboration Area
                    </div>
                  </div>
                  <div className='h-[120px] w-[215.5px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] bg-[#eaecf5] px-3'>
                    {results?.collaboration?.map((row, idx) => (
                      <div
                        key={row.label}
                        className={cn(
                          'flex items-center justify-between gap-2 py-[12px] text-[12px]',
                          idx !== results.collaboration.length - 1
                            ? 'border-b border-[#d5d9eb]'
                            : '',
                        )}
                      >
                        <div className="w-[110px] shrink-0 whitespace-pre-wrap font-medium leading-[1.3] tracking-[-0.36px] text-[#667085] font-['Plus_Jakarta_Sans',sans-serif]">
                          {row.label}
                        </div>
                        <div className='min-w-0 flex-1 text-right'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p
                                className="truncate bg-gradient-to-b from-[#101828] via-[#101828] to-[rgba(20,25,77,0.8)] bg-clip-text text-center font-semibold leading-[0] tracking-[-0.24px] text-transparent font-['Plus_Jakarta_Sans',sans-serif]"
                                style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                              >
                                <span className='leading-[1.2]'>{row.count} </span>
                                <span className='leading-[1.2] text-[#656a6b]'>
                                  ({formatCompact(row.sqft)} sqft.)
                                </span>
                              </p>
                            </TooltipTrigger>
                            <TooltipContent
                              variant='light'
                              side='top'
                              sideOffset={8}
                              className='max-w-[260px] break-words'
                            >
                              {typeof row.unitArea === 'number'
                                ? `${row.count} × ${row.unitArea} = ${row.sqft.toLocaleString()} sqft.`
                                : `${row.count} (${row.sqft.toLocaleString()} sqft.)`}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA (Figma node-id=1209:42170) */}
        <div className='absolute left-1/2 top-[616px] w-[462px] -translate-x-1/2 text-center'>
          <div className="text-[18px] font-semibold leading-[30px] tracking-[-0.4608px] text-[#130636] font-['Plus_Jakarta_Sans',sans-serif]">
            Want a room-by-room breakdown and deeper insights?
          </div>

          <button
            type='button'
            className='mx-auto mt-4 rounded-[8px] p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]'
            onClick={() => navigate('/details-space-analysis')}
            style={{
              backgroundImage:
                'linear-gradient(161.957deg, #0D47A1 8.4861%, #0058A6 25.092%, #0066A4 41.697%, #00729E 58.303%, #007E97 74.908%, #00888F 91.514%)',
            }}
          >
            <div className='flex items-center gap-[9px]'>
              <div className="text-[15px] font-bold leading-[24px] text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Explore Your Detailed Space Report
              </div>
              <div className='flex size-6 items-center justify-center'>
                <FaArrowRight className='size-6 shrink-0 text-white' aria-hidden />
              </div>
            </div>
          </button>
        </div>

        {/* inset shadow like Figma */}
        <div className='pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_-3px_3px_rgba(228,229,231,0.48)]' />
      </div>
    </TooltipProvider>
  );
}
