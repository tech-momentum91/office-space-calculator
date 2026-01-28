import { useId, useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

/**
 * Header Component
 * - Responsive navbar (desktop links + mobile dropdown)
 * - Styled to match Phi/DevX Webflow header conventions
 */
export default function Header() {
  const menuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setIsMenuOpen(false);
    }

    if (isMenuOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  // Add background on scroll (fixed header)
  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '/about-us' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Walkthroughs', href: '/virtual-walkthroughs' },
    { label: 'Resources', href: '/resources' },
  ];

  return (
    <>
      {/* Spacer so page content doesn't sit under fixed header */}
      <div className='h-[84px]' aria-hidden='true' />

      <header
        className={`fixed inset-x-0 top-0 z-50 w-full transition-colors ${
          isScrolled ? 'bg-black/70 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className='mx-auto w-full max-w-[1280px] px-4 py-[18px] sm:px-5 lg:px-[32px]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-12 lg:gap-20'>
              <a href='/' aria-label='home' className='shrink-0'>
                <img
                  src='https://cdn.prod.website-files.com/664326cc68f40127d59c2683/688c5a3bc014fd68867b5228_phi-white-small-logo.svg'
                  loading='eager'
                  width='119'
                  height='45'
                  alt='Phi Designs'
                  className='h-auto w-auto'
                />
              </a>

              {/* Desktop nav */}
              <nav className='hidden lg:block' aria-label='primary'>
                <ul className='flex items-center gap-2 mx-[30px]'>
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className='mx-[5px] px-[10px] py-[5px] text-[15px] font-medium leading-[24.3px] tracking-[0.1px] text-[#d2d3da] no-underline transition-colors hover:text-white'
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right actions */}
            <div className='flex items-center gap-4'>
              <a
                href='/contact-us'
                className='hidden h-[48px] items-center justify-center rounded-[8px] border border-[#1b094e0a] bg-white px-[47px] py-[12px] text-center text-[15px] font-bold leading-[24px] text-[#3c4fb7] shadow-[0_1px_2px_#0000000d] transition-all duration-300 hover:bg-[linear-gradient(#00000026,#00000026)] lg:inline-flex'
              >
                Contact us
              </a>

              <a
                href='tel:+9199998001667'
                className='hidden h-[48px] items-center justify-center gap-2 rounded-[8px] border border-white/20 px-[25px] py-[12px] text-center text-[15px] font-bold leading-[24px] text-white shadow-[0_1px_2px_#0000000d] transition-all duration-300 hover:opacity-95 lg:inline-flex'
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #0D47A1 0%, #0058A6 20%, #0066A4 40%, #00729E 60%, #007E97 80%, #00888F 100%)',
                }}
                aria-label='Call +91 99998 001667'
              >
                <span className='inline-flex h-6 w-6 items-center justify-center'>
                  <Phone className='h-[18px] w-[18px] text-white' aria-hidden='true' />
                </span>
                <span className='tracking-[0.2px]'>+9199998001667</span>
              </a>

              {/* Mobile menu button */}
              <button
                type='button'
                className={`inline-flex items-center justify-center rounded-md px-[10px] py-2 text-[36px] leading-none lg:hidden ${
                  isMenuOpen ? 'bg-[#1e6bd8] text-white' : 'bg-transparent text-white'
                }`}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-controls={menuId}
                aria-haspopup='menu'
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((v) => !v)}
              >
                <img
                  src='https://cdn.prod.website-files.com/664326cc68f40127d59c2683/685a98368529729d83382a10_List.svg'
                  loading='lazy'
                  alt=''
                  className='h-7 w-7'
                />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div id={menuId} role='menu' className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className='mt-4 rounded-xl bg-white py-10'>
              <ul className='flex flex-col items-center gap-3'>
                {[
                  ...navItems,
                  { label: 'Contact us', href: '/contact-us' },
                  { label: 'Call +9199998001667', href: 'tel:+9199998001667' },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className='px-[10px] py-[10px] text-[15px] font-medium leading-6 text-[#101828] no-underline transition-colors hover:text-[#3c4fb7]'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
