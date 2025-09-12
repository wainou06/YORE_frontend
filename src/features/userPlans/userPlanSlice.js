import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userPlansAPI } from '@/api/userPlansApi'

const initialState = {
   items: [], // 사용자의 요금제 목록
   selectedPlan: null, // 선택된 요금제 상세 정보
   loading: false,
   error: null,
   pagination: {
      total: 0,
      currentPage: 1,
      totalPages: 1,
      limit: 10,
   },
   filters: {
      status: 'active', // active, cancelled, expired
      page: 1,
      limit: 10,
   },
}

// Async Thunks
export const createUserPlan = createAsyncThunk('userPlans/createUserPlan', async (planData, { rejectWithValue }) => {
   try {
      const response = await userPlansAPI.createUserPlan(planData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 가입에 실패했습니다.')
   }
})

export const fetchUserPlans = createAsyncThunk('userPlans/fetchUserPlans', async (_, { getState, rejectWithValue }) => {
   try {
      const { filters } = getState().userPlans
      const response = await userPlansAPI.getUserPlans(filters)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '가입한 요금제 목록을 불러오는데 실패했습니다.')
   }
})

export const fetchUserPlan = createAsyncThunk('userPlans/fetchUserPlan', async (id, { rejectWithValue }) => {
   try {
      const response = await userPlansAPI.getUserPlan(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 정보를 불러오는데 실패했습니다.')
   }
})

export const cancelUserPlan = createAsyncThunk('userPlans/cancelUserPlan', async ({ id, reason }, { rejectWithValue }) => {
   try {
      const response = await userPlansAPI.cancelUserPlan(id, { reason })
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 해지에 실패했습니다.')
   }
})

const userPlanSlice = createSlice({
   name: 'userPlans',
   initialState,
   reducers: {
      clearSelectedPlan: (state) => {
         state.selectedPlan = null
      },
      clearError: (state) => {
         state.error = null
      },
      setFilters: (state, action) => {
         state.filters = { ...state.filters, ...action.payload }
         if (action.payload.page === undefined) {
            state.filters.page = 1 // 필터 변경 시 페이지 초기화
         }
      },
   },
   extraReducers: (builder) => {
      builder
         // createUserPlan
         .addCase(createUserPlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createUserPlan.fulfilled, (state, action) => {
            state.loading = false
            state.items.unshift(action.payload.data)
            state.selectedPlan = action.payload.data
         })
         .addCase(createUserPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // fetchUserPlans
         .addCase(fetchUserPlans.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchUserPlans.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload.data.userPlans
            state.pagination = action.payload.data.pagination
         })
         .addCase(fetchUserPlans.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // fetchUserPlan
         .addCase(fetchUserPlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchUserPlan.fulfilled, (state, action) => {
            state.loading = false
            state.selectedPlan = action.payload.data
         })
         .addCase(fetchUserPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // cancelUserPlan
         .addCase(cancelUserPlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(cancelUserPlan.fulfilled, (state, action) => {
            state.loading = false
            // 해지된 요금제 상태 업데이트
            const updatedPlan = action.payload.data
            state.items = state.items.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
            // 선택된 요금제였다면 업데이트
            if (state.selectedPlan?.id === updatedPlan.id) {
               state.selectedPlan = updatedPlan
            }
         })
         .addCase(cancelUserPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

// Actions
export const { clearSelectedPlan, clearError, setFilters } = userPlanSlice.actions

// Selectors
export const selectUserPlans = (state) => state.userPlans.items
export const selectSelectedUserPlan = (state) => state.userPlans.selectedPlan
export const selectUserPlanLoading = (state) => state.userPlans.loading
export const selectUserPlanError = (state) => state.userPlans.error
export const selectUserPlanPagination = (state) => state.userPlans.pagination
export const selectUserPlanFilters = (state) => state.userPlans.filters

export default userPlanSlice.reducer
