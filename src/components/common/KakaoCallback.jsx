import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout, getProfile } from '@/features/auth/authSlice'
import { fetchNotifications } from '@/features/notification/notificationSlice'

const KakaoCallback = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const effectRan = useRef(false)

   useEffect(() => {
      if (effectRan.current) return
      effectRan.current = true

      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const name = urlParams.get('name')
      // state 파라미터로 rememberMe 전달
      const rememberMe = urlParams.get('state') === 'true'

      // 여기 확인
      console.log('Frontend received token:', token)
      console.log('Frontend received name:', name)
      console.log('Frontend received rememberMe:', rememberMe)

      if (token && name) {
         const refreshToken = urlParams.get('refreshToken')
         if (rememberMe) {
            localStorage.setItem('token', token)
            localStorage.setItem('userName', decodeURIComponent(name))
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
         } else {
            sessionStorage.setItem('token', token)
            sessionStorage.setItem('userName', decodeURIComponent(name))
            if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken)
         }
         // 프로필 및 알림 동기화
         dispatch(getProfile()).then(() => {
            dispatch(fetchNotifications())
            navigate('/')
         })
      } else {
         localStorage.removeItem('token')
         localStorage.removeItem('refreshToken')
         sessionStorage.removeItem('token')
         sessionStorage.removeItem('userName')
         sessionStorage.removeItem('refreshToken')
         dispatch(logout())
         alert('카카오 로그인에 실패했습니다.')
         navigate('/')
      }
   }, [])

   return <p>카카오 로그인 처리 중...</p>
}

export default KakaoCallback
