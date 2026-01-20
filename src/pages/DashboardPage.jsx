import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PageLayout from '@/components/layouts/PageLayout';

/**
 * Dashboard Page Component
 * Protected page showing user information and logout option
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageLayout
      title='Phi Design Calculator Dashboard'
      description='Welcome to your office space calculator dashboard'
    >
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16'>
                <AvatarFallback className='bg-primary-100 text-primary-700 text-lg'>
                  {getInitials(user?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className='text-lg font-semibold text-neutral-900'>
                  {user?.full_name || 'User'}
                </h3>
                <p className='text-sm text-neutral-600'>{user?.email || 'No email'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Button variant='outline' className='w-full justify-start'>
              Calculate Office Space
            </Button>
            <Button variant='outline' className='w-full justify-start'>
              View Reports
            </Button>
            <Button variant='outline' className='w-full justify-start'>
              Account Settings
            </Button>
            <Button variant='destructive' className='w-full justify-start' onClick={handleLogout}>
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Welcome Message */}
        <Card className='bg-gradient-to-r from-primary-50 to-secondary-50 border-none'>
          <CardContent className='pt-6'>
            <div className='text-center space-y-2'>
              <h3 className='text-xl font-semibold text-neutral-900'>
                🎉 Welcome to Phi Design Calculator!
              </h3>
              <p className='text-neutral-600'>
                Start calculating your office space requirements with our powerful tools.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
