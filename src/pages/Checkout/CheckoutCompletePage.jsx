import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { portoneService } from '@services/portone'
import { paymentSuccess, paymentFailure } from '@features/checkout/checkoutSlice'

const CheckoutCompletePage = () => {
   const [status, setStatus] = useState('loading')
   const [error, setError] = useState(null)
   const location = useLocation()
   const navigate = useNavigate()
   const dispatch = useDispatch()

   useEffect(() => {
      const verifyPayment = async () => {
         try {
            // URL 파라미터에서 결제 정보 추출
            const searchParams = new URLSearchParams(location.search)
            const paymentId = searchParams.get('paymentId')
            const success = searchParams.get('success') === 'true'

            if (!paymentId) {
               throw new Error('결제 정보를 찾을 수 없습니다.')
            }

            if (!success) {
               throw new Error('결제가 취소되었습니다.')
            }

            // 결제 상태 확인
            const paymentStatus = await portoneService.getPaymentStatus(paymentId)

            if (paymentStatus.status === 'DONE') {
               dispatch(paymentSuccess(paymentStatus))
               setStatus('success')
            } else {
               throw new Error('결제가 완료되지 않았습니다.')
            }
         } catch (error) {
            setError(error.message)
            setStatus('error')
            dispatch(paymentFailure(error.message))
         }
      }

      verifyPayment()
   }, [location, dispatch])

   const handleGoToOrders = () => {
      navigate('/profile/orders')
   }

   const handleRetry = () => {
      navigate('/checkout')
   }

   if (status === 'loading') {
      return (
         <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">로딩중...</span>
            </div>
            <p className="mt-3">결제 확인 중입니다...</p>
         </div>
      )
   }

   if (status === 'error') {
      return (
         <div className="container py-5 text-center">
            <div className="alert alert-danger" role="alert">
               <h4 className="alert-heading">결제 실패</h4>
               <p>{error}</p>
            </div>
            <button className="btn btn-primary me-2" onClick={handleRetry}>
               다시 시도
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/plans')}>
               요금제 선택으로 돌아가기
            </button>
         </div>
      )
   }

   return (
      <div className="container py-5 text-center">
         <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
            <div className="card-body">
               <div className="text-success mb-4">
                  <i className="fas fa-check-circle fa-4x"></i>
               </div>
               <h3 className="card-title mb-4">결제가 완료되었습니다!</h3>
               <p className="card-text text-muted mb-4">결제 내역은 마이페이지에서 확인하실 수 있습니다.</p>
               <button className="btn btn-primary btn-lg w-100" onClick={handleGoToOrders}>
                  주문 내역 보기
               </button>
            </div>
         </div>
      </div>
   )
}

export default CheckoutCompletePage
