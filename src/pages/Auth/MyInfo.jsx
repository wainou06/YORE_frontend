import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMyUserPlanBill } from '@/features/userPlans/userPlanSlice'
import { selectUser, getProfile } from '@/features/auth/authSlice'
import '@assets/css/MyInfo.css'

const Myinfo = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { userPlanBill } = useSelector((state) => state.userPlans)
   const user = useSelector(selectUser)

   const planName = userPlanBill?.planName || ''
   const transaction = userPlanBill?.transaction
   const monthlyFee = transaction?.installmentAmount || transaction?.amount || ''

   // 요금제 정보 가져오기
   useEffect(() => {
      dispatch(getMyUserPlanBill())
   }, [dispatch])

   // 새로고침 시에도 user 정보 가져오기
   useEffect(() => {
      if (!user) {
         dispatch(getProfile()) // 로그인 상태면 서버에서 user 정보 가져와서 Redux store 채움
      }
   }, [dispatch, user])

   const userName = user?.name || ''

   return (
      <div className="container content_box py-5">
         <div className="row justify-content-center">
            <div className="col-md-10">
               <div className="row g-4">
                  <div className="col-12 col-md-8">
                     <div className="col-12 mb-4">
                        <div className="text">
                           <h2>내 정보 관리</h2>
                           <p>이름: {userName}</p>
                        </div>
                        <button onClick={() => navigate('mysettings')}>개인정보 수정하기</button>
                     </div>

                     <div className="col-12 mb-4">
                        <div className="text">
                           <h2>내 요금제</h2>
                           <p>요금제: {planName}</p>
                        </div>
                        <button onClick={() => navigate('plansettings')}>요금제 관리</button>
                     </div>

                     <div className="col-12 mb-4">
                        <div className="text">
                           <h2>요금 청구서</h2>
                           <p>월 요금: {monthlyFee ? `${monthlyFee.toLocaleString()} 원` : '불러오는 중...'}</p>
                        </div>
                        <button onClick={() => navigate('billing')}>청구서 보기</button>
                     </div>

                     <div className="col-12 mb-4">
                        <div className="text">
                           <h2>고객센터</h2>
                           <p>문의하기</p>
                        </div>
                        <button>
                           <a className="nav-link" href="https://pf.kakao.com/_tFPkn/chat" target="_blank" rel="noopener noreferrer">
                              고객센터 연결
                           </a>
                        </button>
                     </div>
                  </div>

                  <div className="col-12 col-md-4 d-none d-md-flex align-items-start justify-content-center">
                     <img src="/src/assets/images/myInfo.png" alt="세팅 이미지" className="img-fluid responsive-settings" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Myinfo
