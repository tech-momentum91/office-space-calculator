import { useMemo, useState } from 'react';
import { ChevronDown, Facebook, Linkedin, X, Youtube } from 'lucide-react';

function FooterLink({ href, children }) {
  return (
    <a
      href={href}
      className='block text-[14px] leading-6 text-white/70 no-underline transition-colors hover:text-white'
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);

  const companyLinks = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about-us' },
      { label: 'Blog', href: '/blog' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Virtual walkthrough', href: '/virtual-walkthroughs' },
      { label: 'Contact Us', href: '/contact-us' },
      { label: 'Vendor partners', href: '/vendor-partners' },
    ],
    [],
  );

  const cityPagesColumns = useMemo(
    () => [
      [
        {
          label: 'Office interior designers in Ahmedabad',
          href: '/office-interior-designer-in-ahmedabad',
        },
        { label: 'Office interior designers in pune', href: '/office-interior-designer-in-pune' },
        { label: 'Office interior designers in Noida', href: '/office-interior-designer-in-noida' },
        {
          label: 'Office interior designers in Vadodara',
          href: '/office-interior-designer-in-vadodara',
        },
      ],
      [
        {
          label: 'Office interior designers in Rajkot',
          href: '/office-interior-designer-in-rajkot',
        },
        {
          label: 'Office interior designers in Gurgaon',
          href: '/office-interior-designer-in-gurgaon',
        },
        {
          label: 'Office interior designers in Hyderabad',
          href: '/office-interior-designer-in-hyderabad',
        },
        {
          label: 'Office interior designers in Jaipur',
          href: '/office-interior-designer-in-jaipur',
        },
      ],
      [
        {
          label: 'Office interior designers in Mumbai',
          href: '/office-interior-designer-in-mumbai',
        },
        {
          label: 'Office interior designers in Bangalore',
          href: '/office-interior-designer-in-bangalore',
        },
        { label: 'Office interior designers in Delhi', href: '/office-interior-designer-in-delhi' },
        {
          label: 'Office interior designers in Indore',
          href: '/office-interior-designer-in-indore',
        },
      ],
      [
        {
          label: 'Office interior designers in Kolkata',
          href: '/office-interior-designers-in-kolkata',
        },
        {
          label: 'Office interior designers in Kochi',
          href: '/office-interior-designers-in-kochi',
        },
        {
          label: 'Office interior designers in Coimbatore',
          href: '/office-interior-designers-in-coimbatore',
        },
        {
          label: 'Office interior designers in Chandigarh',
          href: '/office-interior-designers-in-chandigarh',
        },
      ],
    ],
    [],
  );

  const moreLocationsColumns = useMemo(
    () => [
      [
        {
          label: 'Office interior designers in Udaipur',
          href: '/office-interior-designers-in-udaipur',
        },
        {
          label: 'Office interior designers in Amritsar',
          href: '/office-interior-designers-in-amritsar',
        },
        {
          label: 'Office interior designers in Ghaziabad',
          href: '/office-interior-designers-in-ghaziabad',
        },
        {
          label: 'Office interior designers in Faridabad',
          href: '/office-interior-designers-in-faridabad',
        },
        {
          label: 'Office interior designers in Thane',
          href: '/office-interior-designers-in-thane',
        },
        {
          label: 'Office interior designers in Visakhapatnam',
          href: '/office-interior-designers-in-visakhapatnam',
        },
        {
          label: 'Office interior designers in Gift city Gandhi nagar',
          href: '/office-interior-designers-in-gift-city-gandhinagar',
        },
      ],
      [
        {
          label: 'Office interior designers in Surat',
          href: '/office-interior-designers-in-surat',
        },
        {
          label: 'Office interior designers in Raipur',
          href: '/office-interior-designers-in-raipur',
        },
        {
          label: 'Office interior designers in Patna',
          href: '/office-interior-designers-in-patna',
        },
        {
          label: 'Office interior designers in Nashik',
          href: '/office-interior-designers-in-nashik',
        },
        {
          label: 'Office interior designers in Nagpur',
          href: '/office-interior-designers-in-nagpur',
        },
        {
          label: 'Office interior designers in Lucknow',
          href: '/office-interior-designers-in-lucknow',
        },
        {
          label: 'Office interior designers in Bhubaneswar',
          href: '/office-interior-designers-in-bhubaneswar',
        },
      ],
      [
        {
          label: 'Office interior designers in Srinagar',
          href: '/office-interior-designers-in-sri-nagar',
        },
        {
          label: 'Office interior designers in Hubballi',
          href: '/office-interior-designers-in-hubli',
        },
        {
          label: 'Office interior designers in Guwahati',
          href: '/office-interior-designers-in-guwahati',
        },
        {
          label: 'Office interior designers in Dehradun',
          href: '/office-interior-designers-in-dehradun',
        },
        {
          label: 'Office interior designers in Navi Mumbai',
          href: '/office-interior-designers-in-navi-mumbai',
        },
        { label: 'Office interior designers in Goa', href: '/office-interior-designers-in-goa' },
      ],
      [
        {
          label: 'Office interior designers in Chennai',
          href: '/office-interior-designer-in-chennai',
        },
        {
          label: 'Office interior designers in Bhopal',
          href: '/office-interior-designers-in-bhopal',
        },
        {
          label: 'Office interior designers in Ludhiana',
          href: '/office-interior-designers-in-ludhiana',
        },
        {
          label: 'Office interior designers in Mohali',
          href: '/office-interior-designers-in-mohali',
        },
        {
          label: 'Office interior designers in Jalandhar',
          href: '/office-interior-designers-in-jalandhar',
        },
        {
          label: 'Office interior designers in Coimbatore',
          href: '/office-interior-designers-in-coimbatore',
        },
      ],
    ],
    [],
  );

  return (
    <footer
      className='relative overflow-hidden bg-black text-white'
      style={{
        backgroundImage:
          'radial-gradient(900px 420px at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 65%)',
      }}
    >
      {/* Watermark */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-[70px] select-none text-center font-semibold tracking-[-0.02em] text-white/[0.06]'
        style={{ fontSize: 'clamp(80px, 18vw, 240px)' }}
      >
        Phi Designs
      </div>

      <div className='mx-auto w-full max-w-[1280px] px-4 pb-10 pt-16 sm:px-5 lg:px-8'>
        <div className='grid gap-14 lg:grid-cols-[360px_180px_1fr] lg:gap-16'>
          {/* Brand */}
          <div>
            <a href='/' aria-label='home' className='inline-flex items-center gap-3 no-underline'>
              <img
                width='119'
                height='45'
                alt='Phi Designs'
                src='https://cdn.prod.website-files.com/664326cc68f40127d59c2683/688c5a3bc014fd68867b5228_phi-white-small-logo.svg'
                loading='eager'
                className='h-auto w-auto'
              />
            </a>

            <p className='mt-6 max-w-[34ch] text-[14px] leading-6 text-white/70'>
              Crafting inspiring office interiors that help people do their best work.
            </p>
            <div className='mt-6 grid gap-3'>
              <a
                href='mailto:hi@phidesigns.in'
                className='inline-flex items-center gap-3 text-[14px] leading-6 text-white/80 no-underline hover:text-white'
              >
                <img
                  loading='lazy'
                  src='https://cdn.prod.website-files.com/664326cc68f40127d59c2683/677e449cb02c712ea96ff3e1_mail-svgrepo-com.svg'
                  alt='office Interior design by phi design'
                  className='h-5 w-5'
                />
                <span>hi@phidesigns.in</span>
              </a>

              <a
                href='tel:7486810078'
                className='inline-flex items-center gap-3 text-[14px] leading-6 text-white/80 no-underline hover:text-white'
              >
                <img
                  loading='lazy'
                  src='https://cdn.prod.website-files.com/664326cc68f40127d59c2683/677e451d3fe4ebf9b9e2d9f4_phone-svgrepo-com.svg'
                  alt='office Interior design by phi design'
                  className='h-5 w-5'
                />
                <span>+91 7486810078</span>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className='text-[15px] font-semibold leading-6 text-white'>Company</div>
            <div className='mt-5 grid gap-2.5'>
              {companyLinks.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </div>

            {/* View all locations (expander) */}
            <div className='mt-10'>
              <button
                type='button'
                className='inline-flex items-center gap-2 text-[20px] font-semibold leading-7 text-white'
                onClick={() => setIsLocationsOpen((v) => !v)}
                aria-expanded={isLocationsOpen}
              >
                <span>More Locations</span>
                <ChevronDown
                  className={`h-4 w-4 text-white/80 transition-transform ${isLocationsOpen ? 'rotate-180' : ''}`}
                  aria-hidden='true'
                />
              </button>
            </div>
          </div>

          {/* City pages */}
          <div>
            <div className='text-[15px] font-semibold leading-6 text-white'>City pages</div>
            <div className='mt-5 grid gap-x-12 gap-y-3 sm:grid-cols-2 lg:grid-cols-4'>
              {cityPagesColumns.map((col, idx) => (
                <div key={idx} className='grid gap-2.5'>
                  {col.map((l) => (
                    <FooterLink key={l.href} href={l.href}>
                      {l.label}
                    </FooterLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded locations list (full width, like Figma) */}
        {isLocationsOpen ? (
          <div className='mt-10'>
            <div className='grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-4'>
              {moreLocationsColumns.map((col, idx) => (
                <div key={idx} className='grid gap-2.5'>
                  {col.map((l) => (
                    <FooterLink key={l.href + l.label} href={l.href}>
                      {l.label}
                    </FooterLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Partner strip */}
        <div className='mt-14'>
          <div className='flex flex-wrap items-center justify-center gap-6 text-white/70'>
            <span className='text-[13px] font-semibold tracking-[0.12em] text-white/60'>DEVX</span>
            <span className='h-4 w-px bg-white/15' aria-hidden='true' />
            <span className='text-[13px] font-semibold tracking-[0.12em] text-white/60'>
              DevX Work
            </span>
            <span className='h-4 w-px bg-white/15' aria-hidden='true' />
            <span className='text-[13px] font-semibold tracking-[0.12em] text-white/60'>
              Phi Designs
            </span>
            <span className='h-4 w-px bg-white/15' aria-hidden='true' />
            <span className='text-[13px] font-semibold tracking-[0.12em] text-white/60'>
              Momentum91
            </span>
            <span className='h-4 w-px bg-white/15' aria-hidden='true' />
            <span className='text-[13px] font-semibold tracking-[0.12em] text-white/60'>
              DevXVF
            </span>
          </div>

          <p className='mt-7 text-center text-[14px] leading-6 text-white/70'>
            DevX Group helps organisations with Workspace Solutions, Digital Services and Capital
            Investments to Grow and Prosper.
          </p>
        </div>

        {/* Bottom bar */}
        <div className='mt-12 border-t border-white/15 pt-8'>
          <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
            <div className='text-[12px] text-white/60'>
              © {new Date().getFullYear()} Phi Designs. All rights reserved.
            </div>

            <div className='flex items-center gap-4'>
              <a
                href='#'
                aria-label='X'
                className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:text-white'
              >
                <X className='h-4 w-4' aria-hidden='true' />
              </a>
              <a
                href='#'
                aria-label='LinkedIn'
                className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:text-white'
              >
                <Linkedin className='h-4 w-4' aria-hidden='true' />
              </a>
              <a
                href='#'
                aria-label='Facebook'
                className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:text-white'
              >
                <Facebook className='h-4 w-4' aria-hidden='true' />
              </a>
              <a
                href='#'
                aria-label='YouTube'
                className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:text-white'
              >
                <Youtube className='h-4 w-4' aria-hidden='true' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
