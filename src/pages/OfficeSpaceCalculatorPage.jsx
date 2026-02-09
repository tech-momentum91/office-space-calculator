import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import mainBg from '@/assets/image/Main.jpg';
import illustration from '@/assets/image/illustation.png';
import OfficeSpaceCalculatorCard from '@/components/office-space-calculator/OfficeSpaceCalculatorCard';
export default function OfficeSpaceCalculatorPage() {
  return (
    <div className='min-h-screen '>
      <section
        className='relative overflow-visible min-h-[560px] sm:min-h-[640px] lg:h-[664px]'
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${mainBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <Header />

        <div className='relative mx-auto w-full max-w-[1280px] px-4 pb-24 pt-6 sm:px-5 lg:px-8 lg:pb-[215px] lg:pt-10'>
          <div className='grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-16'>
            <h1 className='flex w-full flex-col justify-center text-[52px] font-semibold leading-[104%] tracking-[-3px] text-white sm:text-[64px] lg:h-[230px] lg:w-[624px] lg:text-[64px]'>
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
        </div>
      </section>

      <section
        id='calculator'
        className="relative z-10 -mt-24 pb-10 pt-0 sm:-mt-28 sm:pb-14 lg:-mt-[201px] before:absolute before:inset-x-0 before:bottom-0 before:top-24 before:bg-[#f6f9fc] before:content-[''] sm:before:top-28 lg:before:top-[201px]"
      >
        <div className='relative mx-auto w-full max-w-[1280px] px-4 sm:px-5 lg:px-8'>
          <div className='relative mx-auto w-full max-w-[1216px]'>
            <OfficeSpaceCalculatorCard />
          </div>
        </div>
      </section>

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
