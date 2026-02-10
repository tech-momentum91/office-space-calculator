import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { useUpdatePasswordMutation } from '@/store/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/components/layouts/AuthLayout';

const setPasswordSchema = z
  .object({
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');
  const email = searchParams.get('email') || '';

  const [updatePassword, { isLoading, isSuccess, isError, error }] = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { new_password: '', confirm_password: '' },
  });

  useEffect(() => {
    if (isSuccess) {
      navigate('/login', { replace: true });
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (data) => {
    if (!key) return;
    await updatePassword({
      key,
      new_password: data.new_password,
      logout_all_sessions: 0,
    });
  };

  if (!key) {
    return (
      <AuthLayout>
        <Card>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-bold'>Invalid or expired link</CardTitle>
            <CardDescription>
              This set-password link is invalid or has expired. Please request a new one from the
              login page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type='button' className='w-full' onClick={() => navigate('/login')}>
              <RiArrowLeftSLine className='size-4 mr-1' />
              Back to login
            </Button>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  const apiError =
    isError && error
      ? (error?.data?.message ??
        error?.data?.exc ??
        error?.message ??
        'Failed to set password. The link may have expired.')
      : null;

  return (
    <AuthLayout>
      <Card>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Set your password</CardTitle>
          <CardDescription>
            {email
              ? `Create a new password for ${email}.`
              : 'Create a new password to access your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='new_password'>New password</Label>
              <Input
                id='new_password'
                type='password'
                placeholder='Enter new password'
                autoComplete='new-password'
                {...register('new_password')}
                className={errors.new_password ? 'border-error' : ''}
                autoFocus
              />
              {errors.new_password && (
                <p className='text-sm text-error'>{errors.new_password.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirm_password'>Confirm password</Label>
              <Input
                id='confirm_password'
                type='password'
                placeholder='Confirm new password'
                autoComplete='new-password'
                {...register('confirm_password')}
                className={errors.confirm_password ? 'border-error' : ''}
              />
              {errors.confirm_password && (
                <p className='text-sm text-error'>{errors.confirm_password.message}</p>
              )}
            </div>

            {apiError && (
              <div className='p-3 bg-error-light border border-error rounded-md'>
                <p className='text-sm text-error-dark'>{apiError}</p>
              </div>
            )}

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Set password'}
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
