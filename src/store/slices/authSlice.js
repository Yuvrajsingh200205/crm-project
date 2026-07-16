import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('accessToken') || null,
  roleId: localStorage.getItem('userRole') || null,
  userProfile: (() => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  isLoggedIn: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, roleId, userProfile } = action.payload;
      state.token = token;
      state.roleId = roleId;
      state.userProfile = userProfile;
      state.isLoggedIn = true;
      
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userRole', roleId);
      if (userProfile) {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
    },
    logout: (state) => {
      state.token = null;
      state.roleId = null;
      state.userProfile = null;
      state.isLoggedIn = false;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userProfile');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
