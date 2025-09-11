import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { transactionAPI } from '@services/api'

const initialState = {
   transactions: [],
   currentTransaction: null,
   loading: false,
   error: null,
   pagination: {
      page: 1,
      limit: 10,
      total: 0,
   },
}

// 결제/주문 목록 조회
export const fetchTransactions = createAsyncThunk('transaction/fetchTransactions', async (params, { rejectWithValue }) => {
   try {
      const response = await transactionAPI.getTransactions(params)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '결제/주문 목록 조회 실패')
   }
})

// 결제/주문 상세 조회
export const fetchTransactionDetail = createAsyncThunk('transaction/fetchTransactionDetail', async (id, { rejectWithValue }) => {
   try {
      const response = await transactionAPI.getTransaction(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '결제/주문 상세 조회 실패')
   }
})

// 새로운 결제/주문 생성
export const createTransaction = createAsyncThunk('transaction/createTransaction', async (data, { rejectWithValue }) => {
   try {
      const response = await transactionAPI.createTransaction(data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '결제/주문 생성 실패')
   }
})

// 결제 환불
export const refundTransaction = createAsyncThunk('transaction/refundTransaction', async (id, { rejectWithValue }) => {
   try {
      const response = await transactionAPI.refundTransaction(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '결제 환불 실패')
   }
})

const transactionSlice = createSlice({
   name: 'transaction',
   initialState,
   reducers: {
      resetTransactionState: (state) => {
         state.currentTransaction = null
         state.error = null
      },
      setPage: (state, action) => {
         state.pagination.page = action.payload
      },
      clearError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         // 결제/주문 목록 조회
         .addCase(fetchTransactions.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchTransactions.fulfilled, (state, action) => {
            state.loading = false
            state.transactions = action.payload.transactions
            state.pagination = action.payload.pagination
         })
         .addCase(fetchTransactions.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 결제/주문 상세 조회
         .addCase(fetchTransactionDetail.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchTransactionDetail.fulfilled, (state, action) => {
            state.loading = false
            state.currentTransaction = action.payload
         })
         .addCase(fetchTransactionDetail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 결제/주문 생성
         .addCase(createTransaction.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createTransaction.fulfilled, (state, action) => {
            state.loading = false
            state.transactions.unshift(action.payload)
            state.currentTransaction = action.payload
            state.pagination.total += 1
         })
         .addCase(createTransaction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 결제 환불
         .addCase(refundTransaction.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(refundTransaction.fulfilled, (state, action) => {
            state.loading = false
            const index = state.transactions.findIndex((transaction) => transaction.id === action.payload.id)
            if (index !== -1) {
               state.transactions[index] = action.payload
            }
            if (state.currentTransaction?.id === action.payload.id) {
               state.currentTransaction = action.payload
            }
         })
         .addCase(refundTransaction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { resetTransactionState, setPage, clearError } = transactionSlice.actions

// Selectors
export const selectAllTransactions = (state) => state.transaction.transactions
export const selectCurrentTransaction = (state) => state.transaction.currentTransaction
export const selectTransactionLoading = (state) => state.transaction.loading
export const selectTransactionError = (state) => state.transaction.error
export const selectTransactionPagination = (state) => state.transaction.pagination

export default transactionSlice.reducer
