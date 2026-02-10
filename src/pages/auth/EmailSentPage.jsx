import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiArrowLeftSLine, RiMailLine } from 'react-icons/ri';
import { resetPasswordMail, setError, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/components/layouts/AuthLayout';

const TIMER_KEY = 'reset_password_timer';
const TIMER_DURATION = 30;

function getRemainingTime() {
  const saved = localStorage.getItem(TIMER_KEY);
  if (!saved) return TIMER_DURATION;
  const elapsed = Math.floor((Date.now() - Number(saved)) / 1000);
  return Math.max(0, TIMER_DURATION - elapsed);
}

export default function EmailSentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { emailSent } = useSelector((state) => state.auth);
  const [timeLeft, setTimeLeft] = useState(() => getRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getRemainingTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResend = async () => {
    const email = localStorage.getItem('user-email');
    if (!email) return;
    dispatch(clearError());
    const result = await dispatch(resetPasswordMail(email));
    if (result.meta.requestStatus === 'fulfilled') {
      localStorage.setItem(TIMER_KEY, Date.now().toString());
      setTimeLeft(TIMER_DURATION);
    }
    if (result.meta.requestStatus === 'rejected' && result.payload?.status === 429) {
      dispatch(
        setError({
          message: 'You have reached the maximum number of requests. Please try again later.',
        }),
      );
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className='space-y-1 text-center'>
          <div className='flex justify-center'>
            <RiMailLine className='size-10 text-neutral-500' />
          </div>
          <CardTitle className='text-2xl font-bold'>Check your inbox</CardTitle>
          <CardDescription>We&apos;ve sent a password reset link to your email.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button type='button' className='w-full' onClick={() => navigate('/login')}>
            <RiArrowLeftSLine className='size-4 mr-1' />
            Back to login
          </Button>

          <div className='text-center text-sm text-neutral-600'>
            Can&apos;t find the email?{' '}
            <button
              type='button'
              disabled={timeLeft > 0 || emailSent.isLoading}
              onClick={handleResend}
              className='font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {emailSent.isLoading
                ? 'Sending...'
                : timeLeft > 0
                  ? `Resend link in ${timeLeft}s`
                  : 'Resend link'}
            </button>
          </div>

          {emailSent.error && (
            <div className='p-3 bg-error-light border border-error rounded-md'>
              <p className='text-sm text-error-dark'>{emailSent.error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
