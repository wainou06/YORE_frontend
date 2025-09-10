import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminAPI } from '@services/api'

export const postAdminThunk = createAsyncThunk('admin/postAdmin', async (adminData, { rejectWithValue }) => {
   try {
      const response = await adminAPI.registerAdmin(adminData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const postAdminLoginThunk = createAsyncThunk('admin/postAdminLogin', async (credentials, { rejectWithValue }) => {
   try {
      const response = await adminAPI.loginAdmin(credentials)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const adminSlice = createSlice({
   name: 'admin',
   initialState: {
      isAuthenticated: false,
      loading: false,
      error: null,
   },
   reducers: {
      clearAdminError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(postAdminThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(postAdminThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(postAdminThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(postAdminLoginThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(postAdminLoginThunk.fulfilled, (state) => {
            state.loading = false
            state.isAuthenticated = true
         })
         .addCase(postAdminLoginThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearAdminError } = adminSlice.actions

export default adminSlice.reducer
