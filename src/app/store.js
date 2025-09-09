import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'
import checkoutReducer from '@features/checkout/checkoutSlice'
import modalReducer from '@features/modal/modalSlice'
import plansReducer from '../features/plans/planSlice'

// 개발 환경에서 사용할 임시 관리자 계정
const devInitialState = {
   auth: {
      user: {
         id: 1,
         name: '관리자',
         email: 'admin@example.com',
         role: 'admin',
      },
      isAuthenticated: true,
      loading: false,
      error: null,
   },
}

export const store = configureStore({
   reducer: {
      auth: authReducer,
      checkout: checkoutReducer,
      modal: modalReducer,
      plans: plansReducer,
   },
   preloadedState: process.env.NODE_ENV === 'development' ? devInitialState : undefined,
})
