import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] font-["Plus_Jakarta_Sans",sans-serif] font-bold text-[15px] leading-[24px] tracking-normal text-center transition-opacity hover:opacity-90',
        // Figma node-id=1209:39367 (layout option card)
        layoutOption:
          'h-auto w-full justify-start whitespace-normal bg-white text-left shadow-none hover:bg-white hover:text-current',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        phone: 'w-[180px] h-[48px] rounded-lg pt-[12px] pr-[19px] pb-[12px] pl-[18px]',
        // Used with variant="layoutOption"
        layoutOption: 'h-auto p-[12px] rounded-[11px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    // Add gradient background for gradient variant
    const gradientStyle =
      variant === 'gradient'
        ? {
          background:
              'linear-gradient(135deg, #0D47A1 0%, #0058A6 20%, #0066A4 40%, #00729E 60%, #007E97 80%, #00888F 100%)',
          ...style,
        }
        : style;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={gradientStyle}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
