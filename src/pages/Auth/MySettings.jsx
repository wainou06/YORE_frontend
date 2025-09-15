import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProfile, selectUser, selectIsAuthenticated, changePassword, updateProfile, changeBirth } from '@features/auth/authSlice'
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

   // 비밀번호 변경
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
               dispatch(showModalThunk({ type: 'alert', placeholder: '비밀번호 변경에 실패했습니다.' }))
            }
         })
         .catch((err) => alert(err))
   }

   // 이메일 변경
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
               dispatch(showModalThunk({ type: 'alert', placeholder: '이메일 변경에 실패했습니다.' }))
            }
         })
         .catch((err) => alert(err))
   }

   // 생일 변경
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
               dispatch(showModalThunk({ type: 'alert', placeholder: '생일 업데이트에 실패했습니다.' }))
            }
         })
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
                  <button className="btn btn-primary w-100" onClick={handleChangePassword}>
                     변경
                  </button>
               </div>
            </div>

            {/* 이메일 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">이메일 변경</h5>
                  <input type="email" placeholder={email || '이메일 입력'} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="form-control mb-2" />
                  <button className="btn btn-primary w-100" onClick={handleChangeEmail}>
                     변경
                  </button>
               </div>
            </div>

            {/* 생일 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">생일 입력</h5>
                  <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="form-control mb-2" />
                  <button className="btn btn-primary w-100" onClick={handleChangeBirth}>
                     저장
                  </button>
               </div>
            </div>

            {/* 추가 정보 1 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">추가 정보 1</h5>
                  <p className="card-text">더미 데이터</p>
               </div>
            </div>

            {/* 추가 정보 2 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">추가 정보 2</h5>
                  <p className="card-text">더미 데이터</p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default MySettings
