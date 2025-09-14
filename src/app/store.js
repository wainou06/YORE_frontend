import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'
import checkoutReducer from '@features/checkout/checkoutSlice'
import modalReducer from '@features/modal/modalSlice'
import plansReducer from '../features/plans/planSlice'
import servicesReducer from '../features/services/serviceSlice'
import adminReducer from '@features/admin/adminSlice'
import userPlansReducer from '@features/userPlans/userPlanSlice'
import transactionReducer from '@features/transactions/transactionSlice'
import agencyReducer from '@features/agency/agencySlice'
import orderReducer from '@features/order/orderSlice'
import analyticsReducer from '@features/analytics/analyticsSlice'

export const store = configureStore({
   reducer: {
      auth: authReducer,
      checkout: checkoutReducer,
      modal: modalReducer,
      admin: adminReducer,
      plans: plansReducer,
      userPlans: userPlansReducer,
      agency: agencyReducer,
      order: orderReducer,
      analytics: analyticsReducer,
      services: servicesReducer,
      transactions: transactionReducer,
   },
   // preloadedState: process.env.NODE_ENV === 'development' ? devInitialState : undefined,
})
