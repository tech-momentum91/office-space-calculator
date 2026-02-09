'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { fetchCountries, DEFAULT_COUNTRY_CODE, parseContactNumber } from '@/constants/countries';
import { cn } from '@/lib/utils';

/** Renders flag image with fallback on load error. */
function CountryFlag({ flag, label, className }) {
  const [errored, setErrored] = useState(false);
  const isUrl = typeof flag === 'string' && flag.startsWith('http');
  if (!flag || errored || !isUrl) {
    return (
      <span
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f2f4f7] text-[10px]',
          className,
        )}
        aria-hidden='true'
      >
        🌍
      </span>
    );
  }
  return (
    <img
      src={flag}
      alt=''
      className={cn('h-5 w-5 shrink-0 rounded-full object-cover', className)}
      loading='lazy'
      onError={() => setErrored(true)}
    />
  );
}

/**
 * PhoneInput – shadcn-style: country Select + number Input in one row.
 * onChange receives { countryCode, number, formattedValue }.
 */
const PhoneInput = forwardRef(
  (
    {
      countryCode: controlledCountryCode,
      value: controlledValue = '',
      onChange,
      onCountryCodeChange,
      placeholder = 'Enter phone number',
      disabled = false,
      hasError = false,
      size = 'medium',
      variant = 'default',
      maxLength = 15,
      allowNumericOnly = true,
      className,
      id,
      inputProps = {},
      ...rest
    },
    ref,
  ) => {
    const [internalCountryCode, setInternalCountryCode] = useState(
      controlledCountryCode ?? DEFAULT_COUNTRY_CODE,
    );
    const [internalValue, setInternalValue] = useState(controlledValue ?? '');
    const [selectedCountryKey, setSelectedCountryKey] = useState('');
    const [countries, setCountries] = useState([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);

    const countryCode =
      controlledCountryCode === undefined ? internalCountryCode : controlledCountryCode;
    const value = controlledValue === undefined ? internalValue : controlledValue;

    useEffect(() => {
      let isMounted = true;
      fetchCountries()
        .then((fetched) => {
          if (isMounted) {
            setCountries(fetched);
            const initial = fetched.find((c) => c.value === countryCode);
            if (initial) setSelectedCountryKey(initial.uniqueKey);
            setIsLoadingCountries(false);
          }
        })
        .catch((error) => {
          console.error('Failed to load countries:', error);
          if (isMounted) setIsLoadingCountries(false);
        });
      return () => {
        isMounted = false;
      };
    }, []);

    useEffect(() => {
      if (controlledCountryCode !== undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- controlled sync
        setInternalCountryCode(controlledCountryCode);
      }
    }, [controlledCountryCode]);

    useEffect(() => {
      if (controlledValue !== undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- controlled sync
        setInternalValue(controlledValue);
      }
    }, [controlledValue]);

    useEffect(() => {
      if (countries.length > 0) {
        const c = countries.find((x) => x.value === countryCode);
        if (c) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- sync when countries load
          setSelectedCountryKey(c.uniqueKey);
        }
      }
    }, [countries, countryCode]);

    const handleCountryCodeChange = (newCountryKey) => {
      const country = countries.find((c) => c.uniqueKey === newCountryKey);
      if (!country) return;
      const newCode = country.value;
      setSelectedCountryKey(newCountryKey);
      if (controlledCountryCode === undefined) setInternalCountryCode(newCode);
      onCountryCodeChange?.(newCode);
      const currentNumber = (value ?? '').trim();
      if (currentNumber) {
        onChange?.({
          countryCode: newCode,
          number: currentNumber,
          formattedValue: `${newCode}-${currentNumber}`,
        });
      }
    };

    const handlePhoneNumberChange = (e) => {
      let newValue = e.target.value;
      if (allowNumericOnly) newValue = newValue.replaceAll(/\D/g, '');
      newValue = newValue.slice(0, maxLength);
      if (controlledValue === undefined) setInternalValue(newValue);
      const formattedValue = newValue ? `${countryCode}-${newValue}` : '';
      onChange?.({ countryCode, number: newValue, formattedValue, event: e });
    };

    const selectedCountry =
      countries.find((c) => c.uniqueKey === selectedCountryKey) ||
      countries.find((c) => c.value === countryCode) ||
      countries[0];
    const selectValue = selectedCountry?.uniqueKey ?? selectedCountryKey;

    return (
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-[8px] border bg-white shadow-[0px_1px_2px_rgba(228,229,231,0.24)]',
          hasError ? 'border-[#f04438]' : 'border-[#e2e4e9]',
          className,
        )}
        {...rest}
      >
        <Select
          value={selectValue}
          onValueChange={handleCountryCodeChange}
          disabled={disabled || isLoadingCountries}
        >
          <SelectTrigger
            variant='bordered'
            className='h-auto w-auto min-w-0 shrink-0 gap-2 rounded-r-none border-r border-[#e2e4e9] shadow-none focus:ring-0'
            aria-label='Country code'
          >
            <SelectValue>
              <span className='flex items-center gap-2'>
                {selectedCountry?.flag &&
                typeof selectedCountry.flag === 'string' &&
                !selectedCountry.flag.startsWith('http') ? (
                    <span className='shrink-0 text-[14px]'>{selectedCountry.flag}</span>
                  ) : (
                    <CountryFlag
                      flag={selectedCountry?.flag}
                      label={selectedCountry?.label}
                      className='shrink-0'
                    />
                  )}
                <span className='text-[14px] font-normal text-[#0a0d14]'>
                  {isLoadingCountries ? '…' : (selectedCountry?.value ?? DEFAULT_COUNTRY_CODE)}
                </span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            className='min-w-[260px] border border-[#e2e4e9] rounded-[8px] p-0 shadow-lg bg-white'
            position='popper'
            side='top'
            sideOffset={4}
            viewportClassName={cn(
              'h-[260px] overflow-y-scroll overflow-x-hidden py-0',
              '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#f9fafb] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d0d5dd]',
            )}
            style={{ maxHeight: 280 }}
          >
            {isLoadingCountries ? (
              <SelectItem value='loading' disabled>
                Loading...
              </SelectItem>
            ) : countries.length > 0 ? (
              countries.map((c) => (
                <SelectItem
                  key={c.uniqueKey}
                  value={c.uniqueKey}
                  variant='table'
                  className={cn(
                    'flex items-center gap-2.5 py-2.5 pl-8 pr-4 text-[14px] leading-[20px] text-[#101828] border-b border-[#eaecf0] last:border-b-0 rounded-none',
                    'data-[highlighted]:bg-[#f9fafb] data-[highlighted]:text-[#101828]',
                  )}
                >
                  {c.flag && typeof c.flag === 'string' && !c.flag.startsWith('http') ? (
                    <span className='flex h-5 w-5 shrink-0 items-center justify-center text-[16px]'>
                      {c.flag}
                    </span>
                  ) : (
                    <span className='flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f2f4f7]'>
                      <CountryFlag
                        flag={c.flag}
                        label={c.label}
                        className='h-5 w-5 rounded-full object-cover'
                      />
                    </span>
                  )}
                  <span className='flex min-w-0 flex-1 items-center justify-between gap-3'>
                    <span className='truncate font-medium text-[#101828]'>
                      {c.label ?? c.name ?? c.code}
                    </span>
                    <span className='shrink-0 text-[#667085] tabular-nums'>{c.value}</span>
                  </span>
                </SelectItem>
              ))
            ) : (
              <SelectItem value='error' disabled>
                Failed to load countries
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Input
          ref={ref}
          id={id}
          type='tel'
          inputMode='tel'
          autoComplete='tel'
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handlePhoneNumberChange}
          disabled={disabled || isLoadingCountries}
          maxLength={maxLength}
          variant='basic'
          className={cn(
            'flex-1 min-w-0 rounded-l-none border-0 border-transparent bg-transparent shadow-none focus-visible:ring-0',
            inputProps.className,
          )}
          {...inputProps}
        />
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

/**
 * PhoneInputController – for react-hook-form.
 * value: formatted string (e.g. "+1-5551234567") or digits; onChange(formattedValue).
 */
export const PhoneInputController = ({
  value,
  onChange,
  error,
  countryCode: initialCountryCode,
  onCountryCodeChange,
  ...props
}) => {
  const [countryCode, setCountryCode] = useState(initialCountryCode ?? DEFAULT_COUNTRY_CODE);
  const [countries, setCountries] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [lastFormattedValue, setLastFormattedValue] = useState('');

  useEffect(() => {
    fetchCountries().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    if (value === lastFormattedValue) return;
    if (!value) {
      if (lastFormattedValue !== undefined && lastFormattedValue !== '') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when value cleared
        setPhoneNumber('');

        setLastFormattedValue('');
      }
      return;
    }
    if (typeof value === 'string' && value.includes('-')) {
      const run = async () => {
        const list = countries.length > 0 ? countries : await fetchCountries();
        if (list.length === 0) {
          const fetched = await fetchCountries();
          setCountries(fetched);
          return parseContactNumber(value, fetched);
        }
        return parseContactNumber(value, list);
      };
      run().then((parsed) => {
        setCountryCode(parsed.countryCode);
        setPhoneNumber(parsed.number);
        setLastFormattedValue(value);
      });
    } else if (typeof value === 'string') {
      setPhoneNumber(value);
    }
  }, [value]);

  useEffect(() => {
    if (initialCountryCode && !value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initial sync
      setCountryCode(initialCountryCode);
    }
  }, [initialCountryCode, value]);

  const handleChange = (data) => {
    const number = data?.number ?? '';
    const formattedValue = data?.formattedValue ?? (number ? `${countryCode}-${number}` : '');
    setPhoneNumber(number);
    setLastFormattedValue(formattedValue);
    onChange?.(formattedValue);
  };

  const handleCountryCodeChange = (newCode) => {
    setCountryCode(newCode);
    onCountryCodeChange?.(newCode);
    const current = phoneNumber || '';
    if (current) {
      setLastFormattedValue(`${newCode}-${current}`);
      onChange?.(`${newCode}-${current}`);
    } else {
      setLastFormattedValue('');
    }
  };

  return (
    <PhoneInput
      countryCode={countryCode}
      value={phoneNumber}
      onChange={handleChange}
      onCountryCodeChange={handleCountryCodeChange}
      hasError={Boolean(error)}
      {...props}
    />
  );
};

PhoneInputController.displayName = 'PhoneInputController';

export { PhoneInput };
export default PhoneInput;
