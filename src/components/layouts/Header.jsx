import { useEffect, useId, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CloudDownload, Phone, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mainBg from '@/assets/Main.jpg';

export default function Header() {
  const menuId = useId();
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const isDetailsSpaceAnalysisPage = pathname === '/details-space-analysis';

  async function handleShareReport() {
    const url = window.location.href;

    console.log('url', url);
  }

  function handleDownloadPdf() {
    // Basic "Download PDF" flow without extra dependencies:
    // user can choose "Save as PDF" in the browser print dialog.
    window.print();
  }

  // Add background on scroll (fixed header)
  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const webflowBaseRaw = import.meta.env.PHI_WEBFLOW_URL ?? '';
  const webflowBase = webflowBaseRaw
    ? (webflowBaseRaw.startsWith('http') ? webflowBaseRaw : `https://${webflowBaseRaw}`).replace(
      /\/$/,
      '',
    )
    : '';

  const navItems = [
    { label: 'About', path: 'about-us' },
    { label: 'Portfolio', path: 'portfolio' },
    { label: 'Walkthroughs', path: 'virtual-walkthroughs' },
    { label: 'Resources', path: 'resources' },
  ].map((item) => ({
    ...item,
    href: webflowBase ? `${webflowBase}/${item.path}` : `/${item.path}`,
  }));

  const headerStyle = useMemo(() => {
    if (!isDetailsSpaceAnalysisPage) return undefined;
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${mainBg})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
    };
  }, [isDetailsSpaceAnalysisPage]);

  const headerClassName = isDetailsSpaceAnalysisPage
    ? 'border-b border-white/10'
    : isScrolled
      ? 'bg-black/70 backdrop-blur-md border-b border-white/10'
      : 'bg-transparent';

  return (
    <>
      {/* Spacer so page content doesn't sit under fixed header */}
      <div className='h-[84px]' aria-hidden='true' />

      <header
        className={`fixed inset-x-0 top-0 z-50 w-full transition-colors ${headerClassName}`}
        style={headerStyle}
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
              {isDetailsSpaceAnalysisPage ? null : (
                <nav className='hidden lg:block' aria-label='primary'>
                  <ul className='flex items-center gap-2 mx-[30px]'>
                    {navItems.map((item) => (
                      <li key={item.label}>
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
              )}
            </div>

            {/* Right actions */}
            <div className='flex items-center gap-4'>
              {isDetailsSpaceAnalysisPage ? (
                <>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-12 rounded-[8px] border-[rgba(27,9,78,0.04)] bg-white px-6 text-[15px] font-bold text-[#3c4fb7] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:bg-white'
                    onClick={handleShareReport}
                  >
                    <Share2 className='h-4 w-4' aria-hidden='true' />
                    Share Report
                  </Button>
                  <Button
                    type='button'
                    variant='gradient'
                    className='h-12 rounded-[8px] px-6'
                    onClick={handleDownloadPdf}
                  >
                    <CloudDownload className='h-4 w-4' aria-hidden='true' />
                    Download PDF
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
