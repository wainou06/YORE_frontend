import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import servicesAPI from '@/api/servicesApi'
import analyticsAPI from '@/api/analyticsApi'

const initialState = {
   services: [],
   selectedService: null,
   analytics: {
      revenue: null,
      stats: null,
      periodStats: null,
   },
   loading: false,
   error: null,
   pagination: {
      page: 1,
      limit: 10,
      total: 0,
   },
}

// Service Management Thunks
export const fetchServices = createAsyncThunk('agency/fetchServices', async (params, { rejectWithValue }) => {
   try {
      const response = await servicesAPI.getAllServices(params)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '서비스 목록 조회 실패')
   }
})

export const fetchServiceDetail = createAsyncThunk('agency/fetchServiceDetail', async (id, { rejectWithValue }) => {
   try {
      const response = await servicesAPI.getService(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '서비스 상세 조회 실패')
   }
})

export const createService = createAsyncThunk('agency/createService', async (data, { rejectWithValue }) => {
   try {
      const response = await servicesAPI.createService(data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '서비스 생성 실패')
   }
})

export const updateService = createAsyncThunk('agency/updateService', async ({ id, data }, { rejectWithValue }) => {
   try {
      const response = await servicesAPI.updateService(id, data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '서비스 수정 실패')
   }
})

export const deleteService = createAsyncThunk('agency/deleteService', async (id, { rejectWithValue }) => {
   try {
      await servicesAPI.deleteService(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '서비스 삭제 실패')
   }
})

// Analytics Thunks
export const fetchServiceStats = createAsyncThunk('agency/fetchServiceStats', async (serviceId, { rejectWithValue }) => {
   try {
      const response = await analyticsAPI.getServiceDetailStats(serviceId)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '서비스 통계 조회 실패')
   }
})

export const fetchPeriodStats = createAsyncThunk('agency/fetchPeriodStats', async (params, { rejectWithValue }) => {
   try {
      const response = await analyticsAPI.getPeriodStats(params)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '기간별 통계 조회 실패')
   }
})

const agencySlice = createSlice({
   name: 'agency',
   initialState,
   reducers: {
      resetAgencyState: () => initialState,
      setPage: (state, action) => {
         state.pagination.page = action.payload
      },
      clearError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         // Services Management
         .addCase(fetchServices.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchServices.fulfilled, (state, action) => {
            state.loading = false
            state.services = action.payload.services
            state.pagination = action.payload.pagination
         })
         .addCase(fetchServices.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(fetchServiceDetail.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchServiceDetail.fulfilled, (state, action) => {
            state.loading = false
            state.selectedService = action.payload
         })
         .addCase(fetchServiceDetail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(createService.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createService.fulfilled, (state, action) => {
            state.loading = false
            state.services.unshift(action.payload)
            state.selectedService = action.payload
         })
         .addCase(createService.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(updateService.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateService.fulfilled, (state, action) => {
            state.loading = false
            state.services = state.services.map((service) => (service.id === action.payload.id ? action.payload : service))
            state.selectedService = action.payload
         })
         .addCase(updateService.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(deleteService.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteService.fulfilled, (state, action) => {
            state.loading = false
            state.services = state.services.filter((service) => service.id !== action.payload)
            if (state.selectedService?.id === action.payload) {
               state.selectedService = null
            }
         })
         .addCase(deleteService.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // Analytics
         .addCase(fetchServiceStats.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchServiceStats.fulfilled, (state, action) => {
            state.loading = false
            state.analytics.stats = action.payload
         })
         .addCase(fetchServiceStats.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         .addCase(fetchPeriodStats.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPeriodStats.fulfilled, (state, action) => {
            state.loading = false
            state.analytics.periodStats = action.payload
         })
         .addCase(fetchPeriodStats.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { resetAgencyState, setPage, clearError } = agencySlice.actions

// Selectors
export const selectServices = (state) => state.agency.services
export const selectSelectedService = (state) => state.agency.selectedService
export const selectAnalytics = (state) => state.agency.analytics
export const selectAgencyLoading = (state) => state.agency.loading
export const selectAgencyError = (state) => state.agency.error
export const selectPagination = (state) => state.agency.pagination

export default agencySlice.reducer
