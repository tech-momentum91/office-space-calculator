import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Auth slice - manages authentication state
 *
 * Note: We import authApi dynamically in thunks to avoid circular dependency
 */
const initialState = {
  user: null, // { full_name, email, user_image }
  isAuthenticated: false,
  loading: false,
  sessionChecked: false,
  sessionApiError: false,
  userPermissions: null, // Sidebar permissions data
  error: null,
  emailSent: {
    isLoading: false,
    error: null,
    status: null,
  },
};

/**
 * Async thunk to check session and fetch user data
 * For office-space-calculator, we only verify session using getSession
 */
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Import authApi dynamically to avoid circular dependency
      const { authApi } = await import('../api/authApi');

      // Check session using getSession (frappe.auth.get_logged_user)
      const sessionResult = await dispatch(authApi.endpoints.getSession.initiate()).unwrap();

      if (!sessionResult.isAuthenticated || !sessionResult.email) {
        return rejectWithValue('No valid session');
      }

      // Fetch user data
      const userData = await dispatch(
        authApi.endpoints.getUserByEmail.initiate(sessionResult.email),
      ).unwrap();

      // Note: getUserPermissions is not called here as it's not part of office-space-calculator
      // Permissions API will be implemented later when needed

      return {
        user: userData,
        permissions: null, // Set to null for now, will be implemented later
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Session check failed');
    }
  },
);

/**
 * Async thunk to handle login
 * For office-space-calculator, we only verify session using getSession
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      // Import authApi dynamically to avoid circular dependency
      const { authApi } = await import('../api/authApi');

      // Perform login
      await dispatch(authApi.endpoints.login.initiate({ email, password })).unwrap();

      // Verify session using getSession (frappe.auth.get_logged_user)
      const sessionResult = await dispatch(authApi.endpoints.getSession.initiate()).unwrap();

      if (!sessionResult.isAuthenticated || !sessionResult.email) {
        return rejectWithValue('Login failed. Please try again.');
      }

      // Fetch user data
      const userData = await dispatch(
        authApi.endpoints.getUserByEmail.initiate(sessionResult.email),
      ).unwrap();

      // Note: getUserPermissions is not called here as it's not part of office-space-calculator
      // Permissions API will be implemented later when needed

      return {
        user: userData,
        permissions: null, // Set to null for now, will be implemented later
      };
    } catch (error) {
      // Extract error message from RTK Query error
      const errorMessage =
        error?.data?.message ||
        error?.data?.exc ||
        error?.message ||
        'Invalid credentials. Please try again.';

      return rejectWithValue(errorMessage);
    }
  },
);

/**
 * Async thunk to request password reset email
 * Calls Frappe reset_password API
 */
export const resetPasswordMail = createAsyncThunk(
  'auth/resetPasswordMail',
  async (email, { dispatch, rejectWithValue }) => {
    try {
      const { authApi } = await import('../api/authApi');
      await dispatch(authApi.endpoints.resetPassword.initiate(email)).unwrap();
      return { email };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

/**
 * Async thunk to handle logout
 */
export const logoutAsync = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    // Import authApi dynamically to avoid circular dependency
    const { authApi } = await import('../api/authApi');

    // Call logout endpoint
    await dispatch(authApi.endpoints.logout.initiate()).unwrap();
  } catch (error) {
    // Even if logout fails, clear local state
    console.error('Logout error:', error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.userPermissions = action.payload.permissions;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.sessionChecked = true;
      state.sessionApiError = false;

      // Persist user data to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('email', action.payload.user.email);
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.sessionChecked = false;
      state.sessionApiError = false;
      state.userPermissions = null;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('user_perm_sidebar');
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
      // Persist permissions to localStorage
      localStorage.setItem('user_perm_sidebar', JSON.stringify(action.payload));
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload?.message ?? null;
    },
    clearEmailSentError: (state) => {
      state.emailSent.error = null;
    },
    setSessionChecked: (state, action) => {
      state.sessionChecked = action.payload;
    },
    setSessionApiError: (state, action) => {
      state.sessionApiError = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login async thunk
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userPermissions = action.payload.permissions || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.sessionChecked = true;
        state.sessionApiError = false;

        // Persist to localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('email', action.payload.user.email);
        if (action.payload.permissions) {
          localStorage.setItem('user_perm_sidebar', JSON.stringify(action.payload.permissions));
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Logout async thunk
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.sessionChecked = false;
      state.sessionApiError = false;
      state.userPermissions = null;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('user_perm_sidebar');
    });

    // Check session async thunk
    builder
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.sessionApiError = false;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userPermissions = action.payload.permissions || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.sessionChecked = true;
        state.sessionApiError = false;

        // Persist to localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('email', action.payload.user.email);
        if (action.payload.permissions) {
          localStorage.setItem('user_perm_sidebar', JSON.stringify(action.payload.permissions));
        }
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.sessionChecked = true;
        state.sessionApiError = true;
        state.isAuthenticated = false;

        // Try to sync from localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            state.user = JSON.parse(storedUser);
            // Don't set isAuthenticated true - session is not valid
          } catch {
            localStorage.removeItem('user');
            localStorage.removeItem('email');
          }
        }
      });

    // Reset password email
    builder
      .addCase(resetPasswordMail.pending, (state) => {
        state.emailSent.isLoading = true;
        state.emailSent.error = null;
      })
      .addCase(resetPasswordMail.fulfilled, (state) => {
        state.emailSent.isLoading = false;
        state.emailSent.error = null;
        state.emailSent.status = 'success';
      })
      .addCase(resetPasswordMail.rejected, (state, action) => {
        state.emailSent.isLoading = false;
        state.emailSent.error =
          action.payload?.data?.message || action.payload?.message || 'Failed to send reset email';
        state.emailSent.status = action.payload?.status;
      });
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  setUserPermissions,
  clearError,
  setError,
  clearEmailSentError,
  setSessionChecked,
  setSessionApiError,
} = authSlice.actions;

export default authSlice.reducer;
