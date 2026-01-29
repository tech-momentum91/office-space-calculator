import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  values: {
    workstationsRequired: '',
    existingCarpetArea: '',
    meetingRooms: 20,
    leadershipCabins: 1,
    managerCabins: 5,
    layoutType: 'compact',
  },
  showSummary: false,
  errors: {},
};

const officeCalculatorSlice = createSlice({
  name: 'officeCalculator',
  initialState,
  reducers: {
    setField: (state, action) => {
      const { name, value } = action.payload || {};
      if (!name) return;
      state.values[name] = value;
      if (state.errors?.[name]) delete state.errors[name];
    },
    setFields: (state, action) => {
      const next = action.payload || {};
      for (const [k, v] of Object.entries(next)) {
        state.values[k] = v;
        if (state.errors?.[k]) delete state.errors[k];
      }
    },
    setShowSummary: (state, action) => {
      state.showSummary = Boolean(action.payload);
    },
    setErrors: (state, action) => {
      state.errors = action.payload || {};
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    resetCalculator: () => initialState,
  },
});

export const { setField, setFields, setShowSummary, setErrors, clearErrors, resetCalculator } =
  officeCalculatorSlice.actions;

export const selectOfficeCalculator = (state) => state.officeCalculator;
export const selectOfficeCalculatorValues = (state) => state.officeCalculator.values;
export const selectOfficeCalculatorErrors = (state) => state.officeCalculator.errors;
export const selectOfficeCalculatorShowSummary = (state) => state.officeCalculator.showSummary;

export default officeCalculatorSlice.reducer;
