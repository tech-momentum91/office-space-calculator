import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import mainBg from '@/assets/Main.jpg';
import faqBg from '@/assets/faq.png';
import illustration from '@/assets/illustation.png';
import FaqSection from '@/components/sections/FaqSection';
export default function OfficeSpaceCalculatorPage() {
  const faqItems = [
    {
      question: 'Is there a free trial available?',
      answer:
        "Yes, you can try us for free for 30 days. If you want, we'll onboarding you with all the tools and guide you through the project setup. We're here to help you get started as soon as possible.",
    },
    {
      question: 'Can I change my plan later?',
      answer:
        "Of course! You can upgrade or downgrade your plan at any time. Changes to your plan will be reflected immediately, and you'll only be charged for the difference.",
    },
    {
      question: 'What is your cancellation policy?',
      answer:
        "You can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period, and you won't be charged again.",
    },
    {
      question: 'Can other info be added to an invoice?',
      answer:
        'Yes, you can add additional information to your invoices such as PO numbers, tax IDs, or any other custom fields you need. Contact our support team to set this up.',
    },
    {
      question: 'How does billing work?',
      answer:
        "We bill monthly or annually depending on your preference. You'll receive an invoice at the beginning of each billing period, and your card will be charged automatically.",
    },
    {
      question: 'How do I change my account email?',
      answer:
        "You can change your account email from your account settings. Navigate to Settings > Account > Email and update your email address. You'll receive a confirmation email to verify the change.",
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
      <FaqSection faqItems={faqItems} />

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
