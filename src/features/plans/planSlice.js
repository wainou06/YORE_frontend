import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { plansAPI } from '@services/api'

// 초기 상태
const initialState = {
   plans: [],
   agencyPlans: [], // 통신사의 요금제 목록
   selectedPlan: null,
   loading: false,
   error: null,
   approvalStatus: null,
}

// 공통 Async Thunks
export const fetchPlans = createAsyncThunk('plans/fetchPlans', async (params, { rejectWithValue }) => {
   try {
      const response = await plansAPI.getPlans(params)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 목록을 불러오는데 실패했습니다.')
   }
})

export const fetchPlanById = createAsyncThunk('plans/fetchPlanById', async (id, { rejectWithValue }) => {
   try {
      const response = await plansAPI.getPlan(id)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 정보를 불러오는데 실패했습니다.')
   }
})

// 통신사 Async Thunks
export const fetchAgencyPlans = createAsyncThunk('plans/fetchAgencyPlans', async (_, { rejectWithValue }) => {
   try {
      const response = await plansAPI.getAgencyPlans()
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '통신사 요금제 목록을 불러오는데 실패했습니다.')
   }
})

export const createPlan = createAsyncThunk('plans/createPlan', async (formData, { rejectWithValue }) => {
   try {
      const response = await plansAPI.createPlan(formData)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 등록에 실패했습니다.')
   }
})

export const updatePlan = createAsyncThunk('plans/updatePlan', async ({ id, data }, { rejectWithValue }) => {
   try {
      const response = await plansAPI.updatePlan(id, data)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 수정에 실패했습니다.')
   }
})

export const deletePlan = createAsyncThunk('plans/deletePlan', async (id, { rejectWithValue }) => {
   try {
      await plansAPI.deletePlan(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 삭제에 실패했습니다.')
   }
})

// 관리자 Async Thunks
export const approvePlan = createAsyncThunk('plans/approvePlan', async ({ id, status, rejectionReason }, { rejectWithValue }) => {
   try {
      const response = await plansAPI.approvePlan(id, { status, rejectionReason })
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 승인/반려에 실패했습니다.')
   }
})

export const createPlanAsAdmin = createAsyncThunk('plans/createPlanAsAdmin', async (formData, { rejectWithValue }) => {
   try {
      const response = await plansAPI.createPlanAsAdmin(formData)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '관리자 요금제 등록에 실패했습니다.')
   }
})

export const deletePlanAsAdmin = createAsyncThunk('plans/deletePlanAsAdmin', async (id, { rejectWithValue }) => {
   try {
      await plansAPI.deletePlanAsAdmin(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '관리자 요금제 삭제에 실패했습니다.')
   }
})

// Slice
const planSlice = createSlice({
   name: 'plans',
   initialState,
   reducers: {
      clearSelectedPlan: (state) => {
         state.selectedPlan = null
      },
      clearError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         // fetchPlans
         .addCase(fetchPlans.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPlans.fulfilled, (state, action) => {
            state.loading = false
            state.plans = action.payload
         })
         .addCase(fetchPlans.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // fetchPlanById
         .addCase(fetchPlanById.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPlanById.fulfilled, (state, action) => {
            state.loading = false
            state.selectedPlan = action.payload
         })
         .addCase(fetchPlanById.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // createPlan
         .addCase(createPlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createPlan.fulfilled, (state, action) => {
            state.loading = false
            state.plans.push(action.payload)
            state.agencyPlans.push(action.payload)
         })
         .addCase(createPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // updatePlan
         .addCase(updatePlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updatePlan.fulfilled, (state, action) => {
            state.loading = false
            state.plans = state.plans.map((plan) => (plan.id === action.payload.id ? action.payload : plan))
            state.agencyPlans = state.agencyPlans.map((plan) => (plan.id === action.payload.id ? action.payload : plan))
            state.selectedPlan = action.payload
         })
         .addCase(updatePlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // deletePlan
         .addCase(deletePlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deletePlan.fulfilled, (state, action) => {
            state.loading = false
            state.plans = state.plans.filter((plan) => plan.id !== action.payload)
            state.agencyPlans = state.agencyPlans.filter((plan) => plan.id !== action.payload)
            if (state.selectedPlan?.id === action.payload) {
               state.selectedPlan = null
            }
         })
         .addCase(deletePlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // fetchAgencyPlans
         .addCase(fetchAgencyPlans.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchAgencyPlans.fulfilled, (state, action) => {
            state.loading = false
            state.agencyPlans = action.payload
         })
         .addCase(fetchAgencyPlans.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // approvePlan
         .addCase(approvePlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(approvePlan.fulfilled, (state, action) => {
            state.loading = false
            // 전체 요금제 목록 업데이트
            state.plans = state.plans.map((plan) => (plan.id === action.payload.id ? action.payload : plan))
            // 통신사 요금제 목록 업데이트
            state.agencyPlans = state.agencyPlans.map((plan) => (plan.id === action.payload.id ? action.payload : plan))
            // 선택된 요금제가 있다면 업데이트
            if (state.selectedPlan?.id === action.payload.id) {
               state.selectedPlan = action.payload
            }
            state.approvalStatus = action.payload.approvalStatus
         })
         .addCase(approvePlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // createPlanAsAdmin
         .addCase(createPlanAsAdmin.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createPlanAsAdmin.fulfilled, (state, action) => {
            state.loading = false
            state.plans.push(action.payload)
            // 관리자가 생성한 요금제도 해당 통신사의 요금제 목록에 추가
            if (action.payload.agencyId) {
               state.agencyPlans.push(action.payload)
            }
         })
         .addCase(createPlanAsAdmin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // deletePlanAsAdmin
         .addCase(deletePlanAsAdmin.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deletePlanAsAdmin.fulfilled, (state, action) => {
            state.loading = false
            state.plans = state.plans.filter((plan) => plan.id !== action.payload)
            state.agencyPlans = state.agencyPlans.filter((plan) => plan.id !== action.payload)
            if (state.selectedPlan?.id === action.payload) {
               state.selectedPlan = null
            }
         })
         .addCase(deletePlanAsAdmin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearSelectedPlan, clearError } = planSlice.actions

// Selectors
export const selectAllPlans = (state) => state.plans.plans
export const selectAgencyPlans = (state) => state.plans.agencyPlans
export const selectSelectedPlan = (state) => state.plans.selectedPlan
export const selectPlanLoading = (state) => state.plans.loading
export const selectPlanError = (state) => state.plans.error
export const selectApprovalStatus = (state) => state.plans.approvalStatus

export default planSlice.reducer
