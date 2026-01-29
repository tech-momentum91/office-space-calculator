import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: 'h-10',
        // Figma: node-id=1209:39312 "Basic Input"
        basic:
          "h-[36px] rounded-[10px] border-[#e2e4e9] bg-white pl-[12px] pr-[10px] py-[10px] text-[14px] leading-[20px] tracking-[-0.084px] font-normal text-[#0a0d14] placeholder:text-[#868c98] focus-visible:ring-0 focus-visible:ring-offset-0 font-['Plus_Jakarta_Sans',sans-serif]",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Input = React.forwardRef(({ className, type, variant, ...props }, ref) => {
  return (
    <input type={type} className={cn(inputVariants({ variant }), className)} ref={ref} {...props} />
  );
});
Input.displayName = 'Input';

export { Input, inputVariants };
