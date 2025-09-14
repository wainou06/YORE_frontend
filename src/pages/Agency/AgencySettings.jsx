import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
   getProfile,
   selectUser,
   selectIsAuthenticated,
   changePassword,
   updateProfile,
   updateAgencyProfile,
   changeBirth, // 추가 필요
} from '@features/auth/authSlice'
import '@assets/css/MySettings.css'

const AgencySettings = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const user = useSelector(selectUser)
   const isAuthenticated = useSelector(selectIsAuthenticated)

   const [userName, setUserName] = useState('')
   const [email, setEmail] = useState('')
   const [birth, setBirth] = useState('')
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
         setBirth(user.birth || '')
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
               setBirth(profile.user.birth || '')
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
         alert('모든 비밀번호 필드를 입력해주세요.')
         return
      }
      if (newPassword !== confirmPassword) {
         alert('새 비밀번호와 확인이 일치하지 않습니다.')
         return
      }

      dispatch(changePassword({ currentPassword, newPassword }))
         .unwrap()
         .then(() => {
            alert('비밀번호가 변경되었습니다.')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
         })
         .catch((err) => alert(err))
   }

   const handleEmailChange = () => {
      if (!newEmail) {
         alert('이메일을 입력해주세요.')
         return
      }

      dispatch(updateProfile({ email: newEmail }))
         .unwrap()
         .then(() => {
            alert('이메일이 변경되었습니다.')
            setEmail(newEmail)
            setNewEmail('')
         })
         .catch((err) => alert(err))
   }

   const handleBirthChange = () => {
      if (!birth) {
         alert('생일을 입력해주세요.')
         return
      }

      dispatch(changeBirth({ birth }))
         .unwrap()
         .then(() => alert('생일이 업데이트되었습니다.'))
         .catch((err) => alert(err))
   }

   const handleChangeAgencyInfo = () => {
      if (!agencyName || !businessNumber) {
         alert('에이전시 이름과 사업자 번호를 입력해주세요.')
         return
      }

      dispatch(updateAgencyProfile({ agencyName, businessNumber }))
         .unwrap()
         .then(() => alert('에이전시 정보가 업데이트되었습니다.'))
         .catch((err) => alert(err))
   }

   return (
      <div className="container content_box py-4">
         <div className="row g-4">
            {/* 비밀번호 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">비밀번호 변경</h5>
                  <input type="password" placeholder="현재 비밀번호" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-control mb-2" />
                  <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control mb-2" />
                  <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control mb-2" />
                  <button className="btn btn-primary w-100" onClick={handlePasswordChange}>
                     변경
                  </button>
               </div>
            </div>

            {/* 이메일 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">이메일 변경</h5>
                  <input type="email" placeholder={email || '이메일 입력'} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="form-control mb-2" />
                  <button className="btn btn-primary w-100" onClick={handleEmailChange}>
                     변경
                  </button>
               </div>
            </div>

            {/* 생일 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">생일 입력</h5>
                  <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="form-control mb-2" />
                  <button className="btn btn-primary w-100" onClick={handleBirthChange}>
                     저장
                  </button>
               </div>
            </div>

            {/* 에이전시 정보 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">에이전시 정보</h5>
                  <input type="text" placeholder="에이전시 이름" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="form-control mb-2" />
                  <input type="text" placeholder="사업자 번호" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} className="form-control mb-2" />
                  <button className="btn btn-primary w-100" onClick={handleChangeAgencyInfo}>
                     저장
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AgencySettings
