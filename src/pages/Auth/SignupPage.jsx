import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { register, selectAuthError, selectAuthLoading } from '@features/auth/authSlice'
import { showModalThunk } from '../../features/modal/modalSlice'

const SignupPage = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const error = useSelector(selectAuthError)
   const loading = useSelector(selectAuthLoading)
   const [userType, setUserType] = useState('personal')
   const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      businessNumber: '', // 기업회원 전용
      companyName: '', // 기업회원 전용
   })

   const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()

      // 비밀번호 확인
      if (formData.password !== formData.confirmPassword) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '비밀번호가 일치하지 않습니다.' }))
         return
      }

      const userData = {
         email: formData.email,
         password: formData.password,
         name: formData.name,
         userid: formData.email.split('@')[0], // userid 자동 생성 (이메일 앞부분 사용)
         phone: formData.phone,
         access: userType === 'personal' ? 'user' : 'agency',
         // 기업회원인 경우 추가 정보
         ...(userType === 'business' && {
            agency: {
               businessNumber: formData.businessNumber,
               agencyName: formData.companyName,
               managerName: formData.name,
            },
         }),
      }

      try {
         const resultAction = await dispatch(register(userData))
         if (register.fulfilled.match(resultAction)) {
            dispatch(showModalThunk({ type: 'alert', placeholder: '회원가입에 성공하였습니다.' }))
            navigate('/')
         }
      } catch (err) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '회원가입에 실패하였습니다.' }))
      }
   }

   // 에러 처리
   useEffect(() => {
      if (error) {
         dispatch(showModalThunk({ type: 'alert', placeholder: `${error}` }))
      }
   }, [error])

   const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_APP_KAKAO_LOGIN_REST}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI)}&response_type=code&scope=profile_nickname&prompt=login`

   return (
      <div className="container py-5">
         <div className="row justify-content-center">
            <div className="col-md-6">
               <div className="card shadow-sm">
                  <div className="card-body p-4">
                     <h2 className="text-center mb-4">회원가입</h2>

                     {/* 회원 유형 선택 */}
                     <div className="btn-group w-100 mb-4">
                        <button type="button" className={`btn ${userType === 'personal' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUserType('personal')}>
                           개인회원
                        </button>
                        <button type="button" className={`btn ${userType === 'business' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUserType('business')}>
                           기업회원
                        </button>
                     </div>

                     {userType === 'personal' && (
                        <div className="d-grid gap-3">
                           <a href={KAKAO_AUTH_URL} className="btn btn-warning w-100">
                              <FontAwesomeIcon icon={faComment} className="me-2" />
                              카카오로 시작하기
                           </a>
                        </div>
                     )}

                     <hr className="my-4" />

                     {/* 회원가입 폼 */}
                     <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                           <label className="form-label">이메일</label>
                           <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                           <label className="form-label">비밀번호</label>
                           <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                           <label className="form-label">비밀번호 확인</label>
                           <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                           <label className="form-label">{userType === 'business' ? '담당자명' : '이름'}</label>
                           <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                           <label className="form-label">휴대폰 번호</label>
                           <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                        </div>

                        {userType === 'business' && (
                           <>
                              <div className="mb-3">
                                 <label className="form-label">사업자등록번호</label>
                                 <input type="text" name="businessNumber" className="form-control" value={formData.businessNumber} onChange={handleChange} required />
                              </div>

                              <div className="mb-3">
                                 <label className="form-label">회사명</label>
                                 <input type="text" name="companyName" className="form-control" value={formData.companyName} onChange={handleChange} required />
                              </div>
                           </>
                        )}

                        <div className="d-grid gap-2">
                           <button type="submit" className="btn btn-primary" disabled={loading}>
                              {loading ? '처리중...' : '회원가입'}
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default SignupPage
