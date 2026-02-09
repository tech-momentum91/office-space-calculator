import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileStack, LockKeyhole, Mail, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PhoneInputController } from '@/components/ui/phone-input';
// import phiLogo from '@/assets/Phi.svg';
import mainBg from '@/assets/image/Main.png';
import { cn } from '@/lib/utils';

const unlockFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .transform((s) => s.trim()),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z
    .string()
    .min(1, 'Mobile is required')
    .transform((s) => s.replaceAll(/\D/g, ''))
    .refine((digits) => digits.length >= 10, 'Enter a valid mobile number'),
  agree: z.boolean().refine((v) => v === true, {
    message: 'Please accept the privacy policy',
  }),
});

export default function UnlockResultsModal({ open, onClose, onUnlock }) {
  const [serverError, setServerError] = React.useState('');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(unlockFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      agree: false,
    },
    mode: 'onTouched',
  });

  React.useEffect(() => {
    if (open) {
      reset();
      setServerError('');
    }
  }, [open, reset]);

  async function onSubmit(data) {
    setServerError('');
    try {
      await Promise.resolve(onUnlock?.({ name: data.name, email: data.email, phone: data.phone }));
    } catch (error) {
      const msg = error?.message
        ? String(error.message)
        : 'Unable to unlock results. Please try again.';
      setServerError(msg);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose?.() : undefined)}>
      <DialogContent
        showClose
        closeVariant='ghost'
        overlayClassName='bg-[rgba(0,0,0,0.7)] backdrop-blur-[8px]'
        className='w-[min(920px,calc(100vw-32px))] max-w-[920px] gap-0 overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.1)] bg-[#F5F8FA] p-0 shadow-[0px_20px_80px_rgba(16,24,40,0.24)]'
        aria-label='Unlock results'
      >
        <div className='flex flex-col md:flex-row overflow-hidden rounded-[20px]'>
          <div className='relative overflow-hidden rounded-t-[20px] md:rounded-l-[20px] md:rounded-tr-none bg-[#1D335A] px-8 py-10 text-white md:w-[431px] md:px-12 md:py-[78px]'>
            <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
              <img alt='' src={mainBg} className='h-full w-full object-cover object-center' />
            </div>
            {/* subtle grid overlay */}
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 opacity-20'
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
                backgroundSize: '72px 72px',
                backgroundPosition: '0 0',
              }}
            />

            <div className='relative flex w-full max-w-[336px] flex-col gap-6 font-sans'>
              {/* Icon */}
              <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-white/10'>
                <FileStack className='h-7 w-7 text-white' aria-hidden='true' />
              </div>

              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[32px] font-semibold leading-[120%] tracking-[-2.56px] text-white">
                Get Your Report <span className='text-[#98A2B3]'>Instantly!</span>
              </h2>

              {/* Body — Figma node 1223-14364: 16px, Medium, -1px letter-spacing, 1.33 line-height, 90% white */}
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] font-medium leading-[1.33] tracking-[-1px] text-[rgba(255,255,255,0.9)]">
                We’ve calculated the optimal space based on industry standards. Enter your details
                to unlock the full breakdown, including efficiency grades and cost estimates
              </p>
            </div>
          </div>

          {/* Form panel — Figma node 1223-14027 (top padding clears close icon; ~91px spacing) */}
          <div className='rounded-b-[20px] md:rounded-r-[20px] md:rounded-bl-none bg-white px-6 pt-[88px] pb-10 md:w-[489px] md:px-10 md:pt-[91px]'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-6'>
              {serverError ? (
                <div
                  role='alert'
                  className='rounded-[8px] border border-[#f04438]/30 bg-[#fef3f2] px-3 py-2.5 text-[13px] leading-[18px] text-[#b42318] font-["Plus_Jakarta_Sans",sans-serif]'
                >
                  {serverError}
                </div>
              ) : null}

              {/* Name — 14px label, 40px input, 8px radius */}
              <div className='flex flex-col gap-1.5'>
                <label
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-medium leading-[20px] text-[#344054]"
                  htmlFor='unlock-name'
                >
                  Name <span className='text-[#f04438]'>*</span>
                </label>
                <div
                  className={cn(
                    'flex h-10 items-center gap-2 rounded-[8px] border bg-white px-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-colors focus-within:border-[#2970ff] focus-within:ring-1 focus-within:ring-[#2970ff]',
                    errors.name ? 'border-[#f04438]' : 'border-[#d0d5dd]',
                  )}
                >
                  <User className='h-5 w-5 shrink-0 text-[#98a2b3]' aria-hidden='true' />
                  <input
                    id='unlock-name'
                    placeholder='Enter your name'
                    className="min-w-0 flex-1 bg-transparent font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#0a0d14] outline-none placeholder:text-[#98a2b3]"
                    {...register('name')}
                  />
                </div>
                {errors.name ? (
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[16px] text-[#f04438]">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              {/* Email */}
              <div className='flex flex-col gap-1.5'>
                <label
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-medium leading-[20px] text-[#344054]"
                  htmlFor='unlock-email'
                >
                  Email <span className='text-[#f04438]'>*</span>
                </label>
                <div
                  className={cn(
                    'flex h-10 items-center gap-2 rounded-[8px] border bg-white px-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-colors focus-within:border-[#2970ff] focus-within:ring-1 focus-within:ring-[#2970ff]',
                    errors.email ? 'border-[#f04438]' : 'border-[#d0d5dd]',
                  )}
                >
                  <Mail className='h-5 w-5 shrink-0 text-[#98a2b3]' aria-hidden='true' />
                  <input
                    id='unlock-email'
                    placeholder='hello@alignui.com'
                    className="min-w-0 flex-1 bg-transparent font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#0a0d14] outline-none placeholder:text-[#98a2b3]"
                    inputMode='email'
                    autoComplete='email'
                    {...register('email')}
                  />
                </div>
                {errors.email ? (
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[16px] text-[#f04438]">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              {/* Mobile */}
              <div className='flex flex-col gap-1.5'>
                <label
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-medium leading-[20px] text-[#344054]"
                  htmlFor='unlock-phone'
                >
                  Mobile <span className='text-[#f04438]'>*</span>
                </label>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field, fieldState }) => (
                    <PhoneInputController
                      id='unlock-phone'
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      error={fieldState.error}
                      placeholder='(555) 000-0000'
                      maxLength={15}
                    />
                  )}
                />
                {errors.phone ? (
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[16px] text-[#f04438]">
                    {errors.phone.message}
                  </p>
                ) : null}
              </div>

              {/* Privacy — 16px body, checkbox 20px */}
              <div className='flex flex-col gap-1'>
                <label className='flex cursor-pointer items-start gap-3' htmlFor='unlock-agree'>
                  <input
                    id='unlock-agree'
                    type='checkbox'
                    className='mt-0.5 h-5 w-5 shrink-0 rounded-[4px] border border-[#d0d5dd] bg-white accent-[#2970ff]'
                    {...register('agree')}
                  />
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-[#475467]">
                    You agree to our friendly{' '}
                    <a
                      href='/privacy-policy'
                      className='text-[#2970ff] underline decoration-solid underline-offset-2 hover:text-[#1557e6]'
                    >
                      privacy policy.
                    </a>
                  </span>
                </label>
                {errors.agree ? (
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] leading-[16px] text-[#f04438]">
                    {errors.agree.message}
                  </p>
                ) : null}
              </div>

              <Button
                type='submit'
                variant='gradient'
                className='mt-1 h-10 w-full rounded-[8px] font-["Plus_Jakarta_Sans",sans-serif] text-[15px] font-semibold leading-[20px] disabled:opacity-70'
                disabled={isSubmitting}
              >
                <LockKeyhole className='h-4 w-4 shrink-0' aria-hidden='true' />
                {isSubmitting ? 'Unlocking…' : 'Unlock my results'}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
