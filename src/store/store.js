import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import officeCalculatorReducer from './slices/officeCalculatorSlice';

/**
 * Redux store configuration
 * Includes RTK Query API slice and custom reducers
 */
export const store = configureStore({
  reducer: {
    // Add the RTK Query API reducer
    [baseApi.reducerPath]: baseApi.reducer,
    // Feature reducers
    auth: authReducer,
    ui: uiReducer,
    officeCalculator: officeCalculatorReducer,
  },
  // Add RTK Query middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
    baseApi.middleware,
  ],
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export const selectAuth = (state) => state.auth;
export const selectUI = (state) => state.ui;
export const selectOfficeCalculator = (state) => state.officeCalculator;
