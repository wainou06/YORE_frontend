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

export const getUserStatusThunk = createAsyncThunk('analytics/getUserStatus', async (data, { rejectWidthValue }) => {
   try {
      const page = data.currentPage
      const filter = data.filter

      const response = await analyticsAPI.getUserStatus({ page, filter })
      return response.data
   } catch (error) {
      console.log(error)
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const getPlansStatusThunk = createAsyncThunk('analytics/getPlansStatus', async (data, { rejectWidthValue }) => {
   try {
      const page = data.currentPage
      const filter = data.filter
      const response = await analyticsAPI.getPlansStatus({ page, filter })
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const getOrdersStatusThunk = createAsyncThunk('analytics/getOrdersStatus', async (data, { rejectWidthValue }) => {
   try {
      const page = data.currentPage
      const filterName = data.filterName
      const filterStatus = data.filterStatus
      const response = await analyticsAPI.getOrdersStatus({ page, filterName, filterStatus })
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const getUserDetailThunk = createAsyncThunk('analytics/getUserDetail', async (id, { rejectWidthValue }) => {
   try {
      const response = await analyticsAPI.getUserDetail(id)
      return response.data
   } catch (error) {
      return rejectWidthValue(error.response?.data?.message)
   }
})

export const putPlanStatusThunk = createAsyncThunk('analytics/putPlanStatus', async (data, { rejectWidthValue }) => {
   try {
      const id = data.planId
      const status = data.newStatus
      const response = await analyticsAPI.putPlanStatus({ id, status })
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
      userDetail: {},
      planDetail: {},
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
         .addCase(getUserDetailThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getUserDetailThunk.fulfilled, (state, action) => {
            state.loading = false
            state.userDetail = action.payload
         })
         .addCase(getUserDetailThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(putPlanStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(putPlanStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.planDetail = action.payload
         })
         .addCase(putPlanStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearAnalyticsError } = analyticsSlice.actions
export default analyticsSlice.reducer
