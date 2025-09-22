import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserServicesByUserId } from '@/api/userServicesApi'

export const fetchUserServices = createAsyncThunk('userServices/fetchUserServices', async (userId, thunkAPI) => {
   try {
      const res = await getUserServicesByUserId(userId)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
   }
})

const userServicesSlice = createSlice({
   name: 'userServices',
   initialState: {
      userServices: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchUserServices.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchUserServices.fulfilled, (state, action) => {
            state.loading = false
            state.userServices = action.payload
         })
         .addCase(fetchUserServices.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default userServicesSlice.reducer
