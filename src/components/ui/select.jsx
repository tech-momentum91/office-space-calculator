'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const triggerVariants = {
  default:
    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  /** Plain text in cell: no border, no chevron (e.g. Room Type in table) */
  plain:
    "flex h-auto min-w-[140px] w-auto items-center justify-start gap-2 rounded-none border-0 bg-transparent p-0 font-['Inter',sans-serif] shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:truncate [&>span]:text-[14px] [&>span]:font-medium [&>span]:leading-[20px] [&>span]:text-[#101828] [&>span[data-placeholder]]:text-[#475467] [&>svg]:hidden",
  /** Bordered dropdown (e.g. Spec Type in table) */
  bordered:
    "flex h-[30px] w-[117px] items-center justify-between gap-2 rounded-[6px] border border-[#d0d5dd] bg-white px-[8px] py-[6px] font-['Inter',sans-serif] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] focus:ring-0 focus:ring-offset-0 focus:border-[#2970ff] [&>span]:truncate [&>span]:text-[14px] [&>span]:font-medium [&>span]:leading-[18px] [&>span]:text-[#344054] data-[placeholder]:text-[#475467] [&>svg]:shrink-0 [&>svg]:text-[#344054]",
};

const SelectTrigger = React.forwardRef(
  ({ className, variant = 'default', children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(triggerVariants[variant] ?? triggerVariants.default, className)}
      {...props}
    >
      {children}
      {variant !== 'plain' && (
        <SelectPrimitive.Icon asChild>
          <ChevronDown className='h-4 w-4 opacity-50' />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className='h-4 w-4' />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className='h-4 w-4' />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const contentVariants = {
  default: '',
  /** Dropdown panel for table (Room Type / Spec Type): rounded border, shadow */
  table:
    'min-w-[var(--radix-select-trigger-width)] rounded-[6px] border border-[#d0d5dd] bg-white py-1 shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),0px_12px_16px_-4px_rgba(16,24,40,0.08)]',
};

const SelectContent = React.forwardRef(
  (
    {
      className,
      children,
      position = 'popper',
      variant = 'default',
      sideOffset,
      viewportClassName,
      hideScrollButtons = false,
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={variant === 'table' ? 4 : sideOffset}
        className={cn(
          'relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]',
          viewportClassName ? 'overflow-hidden' : 'overflow-y-auto',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          contentVariants[variant],
          className,
        )}
        {...props}
      >
        {!hideScrollButtons && <SelectScrollUpButton />}
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              !viewportClassName &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
            position === 'popper' &&
              viewportClassName &&
              'w-full min-w-[var(--radix-select-trigger-width)]',
            viewportClassName,
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {!hideScrollButtons && <SelectScrollDownButton />}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const itemVariants = {
  default:
    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  /** Table dropdown item: 14px, pl-8 for checkmark, hover/focus bg */
  table:
    'relative flex w-full cursor-pointer select-none items-center py-2 pl-8 pr-3 text-[14px] font-medium leading-[20px] text-[#344054] outline-none focus:bg-[#f9fafb] focus:text-[#101828] data-[highlighted]:bg-[#f9fafb] data-[highlighted]:text-[#101828] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
};

const SelectItem = React.forwardRef(
  ({ className, variant = 'default', children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(itemVariants[variant] ?? itemVariants.default, className)}
      {...props}
    >
      <span className='absolute left-2 flex h-4 w-4 items-center justify-center'>
        <SelectPrimitive.ItemIndicator>
          <Check className='h-4 w-4' />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ),
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
