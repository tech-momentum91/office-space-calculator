import { z } from 'zod';

export const calculatorDefaultValues = {
  workstationsRequired: '',
  existingCarpetArea: '',
  meetingRooms: 1,
  leadershipCabins: 1,
  managerCabins: 5,
  layoutType: 'compact',
};

export const calculatorSchema = z.object({
  workstationsRequired: z.preprocess(
    (value) => (typeof value === 'string' ? Number(value) : value),
    z
      .number({ invalid_type_error: 'Workstations Required is required' })
      .min(1, 'Workstations Required is required'),
  ),
  existingCarpetArea: z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) return undefined;
      if (typeof value === 'string') return Number(value);
      return value;
    },
    z
      .number({ invalid_type_error: 'Existing Carpet Area must be a number' })
      .nonnegative('Existing Carpet Area must be 0 or more')
      .optional(),
  ),
  meetingRooms: z.number().min(0).max(20),
  leadershipCabins: z.number().min(0).max(20),
  managerCabins: z.number().min(0).max(20),
  layoutType: z.enum(['compact', 'standard', 'lavish']),
});

export function zodIssuesToFieldErrors(error) {
  const fieldErrors = {};
  for (const issue of error?.issues ?? []) {
    const key = issue?.path?.[0];
    if (!key || fieldErrors[key]) continue;
    fieldErrors[key] = { message: issue.message };
  }
  return fieldErrors;
}
