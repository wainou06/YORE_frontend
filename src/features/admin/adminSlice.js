import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { adminAPI } from '@services/api'

// Admin Auth Thunks
export const loginAdmin = createAsyncThunk('admin/loginAdmin', async (credentials, { rejectWithValue }) => {
   try {
      const response = await adminAPI.loginAdmin(credentials)
      if (response.data.success) {
         const { admin, token } = response.data
         // token을 Footer에서 사용하도록 함께 반환
         return { admin, token }
      } else {
         throw new Error('로그인 응답이 올바르지 않습니다')
      }
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || '관리자 로그인 실패')
   }
})

export const registerAdmin = createAsyncThunk('admin/registerAdmin', async (adminData, { rejectWithValue }) => {
   try {
      const response = await adminAPI.registerAdmin(adminData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '관리자 등록 실패')
   }
})

// User Management Thunks
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (params, { rejectWithValue }) => {
   try {
      const response = await adminAPI.getUsers(params)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '사용자 목록 조회 실패')
   }
})

export const fetchUser = createAsyncThunk('admin/fetchUser', async (id, { rejectWithValue }) => {
   try {
      const response = await adminAPI.getUser(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '사용자 정보 조회 실패')
   }
})

export const updateUserStatus = createAsyncThunk('admin/updateUserStatus', async ({ id, status }, { rejectWithValue }) => {
   try {
      const response = await adminAPI.updateUserStatus(id, status)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '사용자 상태 업데이트 실패')
   }
})

export const updateUserRole = createAsyncThunk('admin/updateUserRole', async ({ id, role }, { rejectWithValue }) => {
   try {
      const response = await adminAPI.updateUserRole(id, role)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '사용자 권한 업데이트 실패')
   }
})

// Statistics and Logs
export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
   try {
      const response = await adminAPI.getAdminStats()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '통계 조회 실패')
   }
})

export const exportLogs = createAsyncThunk('admin/exportLogs', async (_, { rejectWithValue }) => {
   try {
      const response = await adminAPI.exportLogs()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그 내보내기 실패')
   }
})

export const adminSlice = createSlice({
   name: 'admin',
   initialState: {
      admin: null,
      isAuthenticated: false,
      users: [],
      selectedUser: null,
      stats: null,
      loading: false,
      error: null,
   },
   reducers: {
      clearError: (state) => {
         state.error = null
      },
      resetAdminState: () => initialState,
   },
   extraReducers: (builder) => {
      builder
         // Admin Auth
         .addCase(loginAdmin.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(loginAdmin.fulfilled, (state, action) => {
            state.loading = false
            state.admin = action.payload.admin
            state.isAuthenticated = true
         })
         .addCase(loginAdmin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(registerAdmin.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(registerAdmin.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(registerAdmin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // User Management
         .addCase(fetchUsers.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false
            state.users = action.payload.users
         })
         .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(fetchUser.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false
            state.selectedUser = action.payload.user
         })
         .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(updateUserStatus.fulfilled, (state, action) => {
            state.users = state.users.map((user) => (user.id === action.payload.user.id ? action.payload.user : user))
            if (state.selectedUser?.id === action.payload.user.id) {
               state.selectedUser = action.payload.user
            }
         })

         .addCase(updateUserRole.fulfilled, (state, action) => {
            state.users = state.users.map((user) => (user.id === action.payload.user.id ? action.payload.user : user))
            if (state.selectedUser?.id === action.payload.user.id) {
               state.selectedUser = action.payload.user
            }
         })

         // Statistics and Logs
         .addCase(fetchAdminStats.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchAdminStats.fulfilled, (state, action) => {
            state.loading = false
            state.stats = action.payload
         })
         .addCase(fetchAdminStats.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(exportLogs.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(exportLogs.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(exportLogs.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearError, resetAdminState } = adminSlice.actions

// Selectors
export const selectAdmin = (state) => state.admin.admin
export const selectIsAdminAuthenticated = (state) => state.admin.isAuthenticated
export const selectUsers = (state) => state.admin.users
export const selectSelectedUser = (state) => state.admin.selectedUser
export const selectAdminStats = (state) => state.admin.stats
export const selectAdminLoading = (state) => state.admin.loading
export const selectAdminError = (state) => state.admin.error

export default adminSlice.reducer
