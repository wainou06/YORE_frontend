import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProfile, selectUser, selectIsAuthenticated, changePassword, updateProfile, updateAgencyProfile } from '@features/auth/authSlice'
import { showModalThunk } from '../../features/modal/modalSlice'
import '@assets/css/MySettings.css'

const AgencySettings = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const user = useSelector(selectUser)
   const isAuthenticated = useSelector(selectIsAuthenticated)

   const [userName, setUserName] = useState('')
   const [email, setEmail] = useState('')
   const [currentPassword, setCurrentPassword] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [newEmail, setNewEmail] = useState('')

   const [agencyName, setAgencyName] = useState('')
   const [businessNumber, setBusinessNumber] = useState('')

   useEffect(() => {
      if (isAuthenticated && user) {
         setUserName(user.name)
         setEmail(user.email)
         if (user.agency) {
            setAgencyName(user.agency.agencyName || '')
            setBusinessNumber(user.agency.businessNumber || '')
         }
      } else {
         dispatch(getProfile())
            .unwrap()
            .then((profile) => {
               setUserName(profile.user.name)
               setEmail(profile.user.email)
               if (profile.user.agency) {
                  setAgencyName(profile.user.agency.agencyName || '')
                  setBusinessNumber(profile.user.agency.businessNumber || '')
               }
            })
            .catch(() => navigate('/'))
      }
   }, [dispatch, isAuthenticated, user, navigate])

   const handlePasswordChange = () => {
      if (!currentPassword || !newPassword || !confirmPassword) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '모든 필드를 입력해주세요.' }))
         return
      }
      if (newPassword !== confirmPassword) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.' }))
         return
      }

      dispatch(changePassword({ currentPassword, newPassword }))
         .unwrap()
         .then(() => {
            dispatch(showModalThunk({ type: 'alert', placeholder: '비밀번호가 변경되었습니다.' }))
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
         })
         .catch((err) => alert(err))
   }

   const handleEmailChange = () => {
      if (!newEmail) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '이메일을 입력해주세요.' }))
         return
      }

      dispatch(updateProfile({ email: newEmail }))
         .unwrap()
         .then(() => {
            dispatch(showModalThunk({ type: 'alert', placeholder: '이메일이 변경되었습니다.' }))
            setEmail(newEmail)
            setNewEmail('')
         })
         .catch((err) => alert(err))
   }

   const handleChangeAgencyInfo = () => {
      if (!agencyName || !businessNumber) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '모든 필드를 입력해주세요.' }))
         return
      }
      if (businessNumber.length < 10) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '사업자 등록번호를 확인해주세요.' }))
         return
      }

      dispatch(updateAgencyProfile({ agencyName, businessNumber }))
         .unwrap()
         .then(() => dispatch(showModalThunk({ type: 'alert', placeholder: '기업 정보가 업데이트 되었습니다.' })))
         .catch((err) => alert(err))
   }

   return (
      <div className="container content_box py-5">
         <div className="row justify-content-center">
            <div className="col-md-10">
               <div className="row g-4">
                  <div className="col-12 col-md-8">
                     <div className="card p-3 shadow-none border-0 mt-3">
                        <h5 className="card-title mb-4">비밀번호 변경</h5>
                        <input type="password" placeholder="현재 비밀번호" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-control mb-2" />
                        <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control mb-2" />
                        <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control mb-2" />
                        <div className="d-flex justify-content-end">
                           <button className="btn custom-btn" onClick={handlePasswordChange}>
                              변경
                           </button>
                        </div>
                     </div>

                     <div className="card p-3 shadow-none border-0 mt-3">
                        <h5 className="card-title mb-4">이메일 변경</h5>
                        <input type="email" placeholder={email || '이메일 입력'} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="form-control mb-2" />
                        <div className="d-flex justify-content-end">
                           <button className="btn custom-btn" onClick={handleEmailChange}>
                              변경
                           </button>
                        </div>
                     </div>

                     <div className="card p-3 shadow-none border-0 mt-3">
                        <h5 className="card-title mb-3">에이전시 정보</h5>
                        <input type="text" placeholder="에이전시 이름" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="form-control mb-2" />
                        <input type="text" placeholder="사업자 번호" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} className="form-control mb-2" />
                        <div className="d-flex justify-content-end">
                           <button className="btn custom-btn" onClick={handleChangeAgencyInfo}>
                              변경
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="col-12 col-md-4 d-none d-md-flex align-items-start justify-content-center">
                     <img src="/src/assets/images/settings.png" alt="세팅 이미지" className="img-fluid responsive-settings" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AgencySettings
