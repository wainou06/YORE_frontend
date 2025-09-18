import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '@/api/authApi'

const initialState = {
   user: null,
   isAuthenticated: false,
   userType: null, // 'user' | 'agency' | 'admin'
   loading: false,
   error: null,
   token: null,
   userPlans: [],
}

// User Auth Thunks
export const login = createAsyncThunk('auth/login', async ({ email, password, userType }, { rejectWithValue }) => {
   try {
      const response = await authAPI.login(email, password, userType)
      const { token, user } = response.data
      return { user, userType, token }
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그인 실패')
   }
})

// user를 직접 세팅하는 액션
export const setUser = (user) => (dispatch) => {
   dispatch(authSlice.actions.setUser(user))
}

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
   try {
      const response = await authAPI.register(userData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '회원가입 실패')
   }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
   try {
      await authAPI.logout()
      localStorage.removeItem('token')
      return null
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그아웃 실패')
   }
})

// Profile Thunks
export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
   try {
      const response = await authAPI.getProfile()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '프로필 조회 실패')
   }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
   try {
      const response = await authAPI.updateProfile(profileData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '프로필 수정 실패')
   }
})

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, { rejectWithValue }) => {
   try {
      const response = await authAPI.changePassword(passwordData)
      if (!response.data.success) {
         return rejectWithValue({ message: response.data.message || '비밀번호 변경 실패' })
      }
      return response.data
   } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || '비밀번호 변경 실패' })
   }
})

export const changeBirth = createAsyncThunk('auth/changeBirth', async ({ birth }, { rejectWithValue }) => {
   try {
      const response = await authAPI.changeBirth({ birth })
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '생일 변경 실패')
   }
})

export const updateAgencyProfile = createAsyncThunk('auth/updateAgencyProfile', async ({ agencyName, businessNumber }, { rejectWithValue }) => {
   try {
      const response = await authAPI.updateAgencyProfile({ agencyName, businessNumber })
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '기업 정보 수정 실패')
   }
})

export const getMyUserPlans = createAsyncThunk('auth/getMyUserPlans', async (_, { rejectWithValue }) => {
   try {
      const response = await authAPI.getMyUserPlans()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 조회 실패')
   }
})

export const updateUserPlanStatus = createAsyncThunk('auth/updateUserPlanStatus', async ({ id, status }, { rejectWithValue }) => {
   try {
      const response = await authAPI.updateUserPlanStatus(id, status)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '상태 변경 실패')
   }
})

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      clearError: (state) => {
         state.error = null
      },
      resetAuthState: () => initialState,
      setUser: (state, action) => {
         state.user = action.payload
         state.isAuthenticated = true
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(login.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
            state.userType = action.payload.userType
            state.error = null
            state.token = action.payload.token
            localStorage.setItem('token', action.payload.token)
         })
         .addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(register.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(register.fulfilled, (state) => {
            state.loading = false
            state.error = null
         })
         .addCase(register.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(logout.pending, (state) => {
            state.loading = true
         })
         .addCase(logout.fulfilled, () => initialState)
         .addCase(logout.rejected, (state, action) => {
            return initialState
         })

         .addCase(getProfile.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getProfile.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.user
            state.isAuthenticated = true
            state.error = null
         })
         .addCase(getProfile.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.isAuthenticated = false
         })

         .addCase(updateProfile.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false
            state.user = { ...state.user, ...action.payload.user }
            state.error = null
         })
         .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(changePassword.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(changePassword.fulfilled, (state) => {
            state.loading = false
            state.error = null
         })
         .addCase(changePassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(changeBirth.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(changeBirth.fulfilled, (state, action) => {
            state.loading = false
            state.user = { ...state.user, birth: action.payload.user.birth }
            state.error = null
         })
         .addCase(changeBirth.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(updateAgencyProfile.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateAgencyProfile.fulfilled, (state, action) => {
            state.loading = false
            if (state.user?.agency) {
               state.user.agency = action.payload.agency
            }
            state.error = null
         })
         .addCase(updateAgencyProfile.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(getMyUserPlans.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getMyUserPlans.fulfilled, (state, action) => {
            state.loading = false
            state.userPlans = action.payload.data
         })
         .addCase(getMyUserPlans.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(updateUserPlanStatus.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateUserPlanStatus.fulfilled, (state, action) => {
            state.loading = false
            const updatedPlan = action.payload.userPlan
            state.userPlans = state.userPlans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
         })
         .addCase(updateUserPlanStatus.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearError, resetAuthState, setToken } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUserType = (state) => state.auth.userType
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectToken = (state) => state.auth.token
export const selectUserPlans = (state) => state.auth.userPlans

export default authSlice.reducer
