import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faComment } from '@fortawesome/free-solid-svg-icons'

const LoginWidget = () => {
   const [userType, setUserType] = useState('personal') // 'personal' or 'business'

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

         <div className="d-grid gap-3">
            <button className="btn btn-outline-dark">
               <FontAwesomeIcon icon={faGoogle} className="me-2" />
               Google로 로그인
            </button>
            <button className="btn btn-warning">
               <FontAwesomeIcon icon={faComment} className="me-2" />
               카카오로 로그인
            </button>
         </div>

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
