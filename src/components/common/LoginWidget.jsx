import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import '../../assets/css/LoginWidget.css'

const LoginWidget = () => {
   const [userType, setUserType] = useState('personal') // 'personal' or 'business'
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isLogin, setIsLogin] = useState(false)
   const [userName, setUserName] = useState('')
   const [rememberMe, setRememberMe] = useState(false)
   const [userAccess, setUserAccess] = useState('') // 'user' or 'agency'
   const navigate = useNavigate()

   useEffect(() => {
      const token = localStorage.getItem('token')
      const storedUserName = localStorage.getItem('userName')
      const storedAccess = localStorage.getItem('userAccess')
      if (token && storedUserName) {
         setIsLogin(true)
         setUserName(storedUserName)
         setUserAccess(storedAccess) // 사용자 접근 권한 설정
      }

      const saveEmail = localStorage.getItem('savedEmail')
      if (saveEmail) {
         setEmail(saveEmail)
         setRememberMe(true)
      }
   }, [])

   const handleLogin = async () => {
      if (!email || !password) {
         alert('아이디와 비밀번호를 입력해주세요.')
         return
      }

      try {
         const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/auth/login`, {
            email,
            password,
            userType,
         })

         if (rememberMe) {
            localStorage.setItem('savedEmail', email)
         } else {
            localStorage.removeItem('savedEmail')
         }

         if (response.data.success) {
            // 로그인 성공 시
            localStorage.setItem('token', response.data.token) // 토큰 저장
            localStorage.setItem('userName', response.data.user.name) // 사용자 이름 저장
            localStorage.setItem('userAccess', response.data.user.access) // 사용자 접근 권한 저장
            setIsLogin(true)
            setUserName(response.data.user.name)
            setUserAccess(response.data.user.access)
            alert('로그인 성공!')
            navigate('/') // 홈으로 이동
         } else {
            alert('아이디 또는 비밀번호가 올바르지 않습니다.')
         }
      } catch (error) {
         console.error(error)
         alert('서버 오류가 발생했습니다.')
      }
   }

   const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      setIsLogin(false)
      setUserName('')
   }

   const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_APP_KAKAO_LOGIN_REST}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)}&response_type=code&scope=profile_nickname&prompt=login`

   return (
      <div className="card shadow-sm p-4">
         {isLogin ? (
            <>
               {userAccess === 'user' ? (
                  <>
                     <div className="text-center">
                        <h5 className="mb-3">{userName}님 환영합니다 🎉</h5>
                        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                           로그아웃
                        </button>
                     </div>
                     <div className="isLogin">
                        <div className="link_btn_group">
                           <a href="/myinfo" className="link_btn">
                              <FontAwesomeIcon icon={faComment} className="me-2" />
                              <p>내 정보</p>
                           </a>
                           <a href="/myinfo/planSettings" className="link_btn ">
                              <FontAwesomeIcon icon={faComment} className="me-2" />
                              <p>내 요금제</p>
                           </a>
                           <a href="/myinfo/billing" className="link_btn">
                              <FontAwesomeIcon icon={faComment} className="me-2" />
                              <p>내 청구서</p>
                           </a>
                        </div>
                     </div>
                  </>
               ) : (
                  <>
                     <p>기업 회원 로그인</p>
                     <h5 className="mb-3">{userName}님 환영합니다 🎉</h5>
                     <div className="isLogin">
                        <div className="link_btn_group">
                           <a href="#" className="link_btn">
                              <FontAwesomeIcon icon={faComment} className="me-2" />
                              <p>정보 관리</p>
                           </a>
                           <a href="#" className="link_btn ">
                              <FontAwesomeIcon icon={faComment} className="me-2" />
                              <p>요금제 관리</p>
                           </a>
                        </div>
                     </div>
                     <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                        로그아웃
                     </button>
                  </>
               )}
            </>
         ) : (
            <>
               <div className="btn-group w-100 mb-4">
                  <button className={`btn ${userType === 'personal' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUserType('personal')}>
                     개인회원
                  </button>
                  <button className={`btn ${userType === 'business' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUserType('business')}>
                     기업회원
                  </button>
               </div>

               <div className="text-group mb-4">
                  <input type="email" name="email" required placeholder="아이디" value={email} onChange={(e) => setEmail(e.target.value)} className="login-textfield col-12 mb-4" />
                  <input type="password" name="password" required placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)} className="login-textfield col-12 " />
               </div>

               <div className="sub-func mb-4 justify-content-between align-items-center d-flex">
                  <div className="sub-func-content">
                     <input type="checkbox" id="rememberMe" className="me-2" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                     <label htmlFor="rememberMe" className="me-3">
                        아이디 저장
                     </label>
                  </div>
                  <div className="sub-func-content">
                     <button className="btn btn-link p-0 m-0 align-baseline">비밀번호 찾기</button>
                  </div>
               </div>

               <div className="login-btn mb-4">
                  <button className="btn btn-primary w-100" onClick={handleLogin}>
                     로그인
                  </button>
               </div>

               {userType === 'personal' && (
                  <div className="d-grid gap-3">
                     <a href={KAKAO_AUTH_URL} className="btn btn-warning w-100">
                        <FontAwesomeIcon icon={faComment} className="me-2" />
                        카카오로 로그인
                     </a>
                  </div>
               )}

               <hr className="my-4" />

               <p className="text-center mb-0">
                  아직 회원이 아니신가요?{' '}
                  <Link to="/signup" className="text-primary text-decoration-none">
                     회원가입
                  </Link>
               </p>
            </>
         )}
      </div>
   )
}

export default LoginWidget
