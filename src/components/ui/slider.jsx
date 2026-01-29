import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const sliderRootVariants = cva('relative flex w-full touch-none select-none items-center', {
  variants: {
    variant: {
      default: '',
      // Figma slider (BG node-id=1209:39328): bg #e5e7ec, radius 96
      calculator: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const sliderTrackVariants = cva('relative w-full grow overflow-hidden', {
  variants: {
    variant: {
      default: 'h-2 rounded-full bg-secondary',
      calculator: 'h-[6px] rounded-[96px] bg-[#e5e7ec]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const sliderRangeVariants = cva('absolute h-full', {
  variants: {
    variant: {
      default: 'bg-primary',
      calculator: 'bg-[#375dfb]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const sliderThumbVariants = cva(
  'block rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'h-5 w-5 border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        calculator:
          'relative size-[16px] rounded-[980px] border border-[#e2e4e9] bg-white shadow-[0px_2px_2px_rgba(27,28,29,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#375dfb]/30 focus-visible:ring-offset-2 after:absolute after:inset-[31.25%] after:rounded-[56px] after:bg-[#375dfb] after:shadow-[0px_2px_4px_rgba(27,28,29,0.04)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Slider = React.forwardRef(({ className, variant, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(sliderRootVariants({ variant }), className)}
    {...props}
  >
    <SliderPrimitive.Track className={cn(sliderTrackVariants({ variant }))}>
      <SliderPrimitive.Range className={cn(sliderRangeVariants({ variant }))} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn(sliderThumbVariants({ variant }))} />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export {
  Slider,
  sliderRootVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
};
