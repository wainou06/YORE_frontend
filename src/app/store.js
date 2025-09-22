import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'
import checkoutReducer from '@features/checkout/checkoutSlice'
import modalReducer from '@features/modal/modalSlice'
import adminReducer from '@features/admin/adminSlice'
import plansReducer from '@features/plans/planSlice'
import userPlansReducer from '@features/userPlans/userPlanSlice'
import agencyReducer from '@features/agency/agencySlice'
import orderReducer from '@features/order/orderSlice'
import analyticsReducer from '@features/analytics/analyticsSlice'
import servicesReducer from '@features/services/serviceSlice'
import transactionReducer from '@features/transactions/transactionSlice'
import notificationReducer from '@features/notification/notificationSlice'
import surveyReducer from '@features/survey/surveySlice'
import userServicesReducer from '@features/userServices/userServicesSlice'

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
      notification: notificationReducer,
      survey: surveyReducer,
      userServices: userServicesReducer,
   },
})
