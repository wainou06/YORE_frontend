import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   checkoutData: null,
   loading: false,
   error: null,
}

export const checkoutSlice = createSlice({
   name: 'checkout',
   initialState,
   reducers: {
      setCheckoutData: (state, action) => {
         state.checkoutData = action.payload
      },
      clearCheckoutData: (state) => {
         state.checkoutData = null
      },
      startPayment: (state) => {
         state.loading = true
         state.error = null
      },
      paymentSuccess: (state) => {
         state.loading = false
         state.checkoutData = null
      },
      paymentFailure: (state, action) => {
         state.loading = false
         state.error = action.payload
      },
   },
})

export const { setCheckoutData, clearCheckoutData, startPayment, paymentSuccess, paymentFailure } = checkoutSlice.actions

export default checkoutSlice.reducer
