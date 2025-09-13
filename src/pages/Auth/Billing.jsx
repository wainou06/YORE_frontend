import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProfile, selectUser, selectIsAuthenticated } from '@features/auth/authSlice'
import '@assets/css/Billing.css'

const API_BASE = `${import.meta.env.VITE_APP_API_URL}/auth`

const Billing = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const user = useSelector(selectUser)
   const isAuthenticated = useSelector(selectIsAuthenticated)

   const [billingInfo, setBillingInfo] = useState({
      planName: '',
      activationDate: '',
      monthlyFee: '',
      paymentDate: '',
      paymentMethod: '',
   })

   // 로그인 확인 및 프로필 가져오기
   useEffect(() => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')

      if (isAuthenticated && user) {
         fetchBilling(token)
      } else if (token) {
         dispatch(getProfile())
            .unwrap()
            .then(() => fetchBilling(token))
            .catch(() => navigate('/'))
      } else {
         navigate('/')
      }
   }, [dispatch, isAuthenticated, user, navigate])

   // fetch API를 이용한 청구서 정보 가져오기
   const fetchBilling = async (token) => {
      try {
         const res = await fetch(`${API_BASE}/billing`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         })

         if (!res.ok) {
            throw new Error('청구서 데이터 불러오기 실패')
         }

         const data = await res.json()
         if (data.success) {
            setBillingInfo({
               planName: data.planName,
               activationDate: data.activationDate,
               monthlyFee: data.monthlyFee,
               paymentDate: data.paymentDate,
               paymentMethod: data.paymentMethod,
            })
         } else {
            console.error('청구서 데이터 불러오기 실패')
         }
      } catch (err) {
         console.error('서버 오류 발생', err)
      }
   }

   return (
      <div className="container content_box py-4">
         <div className="row g-4">
            {/* 1. 내 요금제 정보 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">내 요금제 정보</h5>
                  <p>요금제: {billingInfo.planName || '불러오는 중...'}</p>
                  <p>상태: {billingInfo.activationDate || '불러오는 중...'}</p>
                  <p>개통일: {billingInfo.activationDate || '불러오는 중...'}</p>
               </div>
            </div>

            {/* 2. 납부 정보 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">납부 정보</h5>
                  <p>월 요금: {billingInfo.monthlyFee || '불러오는 중...'}</p>
                  <p>납부 기간: {billingInfo.paymentDate || '불러오는 중...'}</p>
                  <p>총 결제 가격: {billingInfo.paymentMethod || '불러오는 중...'}</p>
               </div>
            </div>

            {/* 3. 더미 데이터 섹션 */}
            <div className="col-12">
               <div className="card p-3 shadow-sm">
                  <h5 className="card-title">부가 서비스</h5>
                  <p>부가 서비스: {billingInfo.monthlyFee || '불러오는 중...'}</p>
                  <p>제공자: {billingInfo.paymentDate || '불러오는 중...'}</p>
                  <p>요금: {billingInfo.paymentMethod || '불러오는 중...'}</p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Billing
