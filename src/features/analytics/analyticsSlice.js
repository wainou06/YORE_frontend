import { analyticsAPI } from '@/api/analyticsApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getHomeStatusThunk = createAsyncThunk('analytics/getHomeStatus', async (_, { rejectWidthValue }) => {
   try {
      const response = await analyticsAPI.getHomeStatus()
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const getUserStatusThunk = createAsyncThunk('analytics/getUserStatus', async (page, { rejectWidthValue }) => {
   try {
      const response = await analyticsAPI.getUserStatus(page)
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const getPlansStatusThunk = createAsyncThunk('analytics/getPlansStatus', async (page, { rejectWidthValue }) => {
   try {
      const response = await analyticsAPI.getPlansStatus(page)
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const getOrdersStatusThunk = createAsyncThunk('analytics/getOrdersStatus', async (page, { rejectWidthValue }) => {
   try {
      const response = await analyticsAPI.getOrdersStatus(page)
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
      plansStatus: {},
      ordersStatus: {},
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
         .addCase(getPlansStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getPlansStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.plansStatus = action.payload
         })
         .addCase(getPlansStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(getOrdersStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getOrdersStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.ordersStatus = action.payload
         })
         .addCase(getOrdersStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearAnalyticsError } = analyticsSlice.actions
export default analyticsSlice.reducer
