/**
 * Page Loader Component
 * Full-page loading spinner
 */
export default function PageLoader() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-neutral-50'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin' />
        <p className='text-lg text-neutral-600'>Loading...</p>
      </div>
    </div>
  );
}
