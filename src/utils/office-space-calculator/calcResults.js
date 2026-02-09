function roundToNearest10(number_) {
  return Math.round(number_ / 10) * 10;
}

export function normalizeForCalc(values) {
  const workstationsRequired =
    values?.workstationsRequired === '' || values?.workstationsRequired === undefined
      ? 0
      : Number(values.workstationsRequired);
  const existingCarpetArea =
    values?.existingCarpetArea === '' || values?.existingCarpetArea === undefined
      ? undefined
      : Number(values.existingCarpetArea);

  return {
    workstationsRequired: Number.isFinite(workstationsRequired) ? workstationsRequired : 0,
    existingCarpetArea: Number.isFinite(existingCarpetArea) ? existingCarpetArea : undefined,
    meetingRooms: Number(values?.meetingRooms ?? 0) || 0,
    leadershipCabins: Number(values?.leadershipCabins ?? 0) || 0,
    managerCabins: Number(values?.managerCabins ?? 0) || 0,
    layoutType: values?.layoutType ?? 'compact',
  };
}

function toAreaKeyFromRoomType(roomType) {
  const s = String(roomType ?? '')
    .trim()
    .toLowerCase()
    .replaceAll(/[^\da-z]/g, '');

  if (!s) return null;
  if (s === 'workstation' || s === 'workstations') return 'workstation';
  if (s === 'meetingroom' || s === 'meetingrooms') return 'meetingRoom';
  if (s === 'leadershipcabin' || s === 'leadershipcabins') return 'leadershipCabin';
  if (
    s === 'directorcabin' ||
    s === 'directorcabins' ||
    s === 'managercabin' ||
    s === 'managercabins'
  )
    return 'directorCabin';
  if (s === 'reception' || s === 'receptions') return 'reception';
  if (s === 'serverroom' || s === 'serverrooms') return 'serverRoom';
  if (s === 'cafeteria' || s === 'cafeterias') return 'cafeteria';

  return null;
}

function deriveUnitAreasFromSpecType(specTypeDoc, fallbackUnitAreas) {
  const rows = specTypeDoc?.room_type_areas;
  if (!Array.isArray(rows) || rows.length === 0) return null;

  // Start from fallback so missing fields don't break formulas.
  const next = { ...fallbackUnitAreas };

  for (const r of rows) {
    const key = toAreaKeyFromRoomType(r?.room_type);
    if (!key) continue;

    const v = Number(r?.area_per_unit ?? 0);
    if (Number.isFinite(v) && v > 0) next[key] = v;
  }

  return next;
}

export function calcResults(data, options = {}) {
  const workstations = Number(data?.workstationsRequired ?? 0) || 0;
  const meetingRooms = Number(data?.meetingRooms ?? 0) || 0;
  const leadershipCabins = Number(data?.leadershipCabins ?? 0) || 0;
  const managerCabins = Number(data?.managerCabins ?? 0) || 0;
  const existing =
    data?.existingCarpetArea === undefined ? undefined : Number(data.existingCarpetArea) || 0;

  const layoutType = data?.layoutType ?? 'compact';

  const unitAreasByLayout = {
    compact: {
      workstation: 70,
      // Per-layout unit area values
      meetingRoom: 30,
      leadershipCabin: 50,
      directorCabin: 40,
      reception: 36,
      serverRoom: 38,
      cafeteria: 36,
    },
    standard: {
      workstation: 77,
      meetingRoom: 36,
      leadershipCabin: 50,
      directorCabin: 40,
      reception: 36,
      serverRoom: 38,
      cafeteria: 36,
    },
    lavish: {
      workstation: 90,
      meetingRoom: 40,
      leadershipCabin: 50,
      directorCabin: 40,
      reception: 36,
      serverRoom: 38,
      cafeteria: 36,
    },
  };

  const fallbackUnitAreas = unitAreasByLayout[layoutType] ?? unitAreasByLayout.compact;
  const unitAreas =
    deriveUnitAreasFromSpecType(options?.specType, fallbackUnitAreas) ?? fallbackUnitAreas;

  // Productivity area formula (as requested):
  // (layout type * workstations) + (layout type * meeting rooms) + (layout type * leadership cabins) + (layout type * director cabins)
  const productivitySqft = Math.round(
    workstations * unitAreas.workstation +
      meetingRooms * unitAreas.meetingRoom +
      leadershipCabins * unitAreas.leadershipCabin +
      managerCabins * unitAreas.directorCabin,
  );

  // Utility formula (as requested):
  // utility = (layouttype*receptions) + (layout type*server rooms) + (layout type*cafeteria)
  // Defaulting to 1 each as provided.
  const receptions = 1;
  const serverRooms = 1;
  const cafeterias = 1;

  const utilityBreakdown = [
    {
      label: 'Reception',
      count: receptions,
      sqft: Math.round(receptions * unitAreas.reception),
    },
    {
      label: 'Server Room',
      count: serverRooms,
      sqft: Math.round(serverRooms * unitAreas.serverRoom),
    },
    {
      label: 'Cafeteria',
      count: cafeterias,
      sqft: Math.round(cafeterias * unitAreas.cafeteria),
    },
  ];

  const utilitySqft = utilityBreakdown.reduce((sum, row) => sum + row.sqft, 0);

  // Requirement: Circulation area (15%) = 15% of (Productivity area + Utility area)
  const circulationSqft = Math.round(((productivitySqft + utilitySqft) * 15) / 100);

  const estimatedSpaceNeeded = roundToNearest10(productivitySqft + utilitySqft + circulationSqft);
  const delta =
    existing === undefined ? undefined : roundToNearest10(estimatedSpaceNeeded - existing);

  const seatingSqft = Math.round(workstations * 57.5);
  // spacePerPerson = estimatedSpaceNeeded / seatingSqft (fallback to unit area when no seating)
  const spacePerPerson =
    seatingSqft > 0 ? estimatedSpaceNeeded / seatingSqft : unitAreas.workstation;

  const totalForPct = estimatedSpaceNeeded || 1;
  const productivityPct = Math.round((productivitySqft / totalForPct) * 100);
  const utilityPct = Math.round((utilitySqft / totalForPct) * 100);
  const circulationPct = Math.max(0, 100 - productivityPct - utilityPct);

  const zonal = [
    { label: 'Productivity', pct: productivityPct, sqft: productivitySqft },
    { label: 'Utility', pct: utilityPct, sqft: utilitySqft },
    { label: 'Circulation space', pct: circulationPct, sqft: circulationSqft },
  ];

  const collaboration = [
    {
      label: 'Meeting Room',
      count: meetingRooms,
      unitArea: unitAreas.meetingRoom,
      sqft: Math.round(meetingRooms * unitAreas.meetingRoom),
    },
    {
      label: 'Manager Cabin',
      count: managerCabins,
      unitArea: unitAreas.directorCabin,
      sqft: Math.round(managerCabins * unitAreas.directorCabin),
    },
    {
      label: 'Director Cabin',
      count: leadershipCabins,
      unitArea: unitAreas.leadershipCabin,
      sqft: Math.round(leadershipCabins * unitAreas.leadershipCabin),
    },
  ];

  return {
    workstations,
    meetingRooms,
    leadershipCabins,
    managerCabins,
    existing,
    spacePerPerson,
    unitAreas,
    seatingSqft,
    estimatedSpaceNeeded,
    delta,
    zonal,
    collaboration,
    utilityBreakdown,
  };
}
