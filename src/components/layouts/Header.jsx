import { useEffect, useId, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, CloudDownload, Copy, Link2, Mail, Phone, Share2, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import mainBg from '@/assets/image/Main.jpg';
import { RiSendPlane2Fill } from 'react-icons/ri';
import {
  useSendOfficeSpaceReportEmailMutation,
  useLazyGetOrCreateShareTokenQuery,
} from '@/store/api/officeSpaceCalculatorApi';

/**
 * Header Component
 * - Responsive navbar (desktop links + mobile dropdown)
 * - Styled to match Phi/DevX Webflow header conventions
 * @param {Object} props
 * @param {() => void | Promise<void>} [props.onDownloadPdf] - Called when "Download PDF" is clicked (e.g. on details page). If not provided, falls back to window.print().
 * @param {() => Promise<Blob>} [props.onGetPdfBlob] - Returns PDF blob for email (e.g. on details page). If provided, Send uses backend to email PDF; otherwise falls back to mailto.
 * @param {string} [props.reportId] - Report id for email attachment filename and API.
 * @param {boolean} [props.isSharedView] - When true, read-only shared link view: only show Download PDF, no Share.
 */
export default function Header({ onDownloadPdf, onGetPdfBlob, reportId, isSharedView }) {
  const menuId = useId();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLinkUrl, setShareLinkUrl] = useState('');
  const [shareEmails, setShareEmails] = useState([]);
  const [emailInputValue, setEmailInputValue] = useState('');
  const [copyDone, setCopyDone] = useState(false);
  const [sendEmail] = useSendOfficeSpaceReportEmailMutation();
  const [getOrCreateShareToken, shareTokenResult] = useLazyGetOrCreateShareTokenQuery();
  const { pathname } = useLocation();
  const isDetailsSpaceAnalysisPage = pathname.startsWith('/details-space-analysis');

  const defaultShareUrl = typeof window === 'undefined' ? '' : window.location.href;
  const shareUrl = shareLinkUrl || defaultShareUrl;
  // Phi Designs logo URL for report email (must be public https; add phi-designs-logo.png to public/ or set VITE_PHI_LOGO_URL)
  const phiLogoUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.PHI_LOGO_URL) ||
    (typeof window !== 'undefined' ? `${window.location.origin}/phi-designs-logo.png` : '');

  useEffect(() => {
    if (shareDialogOpen && reportId) {
      setShareLinkUrl('');
      getOrCreateShareToken(reportId);
    } else if (!shareDialogOpen) {
      setShareLinkUrl('');
    }
  }, [shareDialogOpen, reportId, getOrCreateShareToken]);

  useEffect(() => {
    if (!shareDialogOpen || !reportId) return;
    const raw = shareTokenResult.data;
    const token = typeof raw === 'string' ? raw : (raw?.share_token ?? raw?.message?.share_token);
    if (typeof token === 'string' && token.length > 0) {
      setShareLinkUrl(
        `${typeof window === 'undefined' ? '' : window.location.origin}/details-space-analysis/${reportId}?share=${encodeURIComponent(token)}`,
      );
    }
  }, [shareDialogOpen, reportId, shareTokenResult.data]);

  function handleShareReport() {
    setShareDialogOpen(true);
    setCopyDone(false);
    setShareEmails([]);
    setEmailInputValue('');
  }

  function addShareEmail(email) {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(trimmed)) return;
    setShareEmails((previous) => (previous.includes(trimmed) ? previous : [...previous, trimmed]));
    setEmailInputValue('');
  }

  function removeShareEmail(email) {
    setShareEmails((previous) => previous.filter((e) => e !== email));
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      // fallback: select and cop
    }
  }

  async function handleSendEmail() {
    const extra = emailInputValue.trim().toLowerCase();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const all = extra && re.test(extra) ? [...new Set([...shareEmails, extra])] : shareEmails;
    if (all.length === 0) {
      toast.error('Add at least one recipient email.');
      return;
    }

    if (onGetPdfBlob) {
      try {
        setIsSendingEmail(true);
        const blob = await onGetPdfBlob();
        const pdfBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          const onLoadEnd = () => {
            const dataUrl = reader.result;
            const base64 = dataUrl?.split(',')[1];
            if (base64) resolve(base64);
            else reject(new Error('Failed to encode PDF'));
          };
          const onError = () => reject(reader.error || new Error('FileReader error'));
          reader.addEventListener('loadend', onLoadEnd);
          reader.addEventListener('error', onError);
          reader.readAsDataURL(blob);
        });
        await sendEmail({
          recipient_emails: all,
          pdf_base64: pdfBase64,
          share_url: shareUrl,
          report_id: reportId ?? undefined,
          ...(phiLogoUrl ? { logo_url: phiLogoUrl } : {}),
        }).unwrap();
        toast.success(`Report sent to ${all.join(', ')}`);
        setShareDialogOpen(false);
      } catch (error) {
        console.error('Send report email failed', error);
        toast.error(
          error?.data?.message || error?.message || 'Could not send email. Please try again.',
        );
      } finally {
        setIsSendingEmail(false);
      }
      return;
    }

    const mailto = `mailto:${all.join(',')}?subject=Office Space Report&body=${encodeURIComponent(shareUrl)}`;
    window.location.href = mailto;
    setShareDialogOpen(false);
  }

  function handleEmailInputKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addShareEmail(emailInputValue);
    }
  }

  async function handleDownloadPdf() {
    if (onDownloadPdf) {
      try {
        setIsPdfLoading(true);
        await Promise.resolve(onDownloadPdf());
      } catch (error) {
        console.error('PDF download failed', error);
        toast.error('Could not generate PDF. Please try again.');
      } finally {
        setIsPdfLoading(false);
      }
    } else {
      window.print();
    }
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
      {/* Share Report dialog — Figma node 3825-68037 */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent
          className={cn(
            'flex w-[min(420px,calc(100vw-32px))] flex-col items-center gap-5 rounded-[20px] border border-black/10 bg-[#F6F9FC] font-["Plus_Jakarta_Sans",sans-serif]',
            'pt-[19px] pr-[2px] pb-[31px] pl-[1px]',
          )}
          showClose
          closeVariant='ghost'
          closeClassName='right-2 top-[19px] text-[#667085] hover:bg-black/5 hover:text-[#344054]'
          overlayClassName='bg-black/40 backdrop-blur-[2px]'
          aria-label='Share Report'
        >
          <DialogHeader className='w-full border-b border-[#E2E4E9] px-4 pb-3'>
            <DialogTitle className='flex items-center gap-3 text-[20px] font-semibold leading-7 tracking-[-0.2px] text-[#101828]'>
              <span className='flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff]'>
                <Share2 className='h-5 w-5 shrink-0 text-[#3c4fb7]' aria-hidden />
              </span>
              Share Report
            </DialogTitle>
            <DialogDescription className='mt-2 text-[14px] font-normal leading-5 text-[#667085]'>
              Share this report via link or send it by email to your team.
            </DialogDescription>
          </DialogHeader>

          <div className='flex w-full flex-col gap-5 px-4'>
            {/* Share Link — link icon left, URL + copy inside field */}
            <div className='flex flex-col gap-2'>
              <label className='text-[14px] font-medium leading-5 text-[#344054]'>Share Link</label>
              <div className='flex h-11 items-center rounded-[10px] border border-[#d0d5dd] bg-[#f9fafb] overflow-hidden'>
                <span
                  className='flex h-full w-11 shrink-0 items-center justify-center text-[#98a2b3]'
                  aria-hidden
                >
                  <Link2 className='h-4 w-4' />
                </span>
                <input
                  id='share-report-url'
                  readOnly
                  value={shareUrl}
                  className='min-w-0 flex-1 bg-transparent px-0 py-2.5 text-[14px] leading-5 text-[#101828] outline-none'
                />
                <button
                  type='button'
                  onClick={handleCopyLink}
                  className='flex h-full w-11 shrink-0 items-center justify-center text-[#667085] transition-colors hover:bg-[#e4e7ec] hover:text-[#344054]'
                  aria-label={copyDone ? 'Copied' : 'Copy link'}
                >
                  <Copy className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* OR SHARE VIA EMAIL */}
            <div className='flex items-center gap-3'>
              <div className='h-px flex-1 bg-[#e4e7ec]' />
              <span className='text-[11px] font-semibold uppercase tracking-[0.5px] text-[#98a2b3]'>
                Or share via email
              </span>
              <div className='h-px flex-1 bg-[#e4e7ec]' />
            </div>

            {/* Recipient Email — chips + input */}
            <div className='flex flex-col gap-2'>
              <label className='text-[14px] font-medium leading-5 text-[#344054]'>
                Recipient Email
              </label>
              <div
                className={cn(
                  'flex min-h-11 flex-wrap items-center gap-2 rounded-[10px] border border-[#d0d5dd] bg-white px-3 py-2',
                  'focus-within:ring-2 focus-within:ring-[#3c4fb7]/20 focus-within:border-[#3c4fb7]',
                )}
              >
                <Mail className='h-4 w-4 shrink-0 text-[#98a2b3]' aria-hidden />
                {shareEmails.map((email) => (
                  <span
                    key={email}
                    className='inline-flex items-center gap-1.5 rounded-md bg-[#f2f4f7] pl-2 pr-1 py-1 text-[13px] font-medium text-[#344054]'
                  >
                    <Avatar className='h-5 w-5 shrink-0'>
                      <AvatarFallback className='h-5 w-5 rounded-full bg-[#d0d5dd] text-[10px] font-semibold text-[#344054]'>
                        {email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {email}
                    <button
                      type='button'
                      onClick={() => removeShareEmail(email)}
                      className='rounded p-0.5 text-[#667085] hover:bg-[#e4e7ec] hover:text-[#344054]'
                      aria-label={`Remove ${email}`}
                    >
                      <X className='h-3.5 w-3.5' />
                    </button>
                  </span>
                ))}
                <input
                  type='email'
                  placeholder={shareEmails.length === 0 ? 'colleague@company.com' : 'Add another'}
                  value={emailInputValue}
                  onChange={(e) => setEmailInputValue(e.target.value)}
                  onKeyDown={handleEmailInputKeyDown}
                  onBlur={() => emailInputValue.trim() && addShareEmail(emailInputValue)}
                  className='min-w-[140px] flex-1 border-0 bg-transparent py-2 text-[14px] leading-5 text-[#101828] placeholder:text-[#98a2b3] outline-none'
                />
              </div>
            </div>

            {/* Send — full width, gradient, arrow right */}
            <Button
              type='button'
              className={cn(
                'h-11 w-full rounded-[10px] text-[14px] font-semibold leading-5 text-white',
                'focus-visible:ring-2 focus-visible:ring-offset-2',
              )}
              style={{
                background:
                  'linear-gradient(90deg, #0D47A1 0%, #0058A6 25%, #0066A4 50%, #00729E 75%, #00888F 100%)',
              }}
              onClick={handleSendEmail}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? 'Sending…' : 'Send'}
              <RiSendPlane2Fill className='h-4 w-4' aria-hidden />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spacer so page content doesn't sit under fixed header */}
      <div className='h-[84px]' aria-hidden='true' />

      <header
        className={`fixed inset-x-0 top-0 z-50 w-full transition-colors ${headerClassName}`}
        style={headerStyle}
      >
        <div className='mx-auto w-full max-w-[1280px] px-4 py-[18px] sm:px-5 lg:px-[32px]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-12 lg:gap-20'>
              <a href='https://www.phidesigns.in/' aria-label='home' className='shrink-0'>
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
              )}
            </div>

            {/* Right actions */}
            <div className='flex items-center gap-4'>
              {isDetailsSpaceAnalysisPage ? (
                <>
                  {!isSharedView && (
                    <Button
                      type='button'
                      variant='outline'
                      className='h-12 rounded-[8px] border-[rgba(27,9,78,0.04)] bg-white px-6 text-[15px] font-bold text-[#3c4fb7] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:bg-white'
                      onClick={handleShareReport}
                    >
                      <Share2 className='h-4 w-4' aria-hidden='true' />
                      Share Report
                    </Button>
                  )}
                  <Button
                    type='button'
                    variant='gradient'
                    className='h-12 rounded-[8px] px-6'
                    onClick={handleDownloadPdf}
                    disabled={isPdfLoading}
                  >
                    <CloudDownload className='h-4 w-4' aria-hidden='true' />
                    {isPdfLoading ? 'Generating…' : 'Download PDF'}
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
