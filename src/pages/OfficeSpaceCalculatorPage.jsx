import Header from '@/components/layouts/Header';

import mainBg from '@/assets/Main.jpg';

export default function OfficeSpaceCalculatorPage() {
  return (
    <div className='min-h-screen '>
      <Header />

      {/* Hero (design scaffold; we can refine to match Figma sections) */}
      <section
        className='relative overflow-hidden'
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${mainBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className='mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-5 lg:px-8 lg:py-20'>
          <div className='max-w-[820px]'>
            <p className='mb-3 text-sm font-semibold tracking-[0.12em] text-white/70'>
              OFFICE SPACE CALCULATOR
            </p>
            <h1 className='text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[44px]'>
              Calculate how much office space you really need
            </h1>
            <p className='mt-4 max-w-[680px] text-[16px] leading-7 text-white/70'>
              Answer a few quick questions and get an estimated space requirement. (Next step: we’ll
              match this section exactly to the Figma layout and typography.)
            </p>
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
    </div>
  );
}
