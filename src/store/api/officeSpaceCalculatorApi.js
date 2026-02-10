import { baseApi } from './baseApi';

const DOCTYPE_OFFICE_SPACE_CALCULATOR = 'Office Space Calculator';
const DOCTYPE_ROOM_TYPE = 'Room Type';
const DOCTYPE_SPEC_TYPE = 'Spec Type';

function encodePathSegment(s) {
  return encodeURIComponent(String(s ?? ''));
}

export const officeSpaceCalculatorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create a new Office Space Calculator report (guest-friendly endpoint).
     * POST /api/method/phi_designs_backend.phi_design_app.api.create_office_space_calculator_report
     */
    createOfficeSpaceCalculatorReport: builder.mutation({
      query: (payload) => ({
        url: '/method/phi_designs_backend.phi_design_app.api.create_office_space_calculator_report',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => response?.message ?? response,
    }),

    /**
     * Fetch a single Office Space Calculator document by name/id.
     * Public API (guest allowed): GET ...office_space_calculator.get_office_space_calculator_doc
     *
     * Use the query hook (useGetOfficeSpaceCalculatorQuery) and read from its cache — do not
     * copy this into a Redux slice. RTK Query is the single source of truth for server state;
     * duplicating in a slice would hurt optimization (extra state, sync on refetch/mutation).
     */
    getOfficeSpaceCalculator: builder.query({
      query: (name) => ({
        url: `/method/phi_designs_backend.phi_design_app.doctype.office_space_calculator.office_space_calculator.get_office_space_calculator_doc?name=${encodeURIComponent(String(name ?? ''))}`,
        method: 'GET',
      }),
      transformResponse: (response) => response?.message ?? response?.data ?? response,
    }),

    /**
     * Update an existing Office Space Calculator document.
     * Public API (guest allowed): POST ...office_space_calculator.update_office_space_calculator_doc
     */
    updateOfficeSpaceCalculator: builder.mutation({
      query: ({ name, data }) => ({
        url: '/method/phi_designs_backend.phi_design_app.doctype.office_space_calculator.office_space_calculator.update_office_space_calculator_doc',
        method: 'POST',
        body: { name, data },
      }),
      transformResponse: (response) => response?.message ?? response?.data ?? response,
    }),

    /**
     * Fetch Room Type docs for the given list of names (to map groups).
     * Public API (guest allowed): GET ...room_type.get_room_types_by_names
     */
    getRoomTypesByNames: builder.query({
      query: (names) => {
        const list = Array.isArray(names) ? names.filter(Boolean) : [];
        return {
          url: `/method/phi_designs_backend.phi_design_app.doctype.room_type.room_type.get_room_types_by_names?names=${encodeURIComponent(JSON.stringify(list))}`,
          method: 'GET',
        };
      },
      transformResponse: (response) => response?.message ?? response?.data ?? response,
    }),

    /**
     * Fetch all Room Type docs (for add-room dropdown).
     * Public API (guest allowed): GET ...room_type.get_all_room_types
     */
    getAllRoomTypes: builder.query({
      query: () => ({
        url: '/method/phi_designs_backend.phi_design_app.doctype.room_type.room_type.get_all_room_types',
        method: 'GET',
      }),
      transformResponse: (response) => response?.message ?? response?.data ?? response,
    }),

    /**
     * Fetch all Spec Type docs (full list).
     * Public API (guest allowed): GET ...spec_type.get_all_spec_types
     */
    getAllSpecTypes: builder.query({
      query: () => ({
        url: '/method/phi_designs_backend.phi_design_app.doctype.spec_type.spec_type.get_all_spec_types',
        method: 'GET',
      }),
      transformResponse: (response) => response?.message ?? response?.data ?? response,
    }),

    /**
     * Fetch Spec Type docs by spec_type_name (e.g. compact/standard/lavish).
     * Public API (guest allowed): GET ...spec_type.get_spec_types_by_names
     */
    getSpecTypesByNames: builder.query({
      query: (names) => {
        const list = Array.isArray(names) ? names.filter(Boolean) : [];
        return {
          url: `/method/phi_designs_backend.phi_design_app.doctype.spec_type.spec_type.get_spec_types_by_names?names=${encodeURIComponent(JSON.stringify(list))}`,
          method: 'GET',
        };
      },
      transformResponse: (response) => response?.message ?? response?.data ?? response,
    }),

    /**
     * Fetch a single Spec Type document by name (docname).
     * Includes room_type_areas child table. Public API (guest allowed): GET ...spec_type.get_spec_type_doc
     */
    getSpecType: builder.query({
      query: (name) => ({
        url: `/method/phi_designs_backend.phi_design_app.doctype.spec_type.spec_type.get_spec_type_doc?name=${encodeURIComponent(String(name ?? ''))}`,
        method: 'GET',
      }),
      transformResponse: (response) => response?.message ?? response?.data ?? response,
    }),

    /**
     * Fetch all Spec Types with their room_type_areas room types (for filtering dropdown by room type).
     * Public API (guest allowed): GET ...office_space_calculator_room.get_spec_types_with_room_types
     * Returns: [{ name, spec_type_name, room_types: string[] }]
     */
    getSpecTypesWithRoomTypes: builder.query({
      query: () => ({
        url: '/method/phi_designs_backend.phi_design_app.doctype.office_space_calculator_room.office_space_calculator_room.get_spec_types_with_room_types',
        method: 'GET',
      }),
      transformResponse: (response) =>
        Array.isArray(response) ? response : (response?.message ?? []),
    }),

    /**
     * Fetch area_per_unit for a (spec_type, room_type) pair.
     * Public API (guest allowed): GET ...office_space_calculator_room.get_area_per_unit
     */
    getAreaPerUnit: builder.query({
      query: ({ spec_type, room_type }) => ({
        url: `/method/phi_designs_backend.phi_design_app.doctype.office_space_calculator_room.office_space_calculator_room.get_area_per_unit?spec_type=${encodeURIComponent(
          String(spec_type ?? ''),
        )}&room_type=${encodeURIComponent(String(room_type ?? ''))}`,
        method: 'GET',
      }),
      transformResponse: (response) => response?.message ?? response,
    }),

    /**
     * Send Office Space Report PDF to given emails (backend sends mail with PDF attached).
     * Public API (guest allowed): POST ...api.send_office_space_report_email
     * Body: { recipient_emails: string[], pdf_base64: string, share_url?: string, report_id?: string, first_name?: string, logo_url?: string }
     */
    sendOfficeSpaceReportEmail: builder.mutation({
      query: (payload) => ({
        url: '/method/phi_designs_backend.phi_design_app.api.send_office_space_report_email',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => response?.message ?? response,
    }),

    /**
     * Get or create share token for a report (authenticated). Used to build public share URL.
     * GET /api/method/...api.get_or_create_share_token?report_id=...
     */
    getOrCreateShareToken: builder.query({
      query: (reportId) => ({
        url: `/method/phi_designs_backend.phi_design_app.api.get_or_create_share_token?report_id=${encodeURIComponent(String(reportId ?? ''))}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        const msg = response?.message ?? response;
        const token =
          response?.share_token ??
          (typeof msg === 'object' && msg !== null ? msg?.share_token : null) ??
          (typeof msg === 'string' ? msg : null);
        return typeof token === 'string' ? token : '';
      },
    }),

    /**
     * Fetch report by share token (guest allowed). For read-only shared view.
     * GET /api/method/...api.get_office_space_calculator_by_share?report_id=...&share=...
     */
    getOfficeSpaceCalculatorByShare: builder.query({
      query: ({ reportId, share }) => ({
        url: `/method/phi_designs_backend.phi_design_app.api.get_office_space_calculator_by_share?report_id=${encodeURIComponent(String(reportId ?? ''))}&share=${encodeURIComponent(String(share ?? ''))}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        const raw = response?.message ?? response;
        const data =
          raw?.data ?? response?.data ?? (typeof raw?.data === 'undefined' ? response : raw);
        const room_types = Array.isArray(raw?.room_types)
          ? raw.room_types
          : Array.isArray(response?.room_types)
            ? response.room_types
            : [];
        return { data, room_types };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOfficeSpaceCalculatorReportMutation,
  useGetOfficeSpaceCalculatorQuery,
  useUpdateOfficeSpaceCalculatorMutation,
  useGetAllRoomTypesQuery,
  useGetRoomTypesByNamesQuery,
  useGetAllSpecTypesQuery,
  useGetSpecTypesByNamesQuery,
  useGetSpecTypesWithRoomTypesQuery,
  useGetSpecTypeQuery,
  useLazyGetAreaPerUnitQuery,
  useSendOfficeSpaceReportEmailMutation,
  useLazyGetOrCreateShareTokenQuery,
  useGetOfficeSpaceCalculatorByShareQuery,
} = officeSpaceCalculatorApi;
