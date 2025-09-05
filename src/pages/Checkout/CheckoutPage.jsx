import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faMoneyBill, faCoins } from '@fortawesome/free-solid-svg-icons'
import { startPayment, paymentFailure } from '@features/checkout/checkoutSlice'
import { portoneService } from '@services/portone'

const CheckoutPage = () => {
   const location = useLocation()
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { isAuthenticated } = useSelector((state) => state.auth)
   const { loading } = useSelector((state) => state.checkout)

   const [paymentMethod, setPaymentMethod] = useState('card')
   const [usePoints, setUsePoints] = useState(false)
   const [agreement, setAgreement] = useState(false)

   const checkoutData = location.state

   // 로그인 체크
   useEffect(() => {
      if (!isAuthenticated) {
         navigate('/signup', { state: { from: location } })
      }
   }, [isAuthenticated, navigate, location])

   // 체크아웃 데이터 체크
   useEffect(() => {
      if (!checkoutData) {
         navigate('/plans')
      }
   }, [checkoutData, navigate])

   const handlePayment = async () => {
      if (!agreement) {
         alert('이용약관에 동의해주세요.')
         return
      }

      dispatch(startPayment())

      try {
         const { user } = useSelector((state) => state.auth)
         const finalAmount = totalPrice - (usePoints ? Math.min(userPoints, totalPrice) : 0)

         const orderData = {
            planName: `${plan.carrier} ${plan.name}`,
            amount: finalAmount,
            customerId: user.id,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone,
         }

         const paymentRequest = await portoneService.createPaymentRequest(orderData)

         // 포트원 SDK를 통한 결제 진행
         const { IMP } = window
         IMP.init('YOUR_IMP_KEY') // TODO: 실제 포트원 상점 키로 변경 필요

         IMP.request_pay(
            {
               pg: 'test_kcp', // 테스트 모드
               pay_method: paymentMethod,
               merchant_uid: paymentRequest.merchantId,
               name: orderData.planName,
               amount: orderData.amount,
               buyer_email: orderData.customerEmail,
               buyer_name: orderData.customerName,
               buyer_tel: orderData.customerPhone,
            },
            (response) => {
               if (response.success) {
                  // 결제 성공 시 결제 완료 페이지로 이동
                  navigate('/checkout/complete', {
                     search: `?paymentId=${response.imp_uid}&success=true`,
                  })
               } else {
                  dispatch(paymentFailure(response.error_msg))
                  alert(`결제 실패: ${response.error_msg}`)
               }
            }
         )
      } catch (error) {
         dispatch(paymentFailure(error.message))
         alert('결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
   }

   if (!checkoutData) return null

   const { plan, options, totalPrice, points } = checkoutData
   const userPoints = 1000 // TODO: 실제 사용자 포인트 연동

   return (
      <div className="container py-5">
         <h2 className="text-center mb-5">결제하기</h2>

         <div className="row">
            <div className="col-lg-8">
               {/* 요금제 정보 */}
               <div className="card shadow-sm mb-4">
                  <div className="card-body">
                     <h5 className="card-title mb-4">요금제 정보</h5>

                     <div className="mb-4">
                        <div className="row">
                           <div className="col-md-6">
                              <p className="mb-1 text-muted">요금제명</p>
                              <h6>{plan.name}</h6>
                           </div>
                           <div className="col-md-6">
                              <p className="mb-1 text-muted">통신사</p>
                              <h6>{plan.carrier}</h6>
                           </div>
                        </div>
                     </div>

                     <div className="mb-4">
                        <p className="mb-1 text-muted">선택 옵션</p>
                        <ul className="list-unstyled">
                           <li>나이: {options.age}세</li>
                           <li>약정 기간: {options.contract ? `${options.contract}개월` : '무약정'}</li>
                           {options.services?.length > 0 && <li>부가 서비스: {options.services.map((service) => service.name).join(', ')}</li>}
                        </ul>
                     </div>
                  </div>
               </div>

               {/* 결제 수단 선택 */}
               <div className="card shadow-sm mb-4">
                  <div className="card-body">
                     <h5 className="card-title mb-4">결제 수단</h5>

                     <div className="mb-4">
                        <div className="d-flex gap-3">
                           <button className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPaymentMethod('card')}>
                              <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                              신용카드
                           </button>
                           <button className={`btn ${paymentMethod === 'bank' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPaymentMethod('bank')}>
                              <FontAwesomeIcon icon={faMoneyBill} className="me-2" />
                              계좌이체
                           </button>
                        </div>
                     </div>

                     {/* 포인트 사용 */}
                     <div className="mb-4">
                        <div className="form-check">
                           <input type="checkbox" className="form-check-input" id="usePoints" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
                           <label className="form-check-label" htmlFor="usePoints">
                              <FontAwesomeIcon icon={faCoins} className="text-warning me-2" />
                              포인트 사용 (보유: {userPoints.toLocaleString()}P)
                           </label>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 이용약관 */}
               <div className="card shadow-sm mb-4">
                  <div className="card-body">
                     <h5 className="card-title mb-4">이용약관</h5>

                     <div className="mb-3">
                        <div className="form-check">
                           <input type="checkbox" className="form-check-input" id="agreement" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
                           <label className="form-check-label" htmlFor="agreement">
                              서비스 이용약관, 개인정보 처리방침에 동의합니다.
                           </label>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 결제 금액 */}
            <div className="col-lg-4">
               <div className="card shadow-sm">
                  <div className="card-body">
                     <h5 className="card-title mb-4">결제 금액</h5>

                     <div className="d-flex justify-content-between mb-2">
                        <span>상품 금액</span>
                        <span>{totalPrice.toLocaleString()}원</span>
                     </div>

                     {usePoints && (
                        <div className="d-flex justify-content-between mb-2">
                           <span>포인트 사용</span>
                           <span className="text-primary">-{Math.min(userPoints, totalPrice).toLocaleString()}P</span>
                        </div>
                     )}

                     <hr />

                     <div className="d-flex justify-content-between mb-3">
                        <h5>최종 결제 금액</h5>
                        <h5 className="text-primary">{(totalPrice - (usePoints ? Math.min(userPoints, totalPrice) : 0)).toLocaleString()}원</h5>
                     </div>

                     <div className="text-muted small mb-4">적립 예정 포인트: {points.toLocaleString()}P</div>

                     <button className="btn btn-primary w-100" onClick={handlePayment} disabled={loading || !agreement}>
                        {loading ? (
                           <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              결제 중...
                           </>
                        ) : (
                           '결제하기'
                        )}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default CheckoutPage
