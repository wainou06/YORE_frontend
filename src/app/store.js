import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'
import checkoutReducer from '@features/checkout/checkoutSlice'
import modalReducer from '@features/modal/modalSlice'
import plansReducer from '../features/plans/planSlice'
import adminReducer from '@features/admin/adminSlice'
import userPlansReducer from '@features/userPlans/userPlanSlice'
import agencyReducer from '@features/agency/agencySlice'
import orderReducer from '@features/order/orderSlice'

// 개발 환경에서 사용할 임시 상태
const devInitialState = {
   auth: {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
   },
}

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
   },
   preloadedState: process.env.NODE_ENV === 'development' ? devInitialState : undefined,
})
