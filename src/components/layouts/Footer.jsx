export default function Footer() {
  const companyLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about-us' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Walkthrough', href: '/virtual-walkthroughs' },
    { label: 'Interior Financing', href: '/office-interior-financing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Vendor partners', href: '/vendor-partners' },
    { label: 'Careers', href: '/careers' },
  ];

  const serviceAreas = [
    { label: 'Office Interiors - Mumbai', href: '/office-interior-designer-in-mumbai' },
    { label: 'Office Interiors - Pune', href: '/office-interior-designer-in-pune' },
    { label: 'Office Interiors - Bengaluru', href: '/office-interior-designer-in-bangalore' },
    { label: 'Office Interiors - Noida', href: '/office-interior-designer-in-noida' },
    { label: 'Office Interiors - Hyderabad', href: '/office-interior-designer-in-hyderabad' },
    { label: 'Office Interiors - Rajkot', href: '/office-interior-designer-in-rajkot' },
  ];

  const cityPages = [
    { label: 'Office Interiors - Delhi', href: '/office-interior-designer-in-delhi' },
    { label: 'Office Interiors - Gurgaon', href: '/office-interior-designer-in-gurgaon' },
    { label: 'Office Interiors - Kolkata', href: '/office-interior-designers-in-kolkata' },
    { label: 'Office Interiors - Ahmedabad', href: '/office-interior-designer-in-ahmedabad' },
    { label: 'Office Interiors - Udaipur', href: '/office-interior-designers-in-udaipur' },
    { label: 'Office Interiors - Vadodara', href: '/office-interior-designer-in-vadodara' },
  ];

  const cityPagesMore = [
    { label: 'Office Interiors - Jaipur', href: '/office-interior-designer-in-jaipur' },
    { label: 'Office Interiors - Chandigarh', href: '/office-interior-designers-in-chandigarh' },
    { label: 'Office Interiors - Kochi', href: '/office-interior-designers-in-kochi' },
    { label: 'Office Interiors - Chennai', href: '/office-interior-designer-in-chennai' },
    { label: 'Office Interiors - Thane', href: '/office-interior-designers-in-thane' },
  ];

  const moreLocationsCols = [
    [
      { label: 'Office Interiors - Amritsar', href: '/office-interior-designers-in-amritsar' },
      { label: 'Office Interiors - Ghaziabad', href: '/office-interior-designers-in-ghaziabad' },
      { label: 'Office Interiors - Faridabad', href: '/office-interior-designers-in-faridabad' },
      { label: 'Office Interiors - Agra', href: '/office-interior-designers-in-agra' },
      { label: 'Office Interiors - Patiala', href: '/office-interior-designers-in-patiala' },
      { label: 'Office Interiors - Dwarka', href: '/office-interior-designers-in-dwarka' },
      { label: 'Office Interiors - Indore', href: '/office-interior-designer-in-indore' },
      {
        label: 'Office Interiors - Gift city Gandhi nagar',
        href: '/office-interior-designers-in-gift-city-gandhinagar',
      },
    ],
    [
      { label: 'Office Interiors - Surat', href: '/office-interior-designers-in-surat' },
      { label: 'Office Interiors - Raipur', href: '/office-interior-designers-in-raipur' },
      { label: 'Office Interiors - Patna', href: '/office-interior-designers-in-patna' },
      { label: 'Office Interiors - Nashik', href: '/office-interior-designers-in-nashik' },
      { label: 'Office Interiors - Nagpur', href: '/office-interior-designers-in-nagpur' },
      { label: 'Office Interiors - Lucknow', href: '/office-interior-designers-in-lucknow' },
      { label: 'Office Interiors - Madurai', href: '/office-interior-designers-in-madurai' },
      {
        label: 'Office Interiors - Bhubaneswar',
        href: '/office-interior-designers-in-bhubaneswar',
      },
    ],
    [
      { label: 'Office Interiors - Srinagar', href: '/office-interior-designers-in-sri-nagar' },
      { label: 'Office Interiors - Hubballi', href: '/office-interior-designers-in-hubli' },
      { label: 'Office Interiors - Guwahati', href: '/office-interior-designers-in-guwahati' },
      { label: 'Office Interiors - Siliguri', href: '/office-interior-designers-in-siliguri' },
      { label: 'Office Interiors - Goa', href: '/office-interior-designers-in-goa' },
      { label: 'Office Interiors - Dehradun', href: '/office-interior-designers-in-dehradun' },
      {
        label: 'Office Interiors - Navi Mumbai',
        href: '/office-interior-designers-in-navi-mumbai',
      },
    ],
    [
      { label: 'Office Interiors - Bhopal', href: '/office-interior-designers-in-bhopal' },
      { label: 'Office Interiors - Ludhiana', href: '/office-interior-designers-in-ludhiana' },
      { label: 'Office Interiors - Agra', href: '/office-interior-designers-in-agra' },
      { label: 'Office Interiors - Mohali', href: '/office-interior-designers-in-mohali' },
      { label: 'Office Interiors - Jalandhar', href: '/office-interior-designers-in-jalandhar' },
      { label: 'Office Interiors - Coimbatore', href: '/office-interior-designers-in-coimbatore' },
      {
        label: 'Office Interiors - Visakhapatnam',
        href: '/office-interior-designers-in-visakhapatnam',
      },
    ],
  ];

  return (
    <>
      {/* Footer 1 (converted from Webflow CSS to Tailwind) */}
      <footer className='bg-black min-h-[516px] border-t border-white/60 max-[479px]:min-h-0'>
        <div className='box-content mx-auto w-full max-w-[1410px] pt-[50px] pb-[48px] px-[30px] max-[767px]:px-[15px] max-[479px]:px-[15px] max-[479px]:pt-[40px] max-[479px]:pb-[30px]'>
          <div className='flex flex-col items-start justify-between gap-10 lg:flex-row lg:gap-[60px] xl:gap-10 max-md:items-center'>
            {/* Brand */}
            <div className='w-full lg:w-[31%] max-lg:w-1/2 max-md:w-[70%] max-sm:w-full max-md:text-center'>
              <a href='/' className='inline-block mb-8 max-md:mb-5'>
                <img
                  width='119'
                  height='45'
                  alt='head-logo'
                  src='https://cdn.prod.website-files.com/664326cc68f40127d59c2683/688c5a3bc014fd68867b5228_phi-white-small-logo.svg'
                  loading='eager'
                  className='h-auto w-auto'
                />
              </a>

              <p className='mb-0 w-full max-w-[420px] text-[36px] font-medium leading-[46px] text-[#d8d8d8] max-[991px]:text-[30px] max-[991px]:leading-[40px] max-md:text-[24px] max-md:leading-[34px] max-md:max-w-none'>
                Crafting inspiring office interiors that help people do their best work.
              </p>

              <a
                href='mailto:hi@phidesigns.in'
                className='mt-3 flex items-center gap-3 text-white no-underline hover:underline max-md:justify-center'
              >
                <svg
                  width='26'
                  height='26'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 shrink-0'
                  aria-hidden='true'
                >
                  <path
                    d='M4 6.5H20C20.8284 6.5 21.5 7.17157 21.5 8V18C21.5 18.8284 20.8284 19.5 20 19.5H4C3.17157 19.5 2.5 18.8284 2.5 18V8C2.5 7.17157 3.17157 6.5 4 6.5Z'
                    stroke='currentColor'
                    strokeWidth='1.6'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M3.5 8L12 13.5L20.5 8'
                    stroke='currentColor'
                    strokeWidth='1.6'
                    strokeLinejoin='round'
                  />
                </svg>
                <span className='text-[18px] leading-[30px]'>hi@phidesigns.in</span>
              </a>

              <a
                href='tel:7486810078'
                className='mt-3 flex items-center gap-3 text-white no-underline hover:underline max-md:justify-center'
              >
                <svg
                  width='26'
                  height='26'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 shrink-0'
                  aria-hidden='true'
                >
                  <path
                    d='M8.5 4.5L6.8 6.2C6.2 6.8 6.1 7.7 6.5 8.4C7.4 10 8.9 12.3 11.1 14.5C13.3 16.7 15.6 18.2 17.2 19.1C17.9 19.5 18.8 19.4 19.4 18.8L21.1 17.1C21.6 16.6 21.6 15.8 21.1 15.3L18.7 12.9C18.3 12.5 17.7 12.4 17.2 12.6L15.5 13.3C14.9 13.6 14.2 13.5 13.7 13C12.9 12.2 11.8 11.1 11 10.3C10.5 9.8 10.4 9.1 10.7 8.5L11.4 6.8C11.6 6.3 11.5 5.7 11.1 5.3L8.7 2.9C8.2 2.4 7.4 2.4 6.9 2.9'
                    stroke='currentColor'
                    strokeWidth='1.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span className='text-[18px] leading-[30px]'>+91&nbsp;7486810078</span>
              </a>
            </div>

            {/* Menus */}
            <div className='w-full'>
              <div className='grid grid-cols-1 gap-8 min-[768px]:grid-cols-3 min-[992px]:grid-cols-4 max-md:max-w-[345px] max-md:mx-auto'>
                <div className='flex flex-col items-start text-left max-md:items-center max-md:text-center max-w-[240px]'>
                  <div className='text-[18px] font-semibold leading-[30px] text-white'>Company</div>
                  {companyLinks.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className='mt-3 text-[18px] font-normal leading-[30px] text-[#d8d8d8] no-underline transition-colors hover:text-[#3c4fb7]'
                    >
                      {l.label}
                    </a>
                  ))}
                </div>

                <div className='flex flex-col items-start text-left max-md:items-center max-md:text-center max-w-[240px]'>
                  <div className='text-[18px] font-semibold leading-[30px] text-white'>
                    Service Areas
                  </div>
                  {serviceAreas.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className='mt-3 text-[18px] font-normal leading-[30px] text-[#d8d8d8] no-underline transition-colors hover:text-[#3c4fb7]'
                    >
                      {l.label}
                    </a>
                  ))}
                </div>

                <div className='flex flex-col items-start text-left max-md:items-center max-md:text-center max-w-[240px]'>
                  {/* Webflow hides this heading via font-size: 0 */}
                  <div className='mb-3 text-[0px] leading-5 text-white'>City pages</div>
                  {cityPages.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className='mt-3 text-[18px] font-normal leading-[30px] text-[#d8d8d8] no-underline transition-colors hover:text-[#3c4fb7]'
                    >
                      {l.label}
                    </a>
                  ))}
                </div>

                <div className='flex flex-col items-start text-left max-md:items-center max-md:text-center max-w-[240px]'>
                  <div className='mb-3 text-[0px] leading-5 text-white max-md:hidden'>
                    City pages
                  </div>
                  <div className='flex flex-col gap-0 max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-4 max-sm:gap-y-2 max-sm:mt-[-24px]'>
                    {cityPagesMore.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        className='mt-3 text-[18px] font-normal leading-[30px] text-[#d8d8d8] no-underline transition-colors hover:text-[#3c4fb7] max-sm:mt-0'
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* More locations toggle (sits under Company column like Webflow) */}
              <div className='mt-10'>
                <details className='w-full'>
                  <summary className='inline-flex cursor-pointer list-none items-center gap-2 text-[16px] font-semibold leading-6 text-white'>
                    <span>More Locations</span>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-white/80'
                      aria-hidden='true'
                    >
                      <path
                        d='M6 9L12 15L18 9'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </summary>

                  <div className='mt-6 grid grid-cols-2 gap-8 min-[768px]:grid-cols-3 min-[992px]:grid-cols-4'>
                    {moreLocationsCols.map((col, idx) => (
                      <div key={idx} className='flex flex-col'>
                        {col.map((l) => (
                          <a
                            key={l.href + l.label}
                            href={l.href}
                            className='mt-3 text-[14px] font-medium leading-6 text-[#d8d8d8] no-underline transition-colors hover:text-[#3c4fb7]'
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer strip (DevX / watermark / socials) */}
      <div className='bg-black pb-10 pt-14'>
        <div className='mx-auto max-w-[1440px] px-4 sm:px-5 md:px-8 lg:px-[70px]'>
          {/* Partner row (centered like Webflow) */}
          <div className='flex justify-center'>
            <div className='flex w-full max-w-[1200px] flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-9'>
              <img
                loading='lazy'
                src='https://cdn.prod.website-files.com/664326cc68f40127d59c2683/67762e4e97573ca47fc4e8e4_devx_logo.svg'
                alt='office Interior design by phi design'
              />

              <div className='hidden h-9 w-px bg-white/60 sm:block' />

              <div className='flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-12 lg:flex-nowrap'>
                {[
                  {
                    href: 'https://www.devx.work/',
                    icon: 'https://cdn.prod.website-files.com/664326cc68f40127d59c2683/67762e4e97573ca47fc4e8df_devx-work-icon.avif',
                    label: 'DevX Work',
                    w: 43,
                    h: 43,
                  },
                  {
                    href: 'https://www.phidesigns.in/',
                    icon: 'https://cdn.prod.website-files.com/664326cc68f40127d59c2683/67762e4e97573ca47fc4e8d9_phi-designs-icon.avif',
                    label: 'Phi Designs',
                    w: 50,
                    h: 50,
                  },
                  {
                    href: 'https://www.momentum91.com/',
                    icon: 'https://cdn.prod.website-files.com/664326cc68f40127d59c2683/67762e4e97573ca47fc4e8e2_momentum-91-icon.avif',
                    label: 'Momentum91',
                    w: 50,
                    h: 50,
                  },
                  {
                    href: 'https://www.devx.fund/',
                    icon: 'https://cdn.prod.website-files.com/664326cc68f40127d59c2683/67762e4e97573ca47fc4e8dc_devx-work-icon.avif',
                    label: 'DevX VF',
                    w: 50,
                    h: 50,
                  },
                ].map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-3 whitespace-nowrap text-white/90 transition-opacity hover:opacity-100'
                  >
                    <img
                      width={p.w}
                      height={p.h}
                      alt={`${p.label.toLowerCase()}-icon`}
                      src={p.icon}
                      loading='lazy'
                      className='h-7 w-7 object-contain sm:h-8 sm:w-8'
                    />
                    <span className='text-sm font-medium text-white/90'>{p.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p className='mx-auto my-10 max-w-[540px] text-center text-sm leading-6 text-white/85'>
            DevX Group helps organisations with Workspace Solutions, Digital Services and Capital
            Investments to Grow and Prosper.
          </p>

          {/* Watermark */}
          <div
            className='select-none text-center font-bold leading-none tracking-[-2px] text-transparent opacity-10'
            style={{
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(180deg, #ffffff 31%, #000000 88%)',
            }}
          >
            <div className='text-[54px] sm:text-[80px] md:text-[110px] lg:text-[150px]'>
              Phi Designs
            </div>
          </div>

          {/* Bottom row */}
          <div className='mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/80 pt-10 md:flex-row md:items-center'>
            <p className='text-base leading-6 text-[#d8d8d8]'>
              © 2026 Phi Designs. All rights reserved.
            </p>

            <div className='flex items-center gap-4'>
              {[
                {
                  href: 'https://www.facebook.com/phidesigns.in/',
                  alt: 'facebook-icon',
                  icon: 'https://cdn.prod.website-files.com/664326cc68f40127d59c2683/664dc48ee33e5a0649dc89dd_facebook-icon.svg',
                },
                {
                  href: 'https://www.linkedin.com/company/phidesigns/',
                  alt: 'linkedin-icon',
                  icon: 'https://cdn.prod.website-files.com/664326cc68f40127d59c2683/664dc48e845bd6ef344128ab_linkedin-icon.svg',
                },
                {
                  href: 'https://www.instagram.com/phidesigns.in/',
                  alt: 'instagram-icon',
                  icon: 'https://cdn.prod.website-files.com/664326cc68f40127d59c2683/665886010d3dc3a136b3d6a9_icons8-instagram.svg',
                },
                {
                  href: 'https://www.youtube.com/@PhiDesigns_Office_Interiors',
                  alt: 'youtube-icon',
                  icon: 'https://cdn.prod.website-files.com/664326cc68f40127d59c2683/665885d4586d8220d6aba619_icons8-youtube.svg',
                },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='opacity-90 hover:opacity-100'
                >
                  <img src={s.icon} loading='lazy' alt={s.alt} className='h-6 w-6' />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
