import { useState } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';

export default function FaqSection({ faqItems }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <section className='bg-[#0A2540]'>
      {/* Fixed frame size (Width 1445px, Height 1016px) */}
      <div className='relative mx-auto w-full max-w-[1445px] h-[1016px] overflow-hidden'>
        <div className='pointer-events-none absolute inset-0 opacity-60'>
          <div className='absolute left-1/2 top-1/2 h-[3024px] w-[1074px] -translate-x-1/2 -translate-y-1/2'>
            <div className='-rotate-6 -skew-x-6 scale-y-[0.99]'>
              <div
                className='h-[1541.644px] w-[1080px]'
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, transparent 1px, transparent 270px)',
                }}
              />
            </div>
          </div>
        </div>

        <div className='relative z-10 mx-auto h-full w-full max-w-[1280px] px-4 sm:px-5 lg:px-[32px] flex items-center'>
          <div className='w-full flex flex-col gap-10 lg:flex-row lg:gap-[5px]'>
            {/* Left heading */}
            <div className='lg:w-[618px]'>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[46px] leading-[56.2px] tracking-[-2.56px] text-white">
                <span>Lorem ipsum dolor sit </span>
                <span className='text-[#A0A0A6]'>amet consectetur. Lobortis ac ornare sed</span>
              </h2>
            </div>

            {/* Right accordion */}
            <div className='w-full min-w-0 lg:w-[576px] lg:min-w-[480px]'>
              <div className='flex flex-col gap-4'>
                {faqItems.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl p-8 transition-colors ${
                        isOpen
                          ? 'bg-[#0E3459]'
                          : 'bg-transparent hover:bg-[#0E3459]/40 cursor-pointer'
                      }`}
                    >
                      <button
                        type='button'
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                        className='flex w-full items-start justify-between gap-6 text-left'
                      >
                        <div className='min-w-0'>
                          <div className="font-['Inter',sans-serif] font-medium text-[18px] leading-[28px] text-white">
                            {item.question}
                          </div>
                        </div>
                        <div className='pt-[2px] text-white/70 cursor-pointer'>
                          {isOpen ? (
                            <MinusCircle className='h-6 w-6' />
                          ) : (
                            <PlusCircle className='h-6 w-6' />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="mt-2 font-['Inter',sans-serif] text-[16px] leading-[24px] text-[#A0A0A6]">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
