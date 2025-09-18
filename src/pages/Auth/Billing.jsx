import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMyUserPlanBill } from '@/features/userPlans/userPlanSlice'
import '@assets/css/Billing.css'

const Billing = () => {
   const dispatch = useDispatch()
   const { userPlanBill, loading, error } = useSelector((state) => state.userPlans)

   useEffect(() => {
      dispatch(getMyUserPlanBill())
   }, [dispatch])

   const planName = userPlanBill?.planName || ''
   const status = userPlanBill?.status || ''
   const startDate = userPlanBill?.startDate ? new Date(userPlanBill.startDate).toLocaleDateString() : ''
   const transaction = userPlanBill?.transaction
   const monthlyFee = transaction?.installmentAmount || transaction?.amount || ''
   const paymentDate = transaction?.date ? new Date(transaction.date).toLocaleDateString() : ''
   const paymentMethod = transaction?.paymentMethod || ''

   return (
      <div className="container content_box py-5">
         {error ? (
            <div className="alert alert-danger">{typeof error === 'string' ? error : error.message}</div>
         ) : (
            <div className="row justify-content-center">
               <div className="col-md-10">
                  <div className="row g-4">
                     <div className="col-12 col-md-8">
                        <div className="card p-3 shadow-none border-0 mt-3">
                           <h5 className="card-title">내 요금제 정보</h5>
                           <p>요금제: {planName || '불러오는 중...'}</p>
                           <p>상태: {status || '불러오는 중...'}</p>
                           <p>개통일: {startDate || '불러오는 중...'}</p>
                        </div>

                        <div className="card p-3 shadow-none border-0 mt-3">
                           <h5 className="card-title">납부 정보</h5>
                           <p>월 요금: {monthlyFee ? `${monthlyFee.toLocaleString()} 원` : '불러오는 중...'}</p>
                           <p>납부일: {paymentDate || '불러오는 중...'}</p>
                           <p>결제수단: {paymentMethod || '불러오는 중...'}</p>
                        </div>

                        <div className="card p-3 shadow-none border-0 mt-3">
                           <h5 className="card-title">부가 서비스</h5>
                           <p>부가 서비스: 유튜브 프리미엄</p>
                           <p>금액: 4,500원</p>
                        </div>

                        {loading && <div className="text-center my-3">불러오는 중...</div>}
                     </div>

                     <div className="col-12 col-md-4 d-none d-md-flex align-items-start justify-content-center">
                        <img src="/src/assets/images/settings.svg" alt="세팅 이미지" className="img-fluid responsive-settings" />
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}

export default Billing
