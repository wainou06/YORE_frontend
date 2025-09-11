import { analyticsAPI } from '@/services/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getTotalUsersThunk = createAsyncThunk('analytics/getTotalUsers', async (_, { rejectWidthValue }) => {
   try {
      const response = await analyticsAPI.getTotalUsers()
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const analyticsSlice = createSlice({
   name: 'analytics',
   initialState: {
      error: null,
      loading: false,
      data: null,
   },
   reducers: {
      clearAnalyticsError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getTotalUsersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getTotalUsersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
         })
         .addCase(getTotalUsersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearAnalyticsError } = analyticsSlice.actions
export default analyticsSlice.reducer
