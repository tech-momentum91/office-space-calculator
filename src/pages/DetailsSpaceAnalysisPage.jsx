import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import illustration from '@/assets/image/illustation.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, CheckCircle2, Coffee, Lightbulb, Ruler } from 'lucide-react';
import { RiBuildingLine } from 'react-icons/ri';
import { LuMonitorSpeaker } from 'react-icons/lu';

import * as React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkSession, loginAsync } from '@/store/slices/authSlice';
import { selectOfficeCalculatorValues } from '@/store/slices/officeCalculatorSlice';
import { calcResults, normalizeForCalc } from '@/utils/office-space-calculator/calcResults';
import { formatCompact } from '@/utils/office-space-calculator/formatNumbers';
import UnlockResultsModal from '@/components/office-space-calculator/UnlockResultsModal';
import SpaceAnalysisPdfDocument from '@/components/office-space-calculator/SpaceAnalysisPdfDocument';
import { pdf } from '@react-pdf/renderer';
import {
  useGetOfficeSpaceCalculatorQuery,
  useGetOfficeSpaceCalculatorByShareQuery,
  useCreateOfficeSpaceCalculatorReportMutation,
  useUpdateOfficeSpaceCalculatorMutation,
  useGetAllRoomTypesQuery,
  useGetRoomTypesByNamesQuery,
  useGetAllSpecTypesQuery,
  useGetSpecTypesWithRoomTypesQuery,
  useGetSpecTypeQuery,
} from '@/store/api/officeSpaceCalculatorApi';
import { useCreateUserAndLeadMutation } from '@/store/api/leadsApi';
import chairIcon from '@/assets/svg/chair-01.svg';
import DetailedSpaceBreakdownTable from '@/components/office-space-calculator/DetailedSpaceBreakdownTable';

function formatLayoutLabel(layoutType) {
  if (layoutType === 'compact') return 'Compact';
  if (layoutType === 'standard') return 'Standard';
  return 'Lavish';
}

function StatCard({ title, value, unit, icon, iconWrapperClassName, gradient, meta, className }) {
  return (
    <Card
      className={cn(
        'flex h-[160px] flex-1 flex-col gap-4 rounded-[12px] border border-[#f8fcff] bg-transparent p-4 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]',
        className,
      )}
      style={gradient ? { backgroundImage: gradient } : undefined}
    >
      <div className='flex w-full items-center gap-3'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            iconWrapperClassName,
          )}
        >
          {icon}
        </div>
        <div className="flex-1 text-[16px] font-semibold leading-[24px] text-[#667085] font-['Plus Jakarta Sans',sans-serif]">
          {title}
        </div>
      </div>
      <div className='flex items-baseline gap-2'>
        <span className="inline-block whitespace-nowrap text-[32px] font-semibold leading-[1.2] tracking-[-1.6px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
          {value}
        </span>
        <span className="inline-block whitespace-nowrap text-[20px] font-semibold leading-[1.2] tracking-[-1px] text-[#475467] font-['Plus_Jakarta_Sans',sans-serif]">
          {unit}
        </span>
      </div>
      {meta ? <div className='flex w-full items-center gap-1'>{meta}</div> : null}
    </Card>
  );
}

function SpaceUtilizationCard({ totalSpaceNeeded, availableCarpetArea }) {
  const needed = Number(totalSpaceNeeded) || 0;
  const available = Number(availableCarpetArea) || 0;

  const delta = needed - available;
  const isOverCapacity = delta > 0;
  const pct = available > 0 ? Math.round((needed / available) * 100) : 0;

  // Bar: when over capacity → blue = available, red = overflow. When under → blue = needed, red = excess (both visible).
  const barBase = Math.max(needed, available, 1);
  const bluePct = isOverCapacity
    ? Math.min(available / barBase, 1) * 100
    : (needed / barBase) * 100;
  const redPct = isOverCapacity
    ? Math.max((needed - available) / barBase, 0) * 100
    : Math.max((available - needed) / barBase, 0) * 100;

  return (
    <Card
      className='flex flex-col justify-between rounded-[12px] border border-[#f8fcff] p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] lg:col-span-2 sm:col-span-2 col-span-full'
      style={{
        backgroundImage:
          'linear-gradient(107deg, rgba(255, 214, 214, 0.00) -36.03%, rgba(255, 214, 214, 0.30) 100.13%)',
      }}
    >
      <div className='flex items-start gap-2'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd6d6]'>
          <Ruler className='h-4 w-4 text-[#475467]' aria-hidden='true' />
        </div>
        <div className="text-[18px] font-semibold leading-[1.2] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
          Space Utilization
        </div>
      </div>

      <div className='mt-4 flex w-full flex-col gap-4'>
        <div className='flex w-full items-center justify-end gap-2'>
          <div className='flex items-center gap-[2px]'>
            {isOverCapacity ? (
              <ArrowUp className='h-5 w-5 text-[#d92d20]' aria-hidden='true' />
            ) : (
              <ArrowDown className='h-5 w-5 text-[#12b76a]' aria-hidden='true' />
            )}
            <span className="text-[14px] font-medium leading-[20px] text-[#d92d20] font-['Inter',sans-serif]">
              {pct}%
            </span>
          </div>
          <span className="text-[14px] font-medium leading-[20px] text-[#475467] font-['Inter',sans-serif]">
            {isOverCapacity ? 'sqft over Capacity' : 'sqft under Capacity'}
          </span>
        </div>

        <div className='flex w-full flex-col gap-2'>
          <div className='h-[12px] w-full overflow-hidden rounded-full bg-[#eef2f6]'>
            <div className='flex h-full w-full'>
              <div className='h-full bg-[#2970ff]' style={{ width: `${bluePct}%` }} />
              {redPct > 0 ? (
                <div className='h-full bg-[#f04438]' style={{ width: `${redPct}%` }} />
              ) : null}
            </div>
          </div>

          <div className="flex w-full items-center justify-between text-[14px] font-medium leading-[20px] text-[#475467] font-['Inter',sans-serif]">
            {isOverCapacity ? (
              <>
                <span>0 sq ft</span>
                <span>{Number(available).toLocaleString()} sqft</span>
                <span>{Number(needed).toLocaleString()} sqft</span>
              </>
            ) : (
              <>
                <span>0 sq ft</span>
                <span>{Number(needed).toLocaleString()} sqft</span>
                <span>{Number(available).toLocaleString()} sqft</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function DetailsSpaceAnalysisPage() {
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();
  const shareToken = searchParams.get('share') ?? '';
  const isSharedView = Boolean(reportId && shareToken);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const values = useSelector(selectOfficeCalculatorValues);
  const {
    isAuthenticated,
    sessionChecked,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const pendingReportPayload = React.useMemo(() => {
    try {
      const stored = sessionStorage.getItem('office-space-calculator-pending-report');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore parse errors
    }
    return null;
  }, []);
  const layoutType = values?.layoutType ?? 'compact';
  const [showUnlockModal, setShowUnlockModal] = React.useState(false);
  const [createUserAndLead] = useCreateUserAndLeadMutation();
  const [createReport] = useCreateOfficeSpaceCalculatorReportMutation();
  const { data: specTypeDocument } = useGetSpecTypeQuery(layoutType, { skip: !layoutType });
  const { data: specTypeCompact } = useGetSpecTypeQuery('Compact', { skip: !reportId });
  const { data: specTypeStandard } = useGetSpecTypeQuery('Standard', { skip: !reportId });
  const { data: specTypeLavish } = useGetSpecTypeQuery('Lavish', { skip: !reportId });

  const { data: allRoomTypes } = useGetAllRoomTypesQuery();

  const queryNormal = useGetOfficeSpaceCalculatorQuery(reportId, {
    skip: !reportId || isSharedView,
  });
  const queryByShare = useGetOfficeSpaceCalculatorByShareQuery(
    { reportId, share: shareToken },
    { skip: !reportId || !shareToken },
  );

  const reportDocument = isSharedView
    ? (queryByShare?.data?.data ?? queryByShare?.data)
    : queryNormal?.data;
  const sharedRoomTypes = isSharedView ? (queryByShare?.data?.room_types ?? []) : [];
  const isReportLoading = isSharedView ? queryByShare?.isLoading : queryNormal?.isLoading;
  const isReportError = isSharedView ? queryByShare?.isError : queryNormal?.isError;
  const refetchReport = isSharedView ? queryByShare?.refetch : queryNormal?.refetch;

  // Run session check on mount so we know whether to show page or unlock modal
  React.useEffect(() => {
    if (!sessionChecked) {
      dispatch(checkSession());
    }
  }, [dispatch, sessionChecked]);

  // Redirect to calculator if no reportId and no pending payload (e.g. direct /details-space-analysis)
  React.useEffect(() => {
    if (!reportId && !pendingReportPayload && sessionChecked) {
      navigate('/calculator', { replace: true });
    }
  }, [reportId, pendingReportPayload, sessionChecked, navigate]);

  // Show UnlockResultsModal: when pending lead capture (no report yet) or when viewing report but not authenticated. Never show for shared-link view.
  React.useEffect(() => {
    if (isSharedView) {
      setShowUnlockModal(false);
      return;
    }
    if (!sessionChecked || authLoading) return;
    if (pendingReportPayload && !reportId) {
      setShowUnlockModal(true);
    } else if (reportId) {
      setShowUnlockModal(!isAuthenticated);
    }
  }, [isSharedView, sessionChecked, authLoading, isAuthenticated, reportId, pendingReportPayload]);

  function getFrappeErrorMessage(error) {
    // RTK Query fetchBaseQuery error shape: { status, data } or { error: string }
    const data = error?.data ?? error;

    if (typeof data?.message === 'string' && data.message.trim()) return data.message;
    if (typeof data?.error === 'string' && data.error.trim()) return data.error;

    const serverMessages = data?._server_messages ?? data?._server_message;
    if (typeof serverMessages === 'string' && serverMessages.trim()) {
      try {
        const array = JSON.parse(serverMessages);
        const first = Array.isArray(array) ? array[0] : null;
        if (typeof first === 'string') {
          try {
            const parsed = JSON.parse(first);
            if (parsed?.message) return String(parsed.message);
          } catch {
            // if it's not JSON, it's still a usable message string
            return first;
          }
        }
      } catch {
        // ignore JSON parse errors
      }
    }

    return 'Something went wrong. Please try again.';
  }

  async function handleUnlock(payload) {
    // payload: { name, email, phone }
    let leadResponse;
    try {
      leadResponse = await createUserAndLead({
        name: payload?.name,
        email: payload?.email,
        mobile: payload?.phone,
      }).unwrap();
    } catch (error) {
      throw new Error(getFrappeErrorMessage(error));
    }

    setShowUnlockModal(false);
    // If we have pending report payload: login with email + temporary password, then create report and navigate
    try {
      const tempPassword =
        leadResponse?.data?.user?.temporary_password ??
        leadResponse?.temporary_password ??
        leadResponse?.temp_password ??
        leadResponse?.password;
      if (payload?.email && tempPassword) {
        await dispatch(loginAsync({ email: payload.email, password: tempPassword })).unwrap();
      }
      const res = await createReport(pendingReportPayload).unwrap();
      const reportName = res?.name || res?.data?.name || res?.message?.name;
      if (reportName) {
        try {
          sessionStorage.removeItem('office-space-calculator-pending-report');
        } catch {
          // ignore
        }
        navigate(`/details-space-analysis/${reportName}`, { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
    setShowUnlockModal(false);
  }

  const roomTypeNames = React.useMemo(() => {
    const rooms = reportDocument?.rooms;
    if (!Array.isArray(rooms)) return [];
    return [...new Set(rooms.map((r) => r?.room_type).filter(Boolean))];
  }, [reportDocument]);

  const { data: roomTypes } = useGetRoomTypesByNamesQuery(roomTypeNames, {
    skip: !reportId || roomTypeNames.length === 0 || isSharedView,
  });

  const roomTypeMap = React.useMemo(() => {
    const map = new Map();
    const source = isSharedView ? sharedRoomTypes : (roomTypes ?? []);
    for (const rt of source) {
      if (!rt?.name) continue;
      map.set(rt.name, rt);
    }
    return map;
  }, [isSharedView, sharedRoomTypes, roomTypes]);

  const { data: specTypes } = useGetAllSpecTypesQuery(undefined, {
    skip: !reportId,
  });

  const { data: specTypesWithRoomTypes } = useGetSpecTypesWithRoomTypesQuery(undefined, {
    skip: !reportId,
  });

  const [updateOfficeSpaceCalculator] = useUpdateOfficeSpaceCalculatorMutation();

  const specTypeDocumentNameByLabel = React.useMemo(() => {
    const map = {};
    for (const s of specTypes ?? []) {
      const label = String(s?.spec_type_name ?? '')
        .trim()
        .toLowerCase();
      const name = String(s?.name ?? '').trim();
      if (!label || !name) continue;
      map[label] = name;
    }
    return map;
  }, [specTypes]);

  const specTypeOptions = React.useMemo(() => {
    const list = (specTypes ?? [])
      .map((s) => String(s?.spec_type_name ?? '').trim())
      .filter(Boolean);
    return list.length > 0 ? list : ['Compact', 'Standard', 'Lavish'];
  }, [specTypes]);

  const roomTypeDocumentNameByLabel = React.useMemo(() => {
    const map = {};
    for (const rt of allRoomTypes ?? []) {
      const documentName = String(rt?.name ?? '').trim();
      const label = String(rt?.room_type_name ?? rt?.name ?? '').trim();
      if (!documentName || !label) continue;
      map[label] = documentName;
    }
    return map;
  }, [allRoomTypes]);

  /** For each room type docname, list of spec type labels that include that room in room_type_areas */
  const specTypeOptionsByRoomType = React.useMemo(() => {
    const out = {};
    const list = Array.isArray(specTypesWithRoomTypes) ? specTypesWithRoomTypes : [];
    for (const st of list) {
      const label = String(st?.spec_type_name ?? st?.name ?? '').trim();
      if (!label) continue;
      const roomTypes = Array.isArray(st?.room_types) ? st.room_types : [];
      for (const rt of roomTypes) {
        const docname = String(rt ?? '').trim();
        if (!docname) continue;
        if (!out[docname]) out[docname] = [];
        if (!out[docname].includes(label)) out[docname].push(label);
      }
    }
    return out;
  }, [specTypesWithRoomTypes]);

  /** Get spec type dropdown options for a row by its room type (label or docname). */
  const getSpecTypeOptionsForRoomType = React.useCallback(
    (roomTypeLabel) => {
      if (!roomTypeLabel) return specTypeOptions;
      const label = String(roomTypeLabel).trim();
      const baseLabel = label.replace(/\s+\d+$/, '');
      const docname =
        roomTypeDocumentNameByLabel[label] ?? roomTypeDocumentNameByLabel[baseLabel] ?? label;
      const options = specTypeOptionsByRoomType[docname];
      return Array.isArray(options) && options.length > 0 ? options : specTypeOptions;
    },
    [specTypeOptions, specTypeOptionsByRoomType, roomTypeDocumentNameByLabel],
  );

  const [persistedCustomRowKeys, setPersistedCustomRowKeys] = React.useState(() => []);

  const persistRoomRowChange = React.useCallback(
    async ({ rowKey, roomTypeLabel, spaceTypeLabel, count }) => {
      if (!reportId || !reportDocument || !Array.isArray(reportDocument.rooms)) return;
      if (!rowKey || typeof rowKey !== 'string') return;

      const roomTypeLabelString = String(roomTypeLabel ?? '').trim();
      const room_type = roomTypeDocumentNameByLabel[roomTypeLabelString] ?? '';
      const specLabelKey = String(spaceTypeLabel ?? '')
        .trim()
        .toLowerCase();
      const spec_per_type = specTypeDocumentNameByLabel[specLabelKey] ?? specLabelKey;
      const countNumber = Number(count ?? 0) || 0;
      const isCustomRow = rowKey.includes(':custom:');

      if (isCustomRow) {
        if (!room_type) return;
        const newRoom = { room_type, spec_per_type, count: countNumber };
        const nextRooms = [...(reportDocument.rooms ?? []), newRoom];
        const roomsPayload = nextRooms.map((r) => ({
          name: r?.name,
          room_type: r?.room_type,
          spec_per_type: r?.spec_per_type,
          count: r?.count,
        }));
        try {
          await updateOfficeSpaceCalculator({
            name: reportId,
            data: { rooms: roomsPayload },
          }).unwrap();
          await refetchReport?.();
          setPersistedCustomRowKeys((previous) =>
            previous.includes(rowKey) ? previous : [...previous, rowKey],
          );
        } catch (error) {
          console.warn('Failed to persist new room', error);
        }
        return;
      }

      if (!rowKey.startsWith('api:')) return;
      const childName = rowKey.slice('api:'.length);
      if (!childName) return;

      const nextRooms = (reportDocument.rooms ?? []).map((r) => {
        if (String(r?.name ?? '') !== childName) return r;
        return {
          ...r,
          room_type: room_type || r.room_type,
          spec_per_type: spec_per_type || r.spec_per_type,
          count: countNumber,
        };
      });

      const roomsPayload = nextRooms.map((r) => ({
        name: r?.name,
        room_type: r?.room_type,
        spec_per_type: r?.spec_per_type,
        count: r?.count,
      }));

      try {
        await updateOfficeSpaceCalculator({
          name: reportId,
          data: { rooms: roomsPayload },
        }).unwrap();
        refetchReport?.();
      } catch (error) {
        console.warn('Failed to persist Office Space Calculator update', error);
      }
    },
    [
      reportId,
      reportDocument,
      roomTypeDocumentNameByLabel,
      specTypeDocumentNameByLabel,
      updateOfficeSpaceCalculator,
      refetchReport,
    ],
  );

  const deleteRoomRow = React.useCallback(
    async (rowKey) => {
      if (!reportId || !reportDocument || !Array.isArray(reportDocument.rooms)) return;
      if (!rowKey || !String(rowKey).startsWith('api:')) return;

      const key = String(rowKey).slice(4).trim();
      if (!key) return;

      let nextRooms;
      if (key.includes(':')) {
        const parts = key.split(':');
        const roomTypeName = parts[0] ?? '';
        const indexString = parts[1] ?? '';
        const specString = parts.slice(2).join(':');
        let removed = false;
        nextRooms = (reportDocument.rooms ?? []).filter((r) => {
          if (removed) return true;
          const matchType = String(r?.room_type ?? '').trim() === String(roomTypeName).trim();
          const matchSpec =
            String(r?.spec_per_type ?? '')
              .trim()
              .toLowerCase() ===
            String(specString ?? '')
              .trim()
              .toLowerCase();
          const matchIndex = !indexString || String(r?.idx ?? '') === indexString;
          if (matchType && matchSpec && matchIndex) {
            removed = true;
            return false;
          }
          return true;
        });
      } else {
        nextRooms = (reportDocument.rooms ?? []).filter(
          (r) => String(r?.name ?? '').trim() !== key,
        );
      }

      const roomsPayload = nextRooms.map((r) => ({
        name: r?.name,
        room_type: r?.room_type,
        spec_per_type: r?.spec_per_type,
        count: r?.count,
      }));

      try {
        await updateOfficeSpaceCalculator({
          name: reportId,
          data: { rooms: roomsPayload },
        }).unwrap();
        refetchReport?.();
      } catch (error) {
        console.warn('Failed to delete room from report', error);
      }
    },
    [reportId, reportDocument, updateOfficeSpaceCalculator, refetchReport],
  );

  /** Area per unit by (spec label, room type docname) from Spec Type.room_type_areas */
  const areasBySpecAndRoom = React.useMemo(() => {
    const out = {};
    const docs = [
      [specTypeCompact, 'Compact'],
      [specTypeStandard, 'Standard'],
      [specTypeLavish, 'Lavish'],
    ];
    for (const [document_, label] of docs) {
      if (!document_?.room_type_areas?.length) continue;
      out[label] = {};
      for (const row of document_.room_type_areas) {
        const rt = String(row?.room_type ?? '').trim();
        if (!rt) continue;
        const v = Number(row?.area_per_unit ?? 0);
        if (Number.isFinite(v)) out[label][rt] = v;
      }
    }
    return out;
  }, [specTypeCompact, specTypeStandard, specTypeLavish]);

  /** Default area per unit per space type (e.g. for new rows); use Workstation when present */
  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- areasBySpecAndRoom is derived from spec types; listing it matches usage
  const areaPerUnitBySpaceType = React.useMemo(() => {
    const map = {};
    const docs = [
      [specTypeCompact, 'Compact'],
      [specTypeStandard, 'Standard'],
      [specTypeLavish, 'Lavish'],
    ];
    for (const [document_, label] of docs) {
      const byRoom = areasBySpecAndRoom[label];
      if (byRoom) {
        map[label] =
          byRoom['Workstation'] ?? byRoom['workstation'] ?? Object.values(byRoom)[0] ?? 0;
      }
    }
    return map;
  }, [areasBySpecAndRoom]);

  const apiBreakdownRows = React.useMemo(() => {
    if (!reportDocument || !Array.isArray(reportDocument.rooms)) return null;

    function toSpecLabel(v) {
      if (!v) return 'Compact';
      const s = String(v).toLowerCase();
      if (s === 'compact') return 'Compact';
      if (s === 'standard') return 'Standard';
      if (s === 'lavish') return 'Lavish';
      // If backend returns Spec Type docname like "Compact", keep as-is
      return String(v);
    }

    function toGroupKey(roomTypeName) {
      const rt = roomTypeMap.get(roomTypeName);
      if (rt?.production) return 'Productivity Area';
      if (rt?.utility_area) return 'Utility and Breakout';
      return 'Circulation Area';
    }

    const groups = new Map();
    for (const r of reportDocument.rooms) {
      const roomTypeName = r?.room_type;
      if (!roomTypeName) continue;

      const groupKey = toGroupKey(roomTypeName);
      const displayName = roomTypeMap.get(roomTypeName)?.room_type_name ?? roomTypeName;
      const count = Number(r?.count ?? 0) || 0;
      const specLabel = toSpecLabel(r?.spec_per_type ?? reportDocument.office_layout_type);
      const areaPerUnit =
        areasBySpecAndRoom[specLabel]?.[roomTypeName] ?? (Number(r?.area_per_unit ?? 0) || 0);
      const total = Number.parseFloat(r?.area ?? '') || count * areaPerUnit;
      const stableRowKey =
        r?.name !== undefined && r?.name !== null && String(r.name).trim()
          ? `api:${String(r.name).trim()}`
          : `api:${roomTypeName}:${String(r?.idx ?? '') || String(count)}:${String(r?.spec_per_type ?? '')}`;
      const order = r?.order == null ? Number(r?.idx ?? 0) + 1 : Number(r.order);

      const row = {
        __rowKey: stableRowKey,
        name: displayName,
        layout: toSpecLabel(r?.spec_per_type ?? reportDocument.office_layout_type),
        count,
        areaPerUnit,
        total,
        order,
      };

      if (!groups.has(groupKey)) groups.set(groupKey, []);
      groups.get(groupKey).push(row);
    }

    function buildGroup(areaGroup) {
      const rawRows = groups.get(areaGroup) ?? [];
      const rows = rawRows.map((row, index) => ({
        ...row,
        order: row.order == null ? index + 1 : Number(row.order),
      }));
      const subtotal = rows.reduce((accumulator, row) => accumulator + (Number(row.total) || 0), 0);
      return { areaGroup, rows, subtotal };
    }

    return [
      buildGroup('Productivity Area'),
      buildGroup('Utility and Breakout'),
      buildGroup('Circulation Area'),
    ];
  }, [reportDocument, roomTypeMap, areasBySpecAndRoom]);

  const apiStats = React.useMemo(() => {
    if (!reportDocument) return null;
    return {
      totalSpaceNeeded: Number(reportDocument.total_space_needed ?? 0) || 0,
      seatingCapacity: Number(reportDocument.seating_capacity ?? 0) || 0,
      spacePerPerson: Number(reportDocument.space_per_person ?? 0) || 0,
      productionArea: Number(reportDocument.production_area ?? 0) || 0,
      utilityArea: Number(reportDocument.utility_breakout ?? 0) || 0,
    };
  }, [reportDocument]);

  const results =
    reportId && apiStats
      ? null
      : calcResults(normalizeForCalc(values), { specType: specTypeDocument });
  const productivity =
    reportId && apiStats
      ? apiStats.productionArea
      : (results?.zonal?.find((z) => z.label === 'Productivity')?.sqft ?? 0);
  const utility =
    reportId && apiStats
      ? apiStats.utilityArea
      : (results?.zonal?.find((z) => z.label === 'Utility')?.sqft ?? 0);
  const spacePerPerson =
    reportId && apiStats ? apiStats.spacePerPerson : (results?.spacePerPerson ?? 0);

  const efficiencyOpportunities = [
    {
      title: 'Reduce Cabin Size',
      body: 'Reduce Manager Cabins from 100 sq ft. to 50 sq ft.(Compact Standard).',
      save: 'Save 300 sq ft.',
      topBorderColor: 'rgba(223, 78, 78, 0.6)',
    },
    {
      title: 'Change the size of Director Cabins',
      body: 'Reduce Manager Cabins from 100 sq ft. to 50 sq ft.(Compact Standard).',
      save: 'Save 300 sq ft.',
      topBorderColor: 'rgba(223, 78, 78, 0.6)',
    },
    {
      title: 'Reduce No. of Meeting Rooms',
      body: '10 meeting rooms will be sufficient for your team. Remove the access rooms',
      save: 'Save 1000 sq ft.',
      topBorderColor: '#eadf89',
    },
  ];
  const breakdownRows =
    apiBreakdownRows ??
    (results
      ? [
        {
          areaGroup: 'Productivity Area',
          rows: [
            {
              name: 'Workstations',
              layout: formatLayoutLabel(layoutType),
              count: results.workstations,
              areaPerUnit: results.spacePerPerson,
              total: results.workstations * results.spacePerPerson,
            },
            {
              name: 'Meeting Rooms',
              layout: formatLayoutLabel(layoutType),
              count: results.meetingRooms,
              areaPerUnit: results?.unitAreas?.meetingRoom ?? 30,
              total: results.meetingRooms * (results?.unitAreas?.meetingRoom ?? 30),
            },
            {
              name: 'Manager Cabins',
              layout: formatLayoutLabel(layoutType),
              count: results.managerCabins,
              areaPerUnit: results?.unitAreas?.directorCabin ?? 40,
              total: results.managerCabins * (results?.unitAreas?.directorCabin ?? 40),
            },
            {
              name: 'Leadership Cabins',
              layout: formatLayoutLabel(layoutType),
              count: results.leadershipCabins,
              areaPerUnit: results?.unitAreas?.leadershipCabin ?? 50,
              total: results.leadershipCabins * (results?.unitAreas?.leadershipCabin ?? 50),
            },
          ],
          subtotal: productivity,
        },
        {
          areaGroup: 'Utility and Breakout',
          rows:
              results?.utilityBreakdown?.length > 0
                ? results.utilityBreakdown.map((row) => ({
                  name: row.label,
                  layout: formatLayoutLabel(layoutType),
                  count: row.count,
                  areaPerUnit: Math.round(row.sqft / Math.max(1, row.count)),
                  total: Math.round(row.sqft),
                }))
                : [
                  {
                    name: 'Utility',
                    layout: formatLayoutLabel(layoutType),
                    count: 1,
                    areaPerUnit: Math.round(utility),
                    total: Math.round(utility),
                  },
                ],
          subtotal: utility,
        },
        {
          areaGroup: 'Circulation Area',
          rows: [
            {
              name: 'Circulation',
              layout: formatLayoutLabel(layoutType),
              count: 1,
              areaPerUnit:
                  results?.zonal?.find((z) => z.label === 'Circulation space')?.sqft ?? 0,
              total: results?.zonal?.find((z) => z.label === 'Circulation space')?.sqft ?? 0,
            },
          ],
          subtotal: results?.zonal?.find((z) => z.label === 'Circulation space')?.sqft ?? 0,
        },
      ]
      : []);

  const totalSpaceNeeded =
    reportId && apiStats ? apiStats.totalSpaceNeeded : (results?.estimatedSpaceNeeded ?? 0);
  const seatingCapacity =
    reportId && apiStats ? apiStats.seatingCapacity : (results?.workstations ?? 0);

  const hasAvailableCarpetArea = React.useMemo(() => {
    if (reportId) {
      const v = reportDocument?.available_carpet_area;
      return v !== undefined && v !== null && Number(v) > 0;
    }
    const v = values?.existingCarpetArea;
    return v !== undefined && v !== null && String(v).trim() !== '' && Number(v) > 0;
  }, [reportId, reportDocument, values]);

  const availableCarpetArea = reportId
    ? reportDocument?.available_carpet_area
    : values?.existingCarpetArea;

  const pdfPayload = React.useMemo(
    () => ({
      title: 'Your Detailed Space Analysis',
      subtitle: 'Optimise your office space with intelligent recommendations',
      totalSpaceNeeded: Number(totalSpaceNeeded) || 0,
      seatingCapacity: Number(seatingCapacity) || 0,
      spacePerPerson: Number(spacePerPerson) || 0,
      productionArea: Number(productivity) || 0,
      utilityArea: Number(utility) || 0,
      hasAvailableCarpetArea: Boolean(hasAvailableCarpetArea),
      availableCarpetArea: Number(availableCarpetArea) || 0,
      breakdownRows: (breakdownRows || []).map((group) => ({
        areaGroup: group.areaGroup,
        rows: (group.rows || []).map((row) => ({
          name: row.name,
          layout: row.layout,
          count: row.count,
          areaPerUnit: row.areaPerUnit,
          total: row.total,
        })),
        subtotal: group.subtotal,
      })),
      efficiencyOpportunities: (efficiencyOpportunities || []).map((o) => ({
        title: o.title,
        body: o.body,
        save: o.save,
        topBorderColor: o.topBorderColor,
      })),
    }),
    [
      totalSpaceNeeded,
      seatingCapacity,
      spacePerPerson,
      productivity,
      utility,
      hasAvailableCarpetArea,
      availableCarpetArea,
      breakdownRows,
      efficiencyOpportunities,
    ],
  );

  const handleDownloadPdf = React.useCallback(async () => {
    const blob = await pdf(<SpaceAnalysisPdfDocument {...pdfPayload} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `space-analysis-report${reportId ? `-${reportId}` : ''}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }, [pdfPayload, reportId]);

  const getPdfBlob = React.useCallback(async () => {
    return pdf(<SpaceAnalysisPdfDocument {...pdfPayload} />).toBlob();
  }, [pdfPayload]);

  const sessionPending = !isSharedView && (!sessionChecked || authLoading);

  if (sessionPending) {
    return (
      <div className='relative flex min-h-screen items-center justify-center bg-white'>
        <div className='text-[16px] font-medium text-[#667085]'>Checking session…</div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-white'>
      <div className={cn(showUnlockModal ? 'opacity-20 pointer-events-none select-none' : '')}>
        <Header
          onDownloadPdf={handleDownloadPdf}
          onGetPdfBlob={getPdfBlob}
          reportId={reportId}
          isSharedView={isSharedView}
        />

        {/* Page content */}
        <div className='mx-auto w-full max-w-[1280px] px-6 pb-16 pt-10'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-[2px] items-start'>
              <div className='flex flex-col items-start'>
                <div className="text-[36px] font-semibold leading-[1.2] tracking-[-1.8px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
                  Your Detailed Space Analysis
                </div>
              </div>
              <div className='flex flex-col items-start justify-center py-1 h-[38px]'>
                <div className="text-[20px] font-medium leading-[1.2] tracking-[-0.8px] text-[#667085] font-['Plus_Jakarta_Sans',sans-serif]">
                  Optimise your office space with intelligent recommendations
                </div>
              </div>
            </div>

            {/* Top stats */}
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {reportId && isReportLoading ? (
                <div className='col-span-full text-[14px] text-[#667085]'>Loading report…</div>
              ) : reportId && isReportError ? (
                <div className='col-span-full text-[14px] text-[#667085]'>
                  Could not load this report.
                </div>
              ) : null}
              <StatCard
                title='Total Space Needed'
                value={(totalSpaceNeeded ?? 0).toLocaleString()}
                unit='sqft.'
                gradient='linear-gradient(109deg, rgba(227, 235, 253, 0.00) -28.7%, #E3EBFD 216.83%)'
                iconWrapperClassName='bg-[#3c4fb7]'
                icon={<RiBuildingLine className='h-4 w-4 text-white' aria-hidden='true' />}
              />
              <StatCard
                title='Seating Capacity'
                value={(seatingCapacity ?? 0).toLocaleString()}
                unit='sqft.'
                gradient='linear-gradient(107deg, rgba(254, 239, 223, 0.00) -36.03%, #FEEFDF 100.13%)'
                iconWrapperClassName='bg-[#ec670b] border-[0.667px] border-white'
                icon={<img src={chairIcon} alt='' aria-hidden='true' className='h-4 w-4' />}
                meta={
                  <>
                    <span className="text-[12px] font-medium leading-[20px] text-[#d92d20] font-['Plus_Jakarta_Sans',sans-serif]">
                      {formatCompact(spacePerPerson)} sq ft.
                    </span>
                    <span className="text-[12px] font-medium leading-[20px] text-[#475467] font-['Plus_Jakarta_Sans',sans-serif]">
                      space per person
                    </span>
                  </>
                }
              />
              {hasAvailableCarpetArea ? null : (
                <>
                  <StatCard
                    title='Production Area'
                    value={productivity.toLocaleString()}
                    unit='sqft.'
                    gradient='linear-gradient(107deg, rgba(228, 247, 243, 0.00) -40.8%, #E4F7F3 100%)'
                    iconWrapperClassName='bg-[#10a684] border-[0.667px] border-white'
                    icon={<LuMonitorSpeaker className='h-4 w-4 text-white' aria-hidden='true' />}
                  />
                  <StatCard
                    title='Utility and Breakout'
                    value={utility.toLocaleString()}
                    unit='sqft.'
                    gradient='linear-gradient(107deg, rgba(247, 241, 255, 0.00) -51.92%, #F7F1FF 100%)'
                    iconWrapperClassName='bg-[#7f56d9]'
                    icon={<Coffee className='h-4 w-4 text-white' aria-hidden='true' />}
                  />
                </>
              )}
              {hasAvailableCarpetArea ? (
                <SpaceUtilizationCard
                  totalSpaceNeeded={totalSpaceNeeded}
                  availableCarpetArea={availableCarpetArea}
                />
              ) : null}
            </div>

            {/* Breakdown + opportunities */}
            <div className='grid gap-4 lg:grid-cols-[1fr_360px]'>
              <DetailedSpaceBreakdownTable
                breakdownRows={breakdownRows}
                roomTypes={allRoomTypes}
                grandTotalSqft={Number(totalSpaceNeeded) || 0}
                efficiencyOpportunitiesCount={efficiencyOpportunities.length}
                areaPerUnitBySpaceType={areaPerUnitBySpaceType}
                specTypeOptions={specTypeOptions}
                getSpecTypeOptionsForRoomType={getSpecTypeOptionsForRoomType}
                onPersistRowChange={persistRoomRowChange}
                onDeleteRoomRow={deleteRoomRow}
                persistedCustomRowKeys={persistedCustomRowKeys}
                readOnly={isSharedView}
              />

              <Card className='overflow-hidden rounded-[10.66px] border-[0.888px] border-[#eaecf0] bg-[#fafbfc] shadow-[0px_0.888px_1.777px_rgba(16,24,40,0.05)]'>
                {/* Header */}
                <div className='flex items-center gap-[10.66px] border-b-[0.888px] border-[#eaecf0] bg-[#fafbfc] px-[21.32px] py-[14.213px]'>
                  <div className='flex h-[42.64px] w-[42.64px] items-center justify-center rounded-full border border-[#f6d67a] bg-[#fff4d6]'>
                    <Lightbulb className='h-5 w-5 text-[#f97316]' aria-hidden='true' />
                  </div>
                  <div className="flex-1 text-[15.99px] font-semibold leading-[21.32px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
                    Efficiency Opportunities
                  </div>
                </div>

                {/* Cards */}
                <div className='flex flex-col gap-[21.32px] px-[21.32px] py-[9.772px]'>
                  {efficiencyOpportunities.map((item) => (
                    <div
                      key={item.title}
                      className='rounded-b-[10.66px] border-t-[4.442px]'
                      style={{ borderTopColor: item.topBorderColor }}
                    >
                      <Card className='overflow-hidden rounded-b-[10.66px] border border-[#eaecf0] bg-white shadow-[0px_0.888px_1.777px_rgba(16,24,40,0.05)]'>
                        <div className='flex flex-col gap-[14.213px] p-[21.32px]'>
                          <div className='flex items-start gap-[23.985px]'>
                            <div className='flex-1'>
                              <div className="text-[14px] font-semibold leading-[21.32px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]">
                                {item.title}
                              </div>
                            </div>
                            <div className='flex items-center gap-[3.553px] rounded-[6px] border border-[#e2e4e9] bg-white px-[7.107px] py-[3.553px] pl-[3.553px]'>
                              <CheckCircle2
                                className='h-[21.32px] w-[21.32px] text-[#12b76a]'
                                aria-hidden='true'
                              />
                              <span className="text-[10.66px] font-medium leading-[14.213px] text-[#525866] font-['Plus_Jakarta_Sans',sans-serif]">
                                {item.save}
                              </span>
                            </div>
                          </div>
                          <div className="text-[14px] font-normal leading-[17.766px] text-[#475467] font-['Plus_Jakarta_Sans',sans-serif]">
                            {item.body}
                          </div>
                        </div>

                        <div className='border-t border-[#eaecf0]' />
                        <div className='flex items-center justify-center py-[14.213px]'>
                          <button
                            type='button'
                            className="text-[14px] font-semibold leading-[17.766px] text-[#2563eb] font-['Plus_Jakarta_Sans',sans-serif]"
                          >
                            Apply Suggestion
                          </button>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Apply all */}
                <button
                  type='button'
                  className="w-full border-t-[0.888px] border-[#d0d5dd] bg-white py-4 text-center text-[15.99px] font-semibold leading-[43.528px] text-[#101828] font-['Plus_Jakarta_Sans',sans-serif]"
                >
                  Apply All
                </button>
              </Card>
            </div>
          </div>
        </div>
        {/* BOQ banner */}
        <div className='bg-[#071a2f]'>
          <div className='mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-6 py-6'>
            <div>
              <div className="text-[18px] font-semibold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Want to explore BOQ?
              </div>
              <div className="text-[12px] font-medium text-white/70 font-['Plus_Jakarta_Sans',sans-serif]">
                Check out our AI BOQ Estimator and make your plan full proof!
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                type='button'
                variant='outline'
                className='h-10 rounded-[8px] border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
              >
                Dismiss
              </Button>
              <Button type='button' variant='gradient' className='h-10 rounded-[8px] px-4'>
                Checkout BOQ Estimator
              </Button>
            </div>
          </div>
        </div>

        {/* Illustration + footer */}
        <section className='py-0 bg-white border-t border-neutral-200'>
          <div className='container mx-auto px-6'>
            <div className='py-8'>
              <img
                src={illustration}
                alt='Office workspace illustration'
                loading='lazy'
                className='w-full h-auto'
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <UnlockResultsModal
        open={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onUnlock={handleUnlock}
      />
    </div>
  );
}
