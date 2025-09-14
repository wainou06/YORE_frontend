import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { transactionAPI } from '@/api/transactionsApi'

// 결제 생성 thunk
export const createTransaction = createAsyncThunk('transactions/createTransaction', async (data, { rejectWithValue }) => {
   try {
      const response = await transactionAPI.createTransaction(data)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
   }
})

const initialState = {
   transaction: null,
   loading: false,
   error: null,
}

const transactionSlice = createSlice({
   name: 'transactions',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(createTransaction.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createTransaction.fulfilled, (state, action) => {
            state.loading = false
            state.transaction = action.payload.data
            state.error = null
         })
         .addCase(createTransaction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '결제 생성 실패'
         })
   },
})

export default transactionSlice.reducer
