import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { getProfile, selectUser, selectIsAuthenticated } from '@features/auth/authSlice'
import '@assets/css/MySettings.css'

const API_BASE = `${import.meta.env.VITE_APP_API_URL}/auth`

const MySettings = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   // Redux에서 로그인 상태와 사용자 정보 가져오기
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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')

      if (isAuthenticated && user) {
         setUserName(user.name)
         setEmail(user.email)
      } else if (token) {
         dispatch(getProfile())
            .unwrap()
            .then((profile) => {
               setUserName(profile.name)
               setEmail(profile.email)
            })
            .catch((err) => {
               console.error('프로필 불러오기 실패', err)
               navigate('/')
            })
      } else {
         navigate('/')
      }
   }, [dispatch, isAuthenticated, user, navigate])

   const token = localStorage.getItem('token') || sessionStorage.getItem('token')
   const headers = { Authorization: `Bearer ${token}` }

   const handleChangePassword = async () => {
      if (!currentPassword || !newPassword || !confirmPassword) {
         alert('모든 비밀번호 필드를 입력해주세요.')
         return
      }
      if (newPassword !== confirmPassword) {
         alert('새 비밀번호와 확인이 일치하지 않습니다.')
         return
      }

      try {
         const res = await axios.post(`${API_BASE}/change-password`, { currentPassword, newPassword }, { headers })
         if (res.data.success) {
            alert('비밀번호가 변경되었습니다.')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
         } else {
            alert(res.data.message || '현재 비밀번호가 일치하지 않습니다.')
         }
      } catch (err) {
         console.error(err)
         alert('서버 오류가 발생했습니다.')
      }
   }

   // 2. 이메일 변경
   const handleChangeEmail = async () => {
      if (!newEmail) {
         alert('이메일을 입력해주세요.')
         return
      }

      try {
         const res = await axios.post(`${API_BASE}/change-email`, { newEmail }, { headers })
         if (res.data.success) {
            alert('이메일이 변경되었습니다.')
            setEmail(newEmail)
            setNewEmail('')
         } else {
            alert(res.data.message || '이미 존재하는 이메일입니다.')
         }
      } catch (err) {
         console.error(err)
         alert('서버 오류가 발생했습니다.')
      }
   }

   // 3. 생일 입력
   const handleChangeBirth = async () => {
      if (!birth) {
         alert('생일을 입력해주세요.')
         return
      }

      try {
         const res = await axios.post(`${API_BASE}/change-birth`, { birth }, { headers })
         if (res.data.success) {
            alert('생일이 업데이트되었습니다.')
         } else {
            alert('업데이트 실패')
         }
      } catch (err) {
         console.error(err)
         alert('서버 오류가 발생했습니다.')
      }
   }

   return (
      <div className="container content_box py-4">
         <div className="row g-4">
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

            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">이메일 변경</h5>
                  <input type="email" placeholder={email || '이메일 입력'} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="form-control mb-2" />
                  <button className="btn btn-primary w-100" onClick={handleChangeEmail}>
                     변경
                  </button>
               </div>
            </div>

            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">생일 입력</h5>
                  <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="form-control mb-2" />
                  <button className="btn btn-primary w-100" onClick={handleChangeBirth}>
                     저장
                  </button>
               </div>
            </div>

            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">추가 정보 1</h5>
                  <p className="card-text">더미 데이터</p>
               </div>
            </div>

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
