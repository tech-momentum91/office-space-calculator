import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/components/layouts/AuthLayout';

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .refine((value) => {
      // Allow "administrator" as a special case
      if (value === 'administrator') return true;
      return z.string().email().safeParse(value).success;
    }, 'Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Login Page Component
 * Basic login form with email and password
 * Uses RTK Query mutation for authentication
 */
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(loginAsync({ email: data.email, password: data.password }));

    if (loginAsync.fulfilled.match(result)) {
      // Login successful, navigate to dashboard
      navigate('/dashboard');
    }
    // If rejected, error will be shown automatically from Redux state
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                type='text'
                placeholder='Enter your email'
                {...register('email')}
                className={errors.email ? 'border-error' : ''}
                autoFocus
              />
              {errors.email && <p className='text-sm text-error'>{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                {...register('password')}
                className={errors.password ? 'border-error' : ''}
              />
              {errors.password && <p className='text-sm text-error'>{errors.password.message}</p>}
            </div>

            {/* Error Message from API */}
            {error && (
              <div className='p-3 bg-error-light border border-error rounded-md'>
                <p className='text-sm text-error-dark'>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Back to Welcome */}
      <div className='text-center mt-4'>
        <button
          onClick={() => navigate('/welcome')}
          className='text-sm text-neutral-600 hover:text-neutral-900'
        >
          ← Back to Welcome
        </button>
      </div>
    </AuthLayout>
  );
}
