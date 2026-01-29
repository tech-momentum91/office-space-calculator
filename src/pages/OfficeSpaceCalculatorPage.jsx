import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import mainBg from '@/assets/Main.jpg';
import faqBg from '@/assets/faq.png';
import illustration from '@/assets/illustation.png';
import FaqSection from '@/components/sections/FaqSection';
import OfficeSpaceCalculatorCard from '@/components/office-space-calculator/OfficeSpaceCalculatorCard';
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
        className='relative overflow-visible min-h-[560px] sm:min-h-[640px] lg:h-[664px]'
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

      {/* Calculator (Figma: node-id=1209-39295) */}
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
