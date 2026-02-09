import { baseApi } from './baseApi';

/**
 * Transform Frappe country_info response to normalized list.
 * @param {Object} countryInfo - { "United States": { code, isd, ... }, ... }
 * @returns {Array<{ value, label, flagCode, flag, code, name, uniqueKey }>}
 */
function transformCountryInfo(countryInfo) {
  const countriesList = [];
  let keyIndex = 0;

  Object.entries(countryInfo || {}).forEach(([countryName, info]) => {
    if (!info?.isd) return;

    const countryCode = (info.code || '').toLowerCase();
    const phoneCode = info.isd || '';
    const uniqueKey = `${phoneCode}-${countryCode || countryName.toLowerCase().replaceAll(/\s+/g, '-')}-${keyIndex++}`;

    countriesList.push({
      value: phoneCode,
      label: countryName,
      flagCode: countryCode,
      flag: countryCode ? `https://flagcdn.com/${countryCode}.svg` : null,
      code: countryCode,
      name: countryName,
      uniqueKey,
    });
  });

  return countriesList.sort((a, b) => {
    if (a.value === '+1' && a.name === 'United States') return -1;
    if (b.value === '+1' && b.name === 'United States') return 1;
    return (a.name || a.label || '').localeCompare(b.name || b.label || '');
  });
}

/**
 * Countries API – injected into baseApi (same pattern as authApi).
 */
export const countriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => ({
        url: '/method/frappe.geo.country_info.get_country_timezone_info',
        method: 'POST',
        credentials: 'include',
      }),
      transformResponse: (response) => {
        const countryInfo = response?.message?.country_info ?? response?.country_info ?? {};
        return transformCountryInfo(countryInfo);
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetCountriesQuery, useLazyGetCountriesQuery } = countriesApi;
