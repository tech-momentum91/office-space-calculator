import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

/** Toast options variant: light green success style for "Copied to clipboard" */
export const copySuccessToastOptions = {
  duration: 2000,
  style: {
    backgroundColor: '#dcfce7',
    border: 'none',
    borderRadius: '12px',
    color: '#166534',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  iconTheme: {
    primary: '#16a34a',
    secondary: '#fff',
  },
};

/** Default icons per toast type. Override via Toaster icons prop. */
export const toastIcons = {
  success: <CircleCheck className='h-4 w-4' />,
  info: <Info className='h-4 w-4' />,
  warning: <TriangleAlert className='h-4 w-4' />,
  error: <OctagonX className='h-4 w-4' />,
  loading: <LoaderCircle className='h-4 w-4 animate-spin' />,
};

/** Default classNames for toasts. Customize per type by extending these. */
export const toastClassNames = {
  toast:
    'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
  description: 'group-[.toast]:text-muted-foreground',
  actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
  cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
};

/** Optional: type-specific toast classNames (use when calling toast.success/error/etc. or merge into toastClassNames.toast with [&[data-type=success]]:... in Tailwind) */
export const toastClassNamesByType = {
  success:
    'group-[.toaster]:[&[data-type=success]]:bg-green-50 group-[.toaster]:[&[data-type=success]]:text-green-800 group-[.toaster]:[&[data-type=success]]:border-green-200',
  error:
    'group-[.toaster]:[&[data-type=error]]:bg-red-50 group-[.toaster]:[&[data-type=error]]:text-red-800 group-[.toaster]:[&[data-type=error]]:border-red-200',
  info: 'group-[.toaster]:[&[data-type=info]]:bg-blue-50 group-[.toaster]:[&[data-type=info]]:text-blue-800 group-[.toaster]:[&[data-type=info]]:border-blue-200',
  warning:
    'group-[.toaster]:[&[data-type=warning]]:bg-amber-50 group-[.toaster]:[&[data-type=warning]]:text-amber-800 group-[.toaster]:[&[data-type=warning]]:border-amber-200',
};

const defaultToastClassNames = {
  ...toastClassNames,
  toast: [toastClassNames.toast, ...Object.values(toastClassNamesByType)].join(' '),
};

const Toaster = ({
  theme: themeProp,
  icons: iconsProp,
  toastOptions: toastOptionsProp,
  ...props
}) => {
  const { theme: themeFromProvider = 'system' } = useTheme();
  const theme = themeProp ?? themeFromProvider;
  const icons = iconsProp ?? toastIcons;
  const toastOptions = {
    ...toastOptionsProp,
    classNames: {
      ...defaultToastClassNames,
      ...toastOptionsProp?.classNames,
    },
  };

  return (
    <Sonner
      theme={theme}
      className='toaster group'
      icons={icons}
      toastOptions={toastOptions}
      {...props}
    />
  );
};

export { Toaster };
