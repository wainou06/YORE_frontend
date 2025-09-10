import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { plansAPI } from '@services/api'

// 초기 상태
const initialState = {
   plans: [],
   selectedPlan: null,
   loading: false,
   error: null,
}

// Async Thunks
export const fetchPlans = createAsyncThunk('plans/fetchPlans', async (_, { rejectWithValue }) => {
   try {
      const response = await plansAPI.getPlans()
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

export const createPlan = createAsyncThunk('plans/createPlan', async (planData, { rejectWithValue }) => {
   try {
      const response = await plansAPI.createPlan(planData)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 등록에 실패했습니다.')
   }
})

export const updatePlan = createAsyncThunk('plans/updatePlan', async ({ id, planData }, { rejectWithValue }) => {
   try {
      const response = await plansAPI.updatePlan(id, planData)
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
            if (state.selectedPlan?.id === action.payload) {
               state.selectedPlan = null
            }
         })
         .addCase(deletePlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearSelectedPlan, clearError } = planSlice.actions

export default planSlice.reducer
