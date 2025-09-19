import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userPlansAPI } from '@/api/userPlansApi'

// 사용자 요금제 생성 thunk
export const createUserPlan = createAsyncThunk('userPlans/createUserPlan', async (data, { rejectWithValue }) => {
   try {
      const response = await userPlansAPI.createUserPlan(data)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
   }
})

// 내 요금제 목록 조회 thunk
export const getMyUserPlans = createAsyncThunk('userPlans/getMyUserPlans', async (_, { rejectWithValue }) => {
   try {
      const response = await userPlansAPI.getMyUserPlans()
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
   }
})

// 내 요금제 청구서 조회 thunk
export const getMyUserPlanBill = createAsyncThunk('userPlans/getMyUserPlanBill', async (_, { rejectWithValue }) => {
   try {
      const response = await userPlansAPI.getMyUserPlanBill()
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
   }
})

const initialState = {
   userPlan: null,
   userPlans: [],
   userPlanBill: null,
   loading: false,
   error: null,
}

const userPlanSlice = createSlice({
   name: 'userPlans',
   initialState,
   reducers: {
      resetUserPlanBill: (state) => {
         state.userPlanBill = null
      },
   },
   extraReducers: (builder) => {
      builder
         // 생성
         .addCase(createUserPlan.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createUserPlan.fulfilled, (state, action) => {
            state.loading = false
            state.userPlan = action.payload.data
            state.error = null
         })
         .addCase(createUserPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '요금제 생성 실패'
         })
         // 목록
         .addCase(getMyUserPlans.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getMyUserPlans.fulfilled, (state, action) => {
            state.loading = false
            state.userPlans = action.payload.data
            state.error = null
         })
         .addCase(getMyUserPlans.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '요금제 목록 조회 실패'
         })
         // 청구서
         .addCase(getMyUserPlanBill.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getMyUserPlanBill.fulfilled, (state, action) => {
            state.loading = false
            state.userPlanBill = action.payload.data
            state.error = null
         })
         .addCase(getMyUserPlanBill.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '요금제 청구서 조회 실패'
         })
   },
})

export const { resetUserPlanBill } = userPlanSlice.actions
export default userPlanSlice.reducer
