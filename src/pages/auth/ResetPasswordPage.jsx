import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { RiArrowLeftSLine } from 'react-icons/ri';
import {
  resetPasswordMail,
  setError,
  clearError,
  clearEmailSentError,
} from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/components/layouts/AuthLayout';

const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

const NOT_FOUND_STATUS = 404;
const RATE_LIMIT_STATUS = 429;
const TIMER_KEY = 'reset_password_timer';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { emailSent, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearEmailSentError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(resetPasswordMail(data.email));

    if (result.meta.requestStatus === 'fulfilled') {
      const now = Date.now(); // eslint-disable-line react-hooks/purity
      localStorage.setItem(TIMER_KEY, String(now));
      localStorage.setItem('user-email', data.email);
      navigate('/email-sent');
      return;
    }

    if (result.meta.requestStatus === 'rejected' && result.payload) {
      const status = result.payload?.status ?? result.payload?.response?.status;
      const message =
        result.payload?.data?.message ?? result.payload?.message ?? 'Failed to send reset email';

      if (status === NOT_FOUND_STATUS) {
        dispatch(setError({ message: 'Email not found' }));
        return;
      }
      if (status === RATE_LIMIT_STATUS) {
        dispatch(
          setError({
            message: 'You have reached the maximum number of requests. Please try again later.',
          }),
        );
        return;
      }
      dispatch(setError({ message }));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  return (
    <AuthLayout>
      <Card>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password if you already
            have an account with us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                type='text'
                placeholder='Please enter email address'
                {...register('email')}
                className={errors.email ? 'border-error' : ''}
                autoFocus
              />
              {errors.email && <p className='text-sm text-error'>{errors.email.message}</p>}
            </div>

            {error && (
              <div className='p-3 bg-error-light border border-error rounded-md'>
                <p className='text-sm text-error-dark'>{error}</p>
              </div>
            )}

            <Button type='submit' className='w-full' disabled={emailSent.isLoading}>
              {emailSent.isLoading ? 'Sending...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className='text-center mt-4'>
        <button
          type='button'
          onClick={() => navigate('/login')}
          className='inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900'
        >
          <RiArrowLeftSLine className='size-4' />
          Back to login
        </button>
      </div>
    </AuthLayout>
  );
}
