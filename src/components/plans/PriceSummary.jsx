import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { createTransaction } from '@/features/transactions/transactionSlice'
import { createUserPlan } from '@/features/userPlans/userPlanSlice'

import { useRef, useEffect } from 'react'

const PriceSummary = ({ plan: propPlan, options }) => {
   const dispatch = useDispatch()
   // plan을 전역에서 가져오되, props(plan)가 있으면 우선 사용
   const planFromStore = useSelector((state) => state.plans.plan)
   const plan = propPlan || planFromStore
   const user = useSelector((state) => state.auth.user)
   const [processing, setProcessing] = useState(false)
   const [success, setSuccess] = useState(false)
   const [errorMsg, setErrorMsg] = useState('')
   // 결제 방식/할부 상태
   const [paymentMethod, setPaymentMethod] = useState('card')
   const [installment, setInstallment] = useState(false)
   const [installmentMonths, setInstallmentMonths] = useState(3)

   // 최신 userId, planId를 항상 참조하기 위한 ref
   const userIdRef = useRef(user?.id)
   const planIdRef = useRef(plan?.id)
   useEffect(() => {
      userIdRef.current = user?.id
   }, [user?.id])
   useEffect(() => {
      planIdRef.current = plan?.id
   }, [plan?.id])

   // 가격 계산
   const finalPrice = plan.finalPrice ?? 0
   // 나이 할인: 65세 이상 10%, 20세 미만 20%, 20~24세 15%, 그 외 0%
   const ageDiscount = options.age >= 65 ? 0.9 : options.age < 20 ? 0.8 : options.age <= 24 ? 0.85 : 1
   const contractDiscount = options.contract === 24 ? 0.85 : options.contract === 12 ? 0.9 : 1
   const serviceTotal = options.services?.reduce((acc, s) => acc + (s.price ?? s.fee ?? 0), 0) || 0
   const totalPrice = Math.round(finalPrice * ageDiscount * contractDiscount + serviceTotal)
   let points = 0
   if (options.contract === 12) points = 500
   else if (options.contract === 24) points = 1000

   // 가입/결제 처리
   const handleJoin = async () => {
      setProcessing(true)
      setErrorMsg('')
      setSuccess(false)
      try {
         // total_fee, monthly_fee 계산 (total_fee는 totalPrice로)
         const total_fee = totalPrice
         let monthly_fee = totalPrice
         if (options.contract === 12 || options.contract === 24) {
            monthly_fee = Math.ceil(total_fee / Number(options.contract))
         }
         // 1. userPlan 생성 (항상 최신 userId, planId 사용)
         const userPlanRes = await dispatch(
            createUserPlan({
               userId: userIdRef.current,
               planId: planIdRef.current,
               total_fee,
               monthly_fee,
            })
         ).unwrap()
         const userPlanId = userPlanRes.data?.id || userPlanRes.id
         // 2. 결제 생성
         const transactionPayload = {
            userId: userIdRef.current,
            userPlanId,
            amount: totalPrice,
            paymentMethod,
            date: new Date().toISOString(),
            isInstallment: paymentMethod === 'card' ? installment : false,
            installmentMonths: paymentMethod === 'card' && installment ? Number(installmentMonths) : null,
            installmentAmount: paymentMethod === 'card' && installment ? Math.ceil(totalPrice / Number(installmentMonths)) : null,
         }
         console.log('결제 요청 payload', transactionPayload)
         await dispatch(createTransaction(transactionPayload)).unwrap()
         setSuccess(true)
      } catch (err) {
         setErrorMsg(typeof err === 'string' ? err : err?.message || '가입/결제 실패')
      } finally {
         setProcessing(false)
      }
   }

   return (
      <div className="card shadow-sm">
         <div className="card-body">
            <h5 className="card-title mb-4">가격 요약</h5>

            <div className="d-flex justify-content-between mb-2">
               <span>기본 요금</span>
               <span>{finalPrice.toLocaleString()}원</span>
            </div>

            {options.age && (
               <div className="d-flex justify-content-between mb-2">
                  <span>나이 할인</span>
                  <span className="text-primary">{options.age >= 65 ? '10%' : options.age < 20 ? '20%' : options.age <= 24 ? '15%' : '0%'} 할인</span>
               </div>
            )}

            {options.contract && (
               <div className="d-flex justify-content-between mb-2">
                  <span>약정 할인</span>
                  <span className="text-primary">{options.contract === 24 ? '15%' : options.contract === 12 ? '10%' : '0%'} 할인</span>
               </div>
            )}

            {options.services?.length > 0 && (
               <>
                  <div className="d-flex justify-content-between mb-2">
                     <span>부가 서비스</span>
                     <span>{serviceTotal.toLocaleString()}원</span>
                  </div>
                  <div className="small text-muted mb-2">{options.services.map((service) => service.name).join(', ')}</div>
               </>
            )}

            {/* 결제 방식/할부 UI */}
            <div className="mb-3">
               <label className="form-label">결제 방식</label>
               <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="card">카드 결제</option>
                  <option value="bank">계좌이체</option>
               </select>
            </div>
            {paymentMethod === 'card' && (
               <div className="mb-3">
                  <div className="form-check mb-2">
                     <input className="form-check-input" type="checkbox" id="installmentCheck" checked={installment} onChange={(e) => setInstallment(e.target.checked)} />
                     <label className="form-check-label" htmlFor="installmentCheck">
                        할부 결제 사용
                     </label>
                  </div>
                  {installment && (
                     <div>
                        <label className="form-label">할부 개월 수</label>
                        <select className="form-select" value={installmentMonths} onChange={(e) => setInstallmentMonths(e.target.value)}>
                           <option value={3}>3개월</option>
                           <option value={6}>6개월</option>
                           <option value={12}>12개월</option>
                        </select>
                        <div className="small text-muted mt-1">
                           월 {Math.ceil(totalPrice / Number(installmentMonths)).toLocaleString()}원 × {installmentMonths}개월
                        </div>
                     </div>
                  )}
               </div>
            )}
            <hr />

            <div className="d-flex justify-content-between mb-2">
               <h5>최종 금액</h5>
               <h5 className="text-primary">{totalPrice.toLocaleString()}원</h5>
            </div>

            <div className="text-muted small mb-3">12개월 약정 시 적립 포인트: {points.toLocaleString()}P</div>

            {errorMsg && <div className="alert alert-danger py-2 mb-2">{errorMsg}</div>}
            {success && <div className="alert alert-success py-2 mb-2">가입 및 결제 완료!</div>}

            <button className="btn btn-primary w-100" onClick={handleJoin} disabled={processing}>
               {processing ? '처리 중...' : '가입하기'}
            </button>
         </div>
      </div>
   )
}

export default PriceSummary
