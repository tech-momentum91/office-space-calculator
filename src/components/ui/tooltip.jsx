import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipContentVariants = cva(
  'z-50 overflow-hidden shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]',
  {
    variants: {
      variant: {
        default: 'rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground',
        // Black tooltip (like "Add to library")
        dark: 'rounded-[12px] border-0 bg-[#111827] px-4 py-2 text-[14px] text-white shadow-lg',
        // Light tooltip matching calculator theme
        light:
          "rounded-[12px] border border-[#e2e4e9] bg-white px-3 py-2 text-[12px] leading-[1.3] text-[#0a2540] shadow-[0px_6px_10px_rgba(27,28,29,0.06),0px_2px_4px_rgba(27,28,29,0.02)] font-['Plus_Jakarta_Sans',sans-serif]",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const tooltipArrowVariants = cva('', {
  variants: {
    variant: {
      default: 'fill-popover',
      dark: 'fill-[#111827]',
      light: 'fill-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 4, variant, children, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants({ variant }), className)}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className={cn(tooltipArrowVariants({ variant }))} />
    </TooltipPrimitive.Content>
  ),
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
