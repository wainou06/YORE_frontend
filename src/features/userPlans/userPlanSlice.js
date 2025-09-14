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

const initialState = {
   userPlan: null,
   loading: false,
   error: null,
}

const userPlanSlice = createSlice({
   name: 'userPlans',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
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
   },
})

export default userPlanSlice.reducer
