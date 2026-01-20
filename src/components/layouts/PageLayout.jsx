/**
 * Page Layout Component
 * Standard layout for application pages with header
 */
export default function PageLayout({ children, title, description }) {
  return (
    <div className='min-h-screen bg-neutral-50'>
      {title && (
        <header className='bg-white border-b border-neutral-200 px-6 py-4'>
          <div className='container mx-auto'>
            <h1 className='text-2xl font-bold text-neutral-900'>{title}</h1>
            {description && <p className='text-sm text-neutral-600 mt-1'>{description}</p>}
          </div>
        </header>
      )}
      <main className='container mx-auto px-6 py-8'>{children}</main>
    </div>
  );
}
