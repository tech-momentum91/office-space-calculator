import { createSlice } from '@reduxjs/toolkit';

/**
 * UI slice for global UI state
 * Manages loading states, modals, toasts, etc.
 */
const initialState = {
  // Loading states
  globalLoading: false,
  // Modal states
  activeModal: null,
  modalData: null,
  // Sidebar state (if needed in future)
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setGlobalLoading, openModal, closeModal, toggleSidebar, setSidebarOpen } =
  uiSlice.actions;

export default uiSlice.reducer;
