import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   user: null,
   agency: null,
   isAuthenticated: false,
   loading: false,
   error: null,
}

export const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      loginStart: (state) => {
         state.loading = true
         state.error = null
      },
      loginSuccess: (state, action) => {
         state.loading = false
         state.isAuthenticated = true
         state.error = null

         // 일반 사용자 또는 통신사 로그인의 경우
         state.user = action.payload
         // 통신사 사용자인 경우 agency 정보도 저장
         if (action.payload.access === 'agency' && action.payload.agency) {
            state.agency = action.payload.agency
         }
      },
      loginFailure: (state, action) => {
         state.loading = false
         state.error = action.payload
      },
      logout: (state) => {
         state.user = null
         state.agency = null
         state.isAuthenticated = false
         state.loading = false
         state.error = null
      },
   },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions

export default authSlice.reducer
