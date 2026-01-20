/**
 * Auth Layout Component
 * Layout for authentication pages (login, reset password, etc.)
 */
export default function AuthLayout({ children }) {
  return (
    <div className='min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>{children}</div>
    </div>
  );
}
