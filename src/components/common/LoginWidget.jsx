import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faUser, faMobileScreenButton, faCalculator } from '@fortawesome/free-solid-svg-icons'
import NotificationDropdown from './NotificationDropdown'
import { login, logout, getProfile, selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '@/features/auth/authSlice'
import { fetchNotifications } from '@/features/notification/notificationSlice'
import { showModalThunk } from '../../features/modal/modalSlice'
import '../../assets/css/LoginWidget.css'

const LoginWidget = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const user = useSelector(selectUser)
   const isAuthenticated = useSelector(selectIsAuthenticated)
   const loading = useSelector(selectAuthLoading)
   const error = useSelector(selectAuthError)

   // 로그인된 상태에서 알림 자동 fetch
   useEffect(() => {
      if (isAuthenticated && user) {
         dispatch(fetchNotifications())
      }
   }, [isAuthenticated, user, dispatch])

   const notifications = useSelector((state) => state.notification.notifications)
   const unreadCount = notifications.filter((n) => !n.isRead).length
   // 알림 상태 콘솔 출력
   useEffect(() => {
      console.log('[알림 상태]', notifications)
      console.log('[읽지 않은 알림 개수]', unreadCount)
   }, [notifications, unreadCount])

   const [showDropdown, setShowDropdown] = useState(false)
   const [loginType, setLoginType] = useState('personal')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [rememberMe, setRememberMe] = useState(false)
   const [userName, setUserName] = useState('')

   // 아이디 저장 초기화
   useEffect(() => {
      const savedEmail = localStorage.getItem('savedEmail')
      if (savedEmail) {
         setEmail(savedEmail)
         setRememberMe(true)
      }

      const savedName = localStorage.getItem('userName')
      if (savedName) setUserName(savedName)
   }, [])

   // 토큰 있으면 프로필 조회
   useEffect(() => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token && token.trim() !== '') dispatch(getProfile())
   }, [dispatch])

   // 토큰 없는데 유저가 남아있으면 초기화
   useEffect(() => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if ((!token || token.trim() === '') && (user || isAuthenticated)) {
         dispatch({ type: 'auth/resetAuthState' })
      }
   }, [dispatch, user, isAuthenticated])

   const handleLogin = async () => {
      if (!email || !password) {
         await dispatch(showModalThunk({ type: 'alert', placeholder: '이메일과 비밀번호를 입력해주세요.' })).unwrap()
         return
      }

      if (rememberMe) localStorage.setItem('savedEmail', email)
      else localStorage.removeItem('savedEmail')

      try {
         const result = await dispatch(login({ email, password, userType: loginType })).unwrap()

         if (result?.token) {
            if (rememberMe) {
               localStorage.setItem('token', result.token)
               sessionStorage.removeItem('token')
            } else {
               sessionStorage.setItem('token', result.token)
               localStorage.removeItem('token')
            }
         }

         // 로그인 성공 후 프로필 조회 및 userName 저장
         const profile = await dispatch(getProfile()).unwrap()
         if (profile?.name) {
            localStorage.setItem('userName', profile.name)
            setUserName(profile.name)
         }

         await dispatch(showModalThunk({ type: 'alert', placeholder: '로그인 되었습니다.' })).unwrap()
         await dispatch(fetchNotifications())
      } catch (err) {
         console.error('로그인 실패:', err)
      }
   }

   const handleLogout = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token && token.trim() !== '') {
         dispatch(logout()).finally(() => {
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
            localStorage.removeItem('userName') // ✅ userName 제거
            sessionStorage.removeItem('userName')
            setUserName('') // 상태 초기화
            if (!rememberMe) {
               localStorage.removeItem('savedEmail')
               setEmail('')
               setRememberMe(false)
            }
            setPassword('')
            navigate('/')
         })
      } else {
         dispatch({ type: 'auth/resetAuthState' })
         localStorage.removeItem('token')
         sessionStorage.removeItem('token')
         localStorage.removeItem('userName') // ✅ userName 제거
         sessionStorage.removeItem('userName')
         setUserName('')
         if (!rememberMe) {
            localStorage.removeItem('savedEmail')
            setEmail('')
            setRememberMe(false)
         }
         setPassword('')
         navigate('/')
      }
   }

   const getKakaoAuthUrl = () => {
      const base = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_APP_KAKAO_LOGIN_REST}`
      const redirect = encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)
      return `${base}&redirect_uri=${redirect}&response_type=code&scope=profile_nickname&prompt=login&state=${rememberMe}`
   }

   const handleForgotPassword = async () => {
      try {
         const tempPassword = await dispatch(showModalThunk({ type: 'pw', placeholder: '비밀번호 찾기' })).unwrap()
         if (tempPassword) {
            console.log('임시 비밀번호:', tempPassword)
         }
      } catch (err) {
         console.error(err)
      }
   }

   return (
      <div className="card shadow-sm p-4">
         {/* 알림 드롭다운 props 콘솔 출력 */}
         {isAuthenticated && user && <>{console.log('[NotificationDropdown props]', { notifications, unreadCount, user })}</>}
         {isAuthenticated && user ? (
            user.access === 'user' ? (
               <>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                     <h5 className="mb-0">{user.name}님 환영합니다 🎉</h5>
                     <NotificationDropdown show={showDropdown} onClose={() => setShowDropdown(false)} onToggle={() => setShowDropdown((prev) => !prev)} notifications={notifications} unreadCount={unreadCount} />
                  </div>
                  <div className="isLogin mb-4">
                     <div className="link_btn_group">
                        <Link to="myinfo/" className="link_btn">
                           <FontAwesomeIcon icon={faUser} />
                           <p>내 정보</p>
                        </Link>
                        <Link to="myinfo/plansettings" className="link_btn">
                           <FontAwesomeIcon icon={faMobileScreenButton} />
                           <p>내 요금제</p>
                        </Link>
                        <Link to="myinfo/billing" className="link_btn">
                           <FontAwesomeIcon icon={faCalculator} />
                           <p>내 청구서</p>
                        </Link>
                     </div>
                  </div>
                  <div className="text-center">
                     <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                        로그아웃
                     </button>
                  </div>
               </>
            ) : (
               <div>
                  <p>기업 회원 로그인</p>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                     <h5 className="mb-0">{userName || user.name}님 환영합니다 🎉</h5>
                     <NotificationDropdown show={showDropdown} onClose={() => setShowDropdown(false)} onToggle={() => setShowDropdown((prev) => !prev)} notifications={notifications} unreadCount={unreadCount} />
                  </div>
                  <div className="isLogin mb-4">
                     <div className="link_btn_group">
                        <Link to="/agency/agencySettings" className="link_btn">
                           <FontAwesomeIcon icon={faUser} />
                           <p>정보 관리</p>
                        </Link>
                        <Link to="/agency/plans" className="link_btn ">
                           <FontAwesomeIcon icon={faMobileScreenButton} />
                           <p>요금제 관리</p>
                        </Link>
                     </div>
                  </div>
                  <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                     로그아웃
                  </button>
               </div>
            )
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

               <div className="text-group">
                  <form
                     onSubmit={(e) => {
                        e.preventDefault()
                        handleLogin()
                     }}
                  >
                     <input type="email" name="email" required placeholder="아이디" value={email} onChange={(e) => setEmail(e.target.value)} className="login-textfield col-12 mb-4" />
                     <input type="password" name="password" required placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} className="login-textfield col-12 mb-4" />

                     <div className="sub-func mb-4 justify-content-between align-items-center d-flex">
                        <div className="sub-func-content">
                           <input type="checkbox" id="rememberMe" className="me-2" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                           <label htmlFor="rememberMe" className="me-3">
                              아이디 저장
                           </label>
                        </div>
                        <div className="sub-func-content">
                           <button className="btn btn-link p-0 m-0 align-baseline" type="button" onClick={handleForgotPassword}>
                              비밀번호 찾기
                           </button>
                        </div>
                     </div>

                     <div className="login-btn">
                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                           {loading ? '로그인 중...' : '로그인'}
                        </button>
                     </div>
                  </form>
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
