import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import '../../assets/css/LoginWidget.css'

const LoginWidget = () => {
   const [userType, setUserType] = useState('personal') // 'personal' or 'business'
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   return (
      <div className="card shadow-sm p-4">
         <div className="btn-group w-100 mb-4">
            <button className={`btn ${userType === 'personal' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUserType('personal')}>
               개인회원
            </button>
            <button className={`btn ${userType === 'business' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUserType('business')}>
               기업회원
            </button>
         </div>

         <div className="text-group mb-4">
            <input type="email" name="email" required placeholder="아이디" onChange={(e) => setEmail(e.target.value)} className="login-textfield col-12 mb-4" />
            <input type="password" name="password" required placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)} className="login-textfield col-12 " />
         </div>

         <div className="sub-func mb-4 justify-content-between align-items-center d-flex">
            <div className="sub-func-content">
               <input type="checkbox" id="rememberMe" className="me-2" />
               <label htmlFor="rememberMe" className="me-3">
                  로그인 상태 유지
               </label>
            </div>
            <div className="sub-func-content">
               <button className="btn btn-link p-0 m-0 align-baseline">비밀번호 찾기</button>
            </div>
         </div>

         <div className="login-btn mb-4">
            <button className="btn btn-primary w-100">로그인</button>
         </div>

         {userType === 'personal' && (
            <div className="d-grid gap-3">
               <button className="btn btn-warning">
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
      </div>
   )
}

export default LoginWidget
