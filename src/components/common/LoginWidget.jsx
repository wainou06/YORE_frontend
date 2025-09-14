import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import NotificationDropdown from './NotificationDropdown'
import { login, logout, getProfile, selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError, selectUserType } from '@features/auth/authSlice'
import { fetchNotifications } from '@features/notification/notificationSlice'
import '../../assets/css/LoginWidget.css'

const LoginWidget = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const user = useSelector(selectUser)
   const isAuthenticated = useSelector(selectIsAuthenticated)
   const loading = useSelector(selectAuthLoading)
   const error = useSelector(selectAuthError)
   const userType = useSelector(selectUserType)

   // 알림 상태
   const notifications = useSelector((state) => state.notification.notifications)
   const unreadCount = notifications.filter((n) => !n.isRead).length

   // 알림 드롭다운 상태
   const [showDropdown, setShowDropdown] = useState(false)

   // (자동 알림 목록 불러오기 useEffect 제거)

   // 토큰이 있을 때만 getProfile 호출 (최초 마운트/로그인 직후)
   useEffect(() => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token && typeof token === 'string' && token.trim() !== '') {
         dispatch(getProfile())
      }
      // 토큰이 없을 때는 아무것도 하지 않음
   }, [dispatch])

   // 토큰이 없고 로그인 상태면 클라이언트 상태만 초기화 (자동 로그아웃 루프 방지)
   useEffect(() => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if ((!token || token.trim() === '') && (user || isAuthenticated)) {
         dispatch({ type: 'auth/resetAuthState' })
      }
   }, [dispatch, user, isAuthenticated])

   // 로그인 후 user 객체 구조 콘솔 출력
   useEffect(() => {
      console.log('[LoginWidget] user:', user)
   }, [user])

   const [loginType, setLoginType] = useState('personal') // 'personal' or 'business'
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [rememberMe, setRememberMe] = useState(false)

   useEffect(() => {
      // 저장된 이메일 불러오기
      const savedEmail = localStorage.getItem('savedEmail')
      if (savedEmail) {
         setEmail(savedEmail)
         setRememberMe(true)
      }
   }, [])

   const handleLogin = async () => {
      if (!email || !password) {
         alert('아이디와 비밀번호를 입력해주세요.')
         return
      }

      // 이메일 저장 설정
      if (rememberMe) {
         localStorage.setItem('savedEmail', email)
      } else {
         localStorage.removeItem('savedEmail')
      }

      try {
         const result = await dispatch(
            login({
               email,
               password,
               userType: loginType,
            })
         ).unwrap()
         // 로그인 성공 시 토큰 저장 (rememberMe 체크)
         if (result && result.token) {
            if (rememberMe) {
               localStorage.setItem('token', result.token)
               sessionStorage.removeItem('token')
            } else {
               sessionStorage.setItem('token', result.token)
               localStorage.removeItem('token')
            }
         }
         // 프로필 동기화 후 알림 불러오기
         await dispatch(getProfile()).unwrap()
         await dispatch(fetchNotifications())
      } catch (error) {
         console.error('로그인 실패:', error)
      }
   }

   const handleLogout = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token && token.trim() !== '') {
         dispatch(logout()).finally(() => {
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
            if (!rememberMe) {
               localStorage.removeItem('savedEmail')
               setEmail('')
               setRememberMe(false)
            }
            setPassword('') // 로그아웃 시 비밀번호 입력창 초기화
            navigate('/')
         })
      } else {
         // 토큰이 없으면 클라이언트 상태만 초기화
         dispatch({ type: 'auth/resetAuthState' })
         localStorage.removeItem('token')
         sessionStorage.removeItem('token')
         if (!rememberMe) {
            localStorage.removeItem('savedEmail')
            setEmail('')
            setRememberMe(false)
         }
         setPassword('') // 로그아웃 시 비밀번호 입력창 초기화
         navigate('/')
      }
   }

   // rememberMe를 state 파라미터로 전달하는 카카오 로그인 URL 생성 함수
   const getKakaoAuthUrl = () => {
      const base = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_APP_KAKAO_LOGIN_REST}`
      const redirect = encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)
      // state 파라미터로 rememberMe 전달
      return `${base}&redirect_uri=${redirect}&response_type=code&scope=profile_nickname&prompt=login&state=${rememberMe}`
   }

   return (
      <div className="card shadow-sm p-4">
         {isAuthenticated && user ? (
            <>
               {/* 환영 메시지와 알림 아이콘을 같은 줄에 배치 */}
               <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="mb-0">{user.name}님 환영합니다 🎉</h5>
                  <NotificationDropdown show={showDropdown} onClose={() => setShowDropdown(false)} onToggle={() => setShowDropdown((prev) => !prev)} notifications={notifications} unreadCount={unreadCount} />
               </div>
               {user.access === 'user' ? (
                  <>
                     <div className="text-center">
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
                     <h5 className="mb-3">{user.name}님 환영합니다 🎉</h5>
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
                  <button className={`btn ${loginType === 'personal' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setLoginType('personal')}>
                     개인회원
                  </button>
                  <button className={`btn ${loginType === 'business' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setLoginType('business')}>
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
                  <button className="btn btn-primary w-100" onClick={handleLogin} disabled={loading}>
                     {loading ? '로그인 중...' : '로그인'}
                  </button>
               </div>

               {error && error !== '프로필 조회 실패' && (
                  <div className="alert alert-danger" role="alert">
                     {error}
                  </div>
               )}

               {loginType === 'personal' && (
                  <div className="d-grid gap-3">
                     <button
                        type="button"
                        className="btn btn-warning w-100"
                        onClick={() => {
                           window.location.href = getKakaoAuthUrl()
                        }}
                     >
                        <FontAwesomeIcon icon={faComment} className="me-2" />
                        카카오로 로그인
                     </button>
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
