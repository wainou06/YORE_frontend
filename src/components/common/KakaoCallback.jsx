import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const KakaoCallback = () => {
   const navigate = useNavigate()
   const effectRan = useRef(false)

   useEffect(() => {
      if (effectRan.current) return
      effectRan.current = true

      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const name = urlParams.get('name')

      // 여기 확인
      console.log('Frontend received token:', token)
      console.log('Frontend received name:', name)

      if (token && name) {
         localStorage.setItem('token', token)
         localStorage.setItem('userName', decodeURIComponent(name))
         navigate('/')
      } else {
         alert('카카오 로그인에 실패했습니다.')
         navigate('/')
      }
   }, [])

   return <p>카카오 로그인 처리 중...</p>
}

export default KakaoCallback
