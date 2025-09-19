import React from 'react'
import { useNavigate } from 'react-router-dom'
import '@assets/css/RecommendCard.css'

const RecommendPlans = ({ plans, onLike }) => {
   const navigate = useNavigate()
   const BASE_URL = import.meta.env.VITE_APP_API_URL || ''
   return (
      <div className="container">
         <h2 className="text-center mb-5">추천 요금제</h2>
         {!plans || plans.length === 0 ? (
            <div className="text-center text-muted py-5">아직 추천하는 요금제가 없습니다.</div>
         ) : (
            <div className="row g-4">
               {plans.map((plan) => (
                  <div key={plan.id} className="col-lg-3 col-md-6 col-12">
                     <div className="recommend-card">
                        <img className="recommend-card-image" src={`${BASE_URL}${plan.plan?.images?.[0]?.imgURL}` || `https://placehold.co/255x200`} alt={plan.plan?.name || ''} onClick={() => navigate(`/plans/${plan.plan?.id}`)} />
                        <div className="recommend-card-content">
                           <div className="recommend-card-title">{plan.plan?.name}</div>
                           <div className="recommend-card-description">{plan.plan?.description}</div>
                           <div className="recommend-card-info">
                              <p>추천 연령대: {plan.age}대</p>
                              <p>
                                 {plan.data}GB | {plan.voice}분 | {plan.sms}건
                              </p>
                              <p className="mb-0">약정 기간: {plan.dis}개월</p>
                           </div>
                           <div className="recommend-card-price">￦{plan.plan?.finalPrice?.toLocaleString()}</div>
                           <div
                              className="recommend-card-likes"
                              onClick={(e) => {
                                 e.stopPropagation()
                                 onLike(plan.id)
                              }}
                           >
                              ♡ {plan.likes >= 1000 ? `${(plan.likes / 1000).toFixed(1)}k` : plan.likes}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}

export default RecommendPlans
