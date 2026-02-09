import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * Welcome Page Component
 * Public landing page for non-authenticated users
 * Lead magnet flow: User can explore this page before being asked to login
 */
export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50'>
      <div className='container mx-auto px-6 py-16'>
        <div className='max-w-4xl mx-auto text-center space-y-8'>
          {/* Hero Section */}
          <div className='space-y-4'>
            <h1 className='text-5xl md:text-6xl font-bold text-neutral-900 leading-tight'>
              Calculate Your Office Space Needs
            </h1>
            <p className='text-xl text-neutral-600 max-w-2xl mx-auto'>
              Welcome to Phi Design Calculator. Get accurate office space calculations tailored to
              your business requirements.
            </p>
          </div>

          {/* CTA Section */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-8'>
            <Button size='lg' onClick={() => navigate('/calculator')} className='px-8 py-6 text-lg'>
              Get Started →
            </Button>
            <Button
              size='lg'
              variant='outline'
              onClick={() => navigate('/login')}
              className='px-8 py-6 text-lg'
            >
              Learn More
            </Button>
          </div>

          {/* Features Section */}
          <div className='grid md:grid-cols-3 gap-8 pt-16'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                <span className='text-2xl'>📊</span>
              </div>
              <h3 className='text-lg font-semibold text-neutral-900 mb-2'>Accurate Calculations</h3>
              <p className='text-neutral-600'>
                Get precise office space calculations based on your requirements
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                <span className='text-2xl'>⚡</span>
              </div>
              <h3 className='text-lg font-semibold text-neutral-900 mb-2'>Fast Results</h3>
              <p className='text-neutral-600'>Get instant calculations and recommendations</p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='w-12 h-12 bg-success-light rounded-lg flex items-center justify-center mb-4 mx-auto'>
                <span className='text-2xl'>🎯</span>
              </div>
              <h3 className='text-lg font-semibold text-neutral-900 mb-2'>Customized Solutions</h3>
              <p className='text-neutral-600'>Tailored recommendations for your business</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
