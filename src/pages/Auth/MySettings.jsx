import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProfile, selectUser, selectIsAuthenticated, changePassword, updateProfile, changeBirth } from '@features/auth/authSlice'
import authAPI from '@/api/authApi'
import { showModalThunk } from '../../features/modal/modalSlice'
import '@assets/css/MySettings.css'

const MySettings = () => {
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

   useEffect(() => {
      if (isAuthenticated && user) {
         setUserName(user.name)
         setEmail(user.email)
         setBirth(user.birth || '')
      } else {
         dispatch(getProfile())
            .unwrap()
            .then((profile) => {
               setUserName(profile.user.name)
               setEmail(profile.user.email)
               setBirth(profile.user.birth || '')
            })
            .catch(() => navigate('/'))
      }
   }, [dispatch, isAuthenticated, user, navigate])

   const handleChangePassword = () => {
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
         .then((res) => {
            if (res.success) {
               dispatch(showModalThunk({ type: 'alert', placeholder: '비밀번호가 변경되었습니다.' }))
               setCurrentPassword('')
               setNewPassword('')
               setConfirmPassword('')
            } else {
               const msg = res.message || '비밀번호 변경에 실패했습니다.'
               dispatch(showModalThunk({ type: 'alert', placeholder: msg }))
            }
         })
         .catch((err) => {
            const msg = err?.message || err?.data?.message || err?.response?.data?.message || '입력값 검증 실패'
            dispatch(showModalThunk({ type: 'alert', placeholder: msg }))
         })
   }

   const handleChangeEmail = () => {
      if (!newEmail) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '이메일을 입력해주세요.' }))
         return
      }

      dispatch(updateProfile({ email: newEmail }))
         .unwrap()
         .then((res) => {
            if (res.success) {
               dispatch(showModalThunk({ type: 'alert', placeholder: '이메일이 변경되었습니다.' }))
               setEmail(newEmail)
               setNewEmail('')
            } else {
               const msg = res.message || (res.errors && res.errors[0]?.msg) || '이메일 변경에 실패했습니다.'
               dispatch(showModalThunk({ type: 'alert', placeholder: msg }))
            }
         })
         .catch((err) => {
            let msg = ''
            if (typeof err === 'string') {
               msg = err
            } else {
               msg = err?.message || err?.errors?.[0]?.msg || err?.data?.message || err?.response?.data?.message || '입력값 검증 실패'
            }
            dispatch(showModalThunk({ type: 'alert', placeholder: msg }))
         })
   }

   const handleChangeBirth = () => {
      if (!birth) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '생일을 입력해주세요.' }))
         return
      }

      dispatch(changeBirth({ birth }))
         .unwrap()
         .then((res) => {
            if (res.success) {
               dispatch(showModalThunk({ type: 'alert', placeholder: '생일이 업데이트 되었습니다.' }))
            } else {
               const msg = res.message || '생일 업데이트에 실패했습니다.'
               dispatch(showModalThunk({ type: 'alert', placeholder: msg }))
            }
         })
         .catch((err) => {
            const msg = err?.message || err?.data?.message || err?.response?.data?.message || '입력값 검증 실패'
            dispatch(showModalThunk({ type: 'alert', placeholder: msg }))
         })
   }

   const handleDeleteAccount = async () => {
      try {
         const res = await authAPI.deleteAccount()
         if (res.data.success) {
            localStorage.removeItem('token')
            navigate('/')
            dispatch(showModalThunk({ type: 'alert', placeholder: '회원 탈퇴에 성공했습니다.' }))
         } else {
            dispatch(showModalThunk({ type: 'alert', placeholder: '회원 탈퇴에 실패했습니다.' }))
         }
      } catch (err) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '회원 탈퇴중 오류가 발생했습니다.' }))
      }
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
                           <button className="btn custom-btn" onClick={handleChangePassword}>
                              변경
                           </button>
                        </div>
                     </div>

                     <div className="card p-3 shadow-none border-0 mt-3">
                        <h5 className="card-title mb-4">이메일 변경</h5>
                        <input type="email" placeholder={email || '이메일 입력'} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="form-control mb-2" />
                        <div className="d-flex justify-content-end">
                           <button className="btn custom-btn" onClick={handleChangeEmail}>
                              변경
                           </button>
                        </div>
                     </div>

                     <div className="card p-3 shadow-none border-0 mt-3">
                        <h5 className="card-title">생일 입력</h5>
                        <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="form-control mb-2" />
                        <div className="d-flex justify-content-end">
                           <button className="btn custom-btn" onClick={handleChangeBirth}>
                              저장
                           </button>
                        </div>
                     </div>

                     <div className="card p-3 shadow-none border-0 mt-3">
                        <h5 className="card-title mb-4">회원 탈퇴</h5>
                        <div className="d-flex justify-content-end">
                           <button className="btn btn-danger" onClick={handleDeleteAccount}>
                              탈퇴
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="col-12 col-md-4 d-none d-md-flex align-items-start justify-content-center">
                     <img src="/images/settings.png" alt="세팅 이미지" className="img-fluid responsive-settings" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default MySettings
