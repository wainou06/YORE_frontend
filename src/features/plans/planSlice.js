import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { plansAPI } from '@/api/plansApi'

const initialState = {
   loading: false,
   error: null,
}

export const createPlan = createAsyncThunk('plans/createPlan', async (formData, { rejectWithValue }) => {
   try {
      const response = await plansAPI.createPlan(formData)
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '요금제 등록에 실패했습니다.')
   }
})

const planSlice = createSlice({
   name: 'plans',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
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
   },
})

export default planSlice.reducer
