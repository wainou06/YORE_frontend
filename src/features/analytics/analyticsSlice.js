import { analyticsAPI } from '@/services/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getHomeStatusThunk = createAsyncThunk('analytics/getHomeStatus', async (_, { rejectWidthValue }) => {
   try {
      const response = await analyticsAPI.getHomeStatus()
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const getUserStatusThunk = createAsyncThunk('analytics/getUserStatus', async (_, { rejectWidthValue }) => {
   try {
      const response = await analyticsAPI.getUserStatus()
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const analyticsSlice = createSlice({
   name: 'analytics',
   initialState: {
      error: null,
      loading: true,
      home: {},
      userManagement: {},
   },
   reducers: {
      clearAnalyticsError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getHomeStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getHomeStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.home = action.payload
         })
         .addCase(getHomeStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(getUserStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getUserStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.userManagement = action.payload
         })
         .addCase(getUserStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearAnalyticsError } = analyticsSlice.actions
export default analyticsSlice.reducer
