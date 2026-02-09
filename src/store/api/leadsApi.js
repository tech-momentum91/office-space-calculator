import { baseApi } from './baseApi';

export const leadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create a Website User + Lead (guest-friendly endpoint).
     * POST /api/method/phi_designs_backend.custom_api.auth.api.create_user_and_lead
     */
    createUserAndLead: builder.mutation({
      query: (payload) => ({
        url: '/method/phi_designs_backend.custom_api.auth.api.create_user_and_lead',
        method: 'POST',
        body: payload ?? {},
      }),
      transformResponse: (response) => response?.message ?? response,
      transformErrorResponse: (response) => ({
        status: response?.status,
        data: response?.data ?? null,
        error: response?.error ?? response?.data?.message ?? 'Request failed',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateUserAndLeadMutation } = leadsApi;
