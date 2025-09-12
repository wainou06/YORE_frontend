import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { servicesAPI } from '@/api/servicesApi'

const initialState = {
   loading: false,
   error: null,
}

export const createService = createAsyncThunk('services/createService', async (serviceData, { rejectWithValue }) => {
   try {
      const res = await servicesAPI.createService(serviceData)
      return res.data.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
   }
})

const serviceSlice = createSlice({
   name: 'services',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(createService.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createService.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(createService.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default serviceSlice.reducer
