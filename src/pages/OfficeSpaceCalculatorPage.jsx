import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import mainBg from '@/assets/Main.jpg';
import faqBg from '@/assets/faq.png';

export default function OfficeSpaceCalculatorPage() {
  function FaqAccordion({ items }) {
    const [openIdx, setOpenIdx] = useState(0);

    return (
      <div className='divide-y divide-white/10'>
        {items.map((item, idx) => {
          const isOpen = idx === openIdx;
          const contentId = `faq-panel-${idx}`;
          return (
            <div key={item.q} className='py-5'>
              <button
                type='button'
                className='flex w-full items-center justify-between gap-6 text-left'
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => setOpenIdx((v) => (v === idx ? -1 : idx))}
              >
                <span className='text-[18px] font-semibold leading-7 text-white'>{item.q}</span>
                <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85'>
                  {isOpen ? (
                    <Minus className='h-4 w-4' aria-hidden='true' />
                  ) : (
                    <Plus className='h-4 w-4' aria-hidden='true' />
                  )}
                </span>
              </button>

              <div
                id={contentId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className='overflow-hidden'>
                  <p className='mt-3 max-w-[70ch] text-[16px] leading-7 text-white/75'>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const faqs = [
    {
      q: 'How does the Office Space Calculator work?',
      a: 'Enter your team size and workplace preferences. The calculator estimates the total area and helps you understand how different room mixes impact space efficiency.',
    },
    {
      q: 'What inputs do I need to provide?',
      a: 'Typically: team size, workstyle (hybrid / fixed seating), meeting needs, and any special zones (reception, pantry, collaboration). You can refine later based on your exact requirements.',
    },
    {
      q: 'Is the estimate accurate for every office?',
      a: 'It’s a planning estimate. Final area depends on layout, circulation, building constraints, and your room standards. Use it to benchmark and then validate with a detailed layout.',
    },
    {
      q: 'Can you help us design and build the office?',
      a: 'Yes. Phi Designs can take you from strategy and space planning to design, execution, and handover.',
    },
  ];
  return (
    <div className='min-h-screen '>
      <section
        className='relative overflow-hidden min-h-[560px] sm:min-h-[640px] lg:h-[664px]'
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${mainBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* subtle vignette to match Figma */}

        {/* Header sits on top of hero background */}
        <Header />

        {/* Hero (Figma: node-id=1209-38023) */}
        <div className='relative mx-auto w-full max-w-[1280px] px-4 pb-10 pt-6 sm:px-5 lg:px-8 lg:pb-14 lg:pt-10'>
          <div className='grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-16'>
            <h1 className='flex w-full flex-col justify-center text-[52px] font-semibold leading-[104%] tracking-[-3px] text-white sm:text-[64px] lg:h-[201px] lg:w-[624px] lg:text-[64px]'>
              <span className='block'>Office Space</span>
              <span className='block'>
                <span>Calculator</span>
                <span className='text-white/55'> for Modern</span>
              </span>
              <span className='block text-white/55'>Workplaces</span>
            </h1>

            <div className='pt-2 lg:pt-6'>
              <p className='w-full text-[20px] font-medium leading-[133%] tracking-[0px] text-white/85 lg:w-[523px]'>
                Calculate square footage, optimise room mix, and evaluate space efficiency.
              </p>

              <a
                href='#calculator'
                className='mt-6 inline-flex h-[48px] min-w-[190px] items-center justify-center rounded-[8px] border border-[#1b094e0a] bg-white px-[28px] text-[15px] font-semibold leading-[24px] text-[#3c4fb7] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-300 hover:bg-white/95 active:translate-y-px'
              >
                Calculate now
              </a>
            </div>
          </div>

          {/* Dashed guideline + center mark */}
        </div>
      </section>

      {/* Calculator container (placeholder for now) */}
      <main className='mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-5 lg:px-8'>
        <div className='grid gap-6 lg:grid-cols-[1fr_420px]'>
          <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm'>
            <h2 className='text-xl font-semibold text-neutral-900'>Your inputs</h2>
            <p className='mt-2 text-sm text-neutral-600'>
              We’ll implement the full calculator UI here per Figma.
            </p>

            <div className='mt-6 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-xl border border-neutral-200 bg-neutral-50 p-4'>
                <div className='text-sm font-medium text-neutral-900'>Team size</div>
                <div className='mt-1 text-sm text-neutral-600'>Coming next</div>
              </div>
              <div className='rounded-xl border border-neutral-200 bg-neutral-50 p-4'>
                <div className='text-sm font-medium text-neutral-900'>Workstyle</div>
                <div className='mt-1 text-sm text-neutral-600'>Coming next</div>
              </div>
            </div>
          </section>

          <aside className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm'>
            <h2 className='text-xl font-semibold text-neutral-900'>Estimated space</h2>
            <p className='mt-2 text-sm text-neutral-600'>We’ll compute and show results here.</p>

            <div className='mt-6 rounded-xl bg-neutral-50 p-4'>
              <div className='text-sm text-neutral-600'>Total</div>
              <div className='mt-1 text-3xl font-semibold text-neutral-900'>— sq ft</div>
            </div>
          </aside>
        </div>
      </main>

      {/* FAQ section (Figma: node-id=1360-9137) */}
      <section
        className='relative overflow-hidden text-white'
        style={{
          backgroundImage: `url(${faqBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className='mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-[112px] lg:py-[120px]'>
          <div className='grid gap-10 lg:grid-cols-[520px_1fr] lg:gap-16'>
            <div className='flex flex-col lg:pr-12 lg:border-r lg:border-white/10'>
              <h2 className='text-balance text-[44px] font-semibold leading-[104%] tracking-[-2px] text-white sm:text-[56px] lg:text-[64px] lg:tracking-[-3px]'>
                Frequently
                <br />
                asked questions
              </h2>
            </div>

            <div className='rounded-[20px] border border-white/12 bg-white/[0.05] px-6 py-3 backdrop-blur-md shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-4'>
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
