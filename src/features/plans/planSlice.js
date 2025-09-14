import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { plansAPI } from '@/api/plansApi'

const initialState = {
   loading: false,
   error: null,
   plans: [],
   plan: null, // 단일 요금제 상세
   agencies: [], // 통신사 목록
}
// 요금제 목록 조회 thunk
export const getPlans = createAsyncThunk('plans/getPlans', async (_, { rejectWithValue }) => {
   try {
      const response = await plansAPI.getPlans()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 목록 조회에 실패했습니다.')
   }
})

// 요금제 생성 thunk
export const createPlan = createAsyncThunk('plans/createPlan', async (formData, { rejectWithValue }) => {
   try {
      const response = await plansAPI.createPlan(formData)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 등록에 실패했습니다.')
   }
})

// 요금제 수정 thunk
export const updatePlan = createAsyncThunk('plans/updatePlan', async ({ id, data }, { rejectWithValue }) => {
   try {
      const res = await plansAPI.updatePlan(id, data)
      return res.data
   } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
   }
})

// 요금제 삭제 thunk
export const deletePlan = createAsyncThunk('plans/deletePlan', async (id, { rejectWithValue }) => {
   try {
      await plansAPI.deletePlan(id)
      return id
   } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
   }
})

// 통신사별 요금제 목록 조회 thunk
export const getPlansByAgency = createAsyncThunk('plans/getPlansByAgency', async (agencyId, { rejectWithValue }) => {
   try {
      const response = await plansAPI.getPlansByAgency(agencyId)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '통신사별 요금제 조회에 실패했습니다.')
   }
})

// 통신사 전체 조회 thunk
export const getAgencies = createAsyncThunk('plans/getAgencies', async (_, { rejectWithValue }) => {
   try {
      const response = await plansAPI.getAgencies()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '통신사 목록 조회에 실패했습니다.')
   }
})

// 단일 요금제 상세 조회 thunk
export const getPlanById = createAsyncThunk('plans/getPlanById', async (id, { rejectWithValue }) => {
   try {
      const response = await plansAPI.getPlanById(id)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 상세 조회에 실패했습니다.')
   }
})

const planSlice = createSlice({
   name: 'plans',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         // createPlan
         .addCase(createPlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createPlan.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(createPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // getPlans
         .addCase(getPlans.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getPlans.fulfilled, (state, action) => {
            state.loading = false
            state.plans = action.payload
         })
         .addCase(getPlans.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // getPlansByAgency
         .addCase(getPlansByAgency.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getPlansByAgency.fulfilled, (state, action) => {
            state.loading = false
            state.plans = action.payload
         })
         .addCase(getPlansByAgency.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // getAgencies
         .addCase(getAgencies.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getAgencies.fulfilled, (state, action) => {
            state.loading = false
            state.agencies = action.payload
         })
         .addCase(getAgencies.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // getPlanById
         .addCase(getPlanById.pending, (state) => {
            state.loading = true
            state.error = null
            state.plan = null
         })
         .addCase(getPlanById.fulfilled, (state, action) => {
            state.loading = false
            state.plan = action.payload
         })
         .addCase(getPlanById.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.plan = null
         })
         // updatePlan
         .addCase(updatePlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updatePlan.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            // plans 배열에서 해당 plan 교체
            const idx = state.plans.findIndex((p) => p.id === action.payload.data.id)
            if (idx !== -1) state.plans[idx] = action.payload.data
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
            state.error = null
            state.plans = state.plans.filter((p) => p.id !== action.payload)
         })
         .addCase(deletePlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default planSlice.reducer
