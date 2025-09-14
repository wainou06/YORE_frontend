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

   // 데이터 매핑
   const planName = userPlanBill?.planName || ''
   const status = userPlanBill?.status || ''
   const startDate = userPlanBill?.startDate ? new Date(userPlanBill.startDate).toLocaleDateString() : ''
   const transaction = userPlanBill?.transaction
   const monthlyFee = transaction?.installmentAmount || transaction?.amount || ''
   const paymentDate = transaction?.date ? new Date(transaction.date).toLocaleDateString() : ''
   const paymentMethod = transaction?.paymentMethod || ''

   return (
      <div className="container content_box py-4">
         {error ? (
            <div className="alert alert-danger">{typeof error === 'string' ? error : error.message}</div>
         ) : (
            <>
               <div className="row g-4">
                  {/* 1. 내 요금제 정보 */}
                  <div className="col-12">
                     <div className="card p-3 shadow-sm">
                        <h5 className="card-title">내 요금제 정보</h5>
                        <p>요금제: {planName || '불러오는 중...'}</p>
                        <p>상태: {status || '불러오는 중...'}</p>
                        <p>개통일: {startDate || '불러오는 중...'}</p>
                     </div>
                  </div>

                  {/* 2. 납부 정보 */}
                  <div className="col-12">
                     <div className="card p-3 shadow-sm">
                        <h5 className="card-title">납부 정보</h5>
                        <p>월 요금: {monthlyFee || '불러오는 중...'}</p>
                        <p>납부일: {paymentDate || '불러오는 중...'}</p>
                        <p>결제수단: {paymentMethod || '불러오는 중...'}</p>
                     </div>
                  </div>
               </div>
               {loading && <div className="text-center my-3">불러오는 중...</div>}
            </>
         )}
      </div>
   )
}

export default Billing
