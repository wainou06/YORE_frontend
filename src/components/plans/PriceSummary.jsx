import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { calculateTotalPrice, calculatePoints } from '@features/plans/pricing'

const PriceSummary = ({ plan, options, onCheckout }) => {
   const totalPrice = calculateTotalPrice(plan.price, options)
   const points = calculatePoints(totalPrice, options.contract || 1)

   return (
      <div className="card shadow-sm">
         <div className="card-body">
            <h5 className="card-title mb-4">가격 요약</h5>

            <div className="d-flex justify-content-between mb-2">
               <span>기본 요금</span>
               <span>{plan.price.toLocaleString()}원</span>
            </div>

            {options.age && (
               <div className="d-flex justify-content-between mb-2">
                  <span>나이 할인</span>
                  <span className="text-primary">{options.age >= 65 ? '10%' : options.age <= 24 ? '15%' : '0%'} 할인</span>
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
                     <span>{options.services.reduce((acc, service) => acc + service.price, 0).toLocaleString()}원</span>
                  </div>
                  <div className="small text-muted mb-2">{options.services.map((service) => service.name).join(', ')}</div>
               </>
            )}

            <hr />

            <div className="d-flex justify-content-between mb-2">
               <h5>최종 금액</h5>
               <h5 className="text-primary">{totalPrice.toLocaleString()}원</h5>
            </div>

            <div className="text-muted small mb-3">12개월 약정 시 적립 포인트: {points.toLocaleString()}P</div>

            <button className="btn btn-primary w-100" onClick={() => onCheckout({ totalPrice, points })}>
               가입하기
            </button>
         </div>
      </div>
   )
}

export default PriceSummary
