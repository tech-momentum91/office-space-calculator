import * as React from 'react';

import { cn } from '@/lib/utils';

// Copied/adapted from `devx_frontend/src/components/ui/table.jsx`:
// - Keeps the same export shape (`Root`, `Header`, `Body`, etc.)
// - Uses this repo's `cn` utility and avoids extra dependencies.

const TableContext = React.createContext({ variant: 'default' });

const Table = React.forwardRef(({ className, variant = 'default', ...rest }, forwardedRef) => {
  return (
    <TableContext.Provider value={{ variant }}>
      <div className={cn('w-full overflow-x-auto', className)}>
        <table ref={forwardedRef} className='w-full border-collapse' {...rest} />
      </div>
    </TableContext.Provider>
  );
});
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ ...rest }, forwardedRef) => {
  return <thead ref={forwardedRef} {...rest} />;
});
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ ...rest }, forwardedRef) => {
  return <tbody ref={forwardedRef} {...rest} />;
});
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef(({ className, ...rest }, forwardedRef) => {
  return <tr ref={forwardedRef} className={cn('group/row', className)} {...rest} />;
});
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, ...rest }, forwardedRef) => {
  const { variant } = React.useContext(TableContext);
  const paddingClass =
    variant === 'unstyled' ? '' : variant === 'compact' ? 'px-4 py-2' : 'px-6 py-3';

  return <th ref={forwardedRef} className={cn(paddingClass, className)} {...rest} />;
});
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...rest }, forwardedRef) => {
  const { variant } = React.useContext(TableContext);
  const paddingClass =
    variant === 'unstyled' ? '' : variant === 'compact' ? 'px-4 py-2' : 'px-6 py-4';

  return <td ref={forwardedRef} className={cn(paddingClass, className)} {...rest} />;
});
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef(({ className, ...rest }, forwardedRef) => (
  <caption
    ref={forwardedRef}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...rest}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table as Root,
  TableHeader as Header,
  TableBody as Body,
  TableHead as Head,
  TableRow as Row,
  TableCell as Cell,
  TableCaption as Caption,
};
