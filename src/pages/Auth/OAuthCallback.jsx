import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '@features/auth/authSlice'

const OAuthCallback = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const [searchParams] = useSearchParams()

   useEffect(() => {
      const code = searchParams.get('code')
      if (code) {
         // TODO: API 연동 후 토큰 저장
         const mockUser = {
            id: 1,
            name: '테스트 유저',
            email: 'test@example.com',
         }

         dispatch(loginSuccess(mockUser))
         navigate('/')
      } else {
         navigate('/')
      }
   }, [searchParams, dispatch, navigate])

   return (
      <div className="container py-5 text-center">
         <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
         </div>
         <p className="mt-3">로그인 처리 중입니다...</p>
      </div>
   )
}

export default OAuthCallback
