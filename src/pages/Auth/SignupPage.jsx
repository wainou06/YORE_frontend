import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faComment } from '@fortawesome/free-solid-svg-icons'

const SignupPage = () => {
   const navigate = useNavigate()
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

   const handleSubmit = (e) => {
      e.preventDefault()
      // TODO: 회원가입 API 연동
      console.log('회원가입 데이터:', { userType, ...formData })
   }

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

                     {/* 소셜 로그인 */}
                     {userType === 'personal' && (
                        <div className="d-grid gap-2 mb-4">
                           <button className="btn btn-warning">
                              <FontAwesomeIcon icon={faComment} className="me-2" />
                              카카오로 시작하기
                           </button>
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
                           <button type="submit" className="btn btn-primary">
                              회원가입
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
