import Slider from 'react-slick'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSurveys } from '@/features/survey/surveySlice'

import carrierSKT from '@assets/images/carrier/SK.png'
import carrierKT from '@assets/images/carrier/kt.png'
import carrierLGU from '@assets/images/carrier/LGU.png'
import banner1 from '@assets/images/banner/banner1.svg'
import banner2 from '@assets/images/banner/banner2.svg'
import banner3 from '@assets/images/banner/banner3.svg'
import banner4 from '@assets/images/banner/banner4.svg'

import '@assets/css/PlanCard.css'

import LoginWidget from '@components/common/LoginWidget'
import RecommendPlans from '@components/plans/RecommendPlans'

// 기본 요금제 데이터
const defaultPlans = [
   {
      id: 1,
      name: '5GB 요금제',
      data: '5GB',
      voice: '200',
      sms: '100',
      price: 29900,
      carrier: 'SKT',
      networkType: 'LTE',
      description: '부담없는 데이터 요금제',
      features: ['데이터 소진 시 저속 무제한', '부가서비스 무료'],
   },
   {
      id: 2,
      name: '10GB 요금제',
      data: '10GB',
      voice: '300',
      sms: '200',
      price: 39900,
      carrier: 'KT',
      networkType: 'LTE',
      description: '실속있는 데이터 요금제',
      features: ['데이터 소진 시 저속 무제한', '부가서비스 2개 무료'],
   },
   {
      id: 3,
      name: '15GB 요금제',
      data: '15GB',
      voice: '무제한',
      sms: '무제한',
      price: 49900,
      carrier: 'LG U+',
      networkType: '5G',
      description: '넉넉한 데이터 요금제',
      features: ['데이터 완전 무제한', '부가서비스 3개 무료'],
   },
   {
      id: 4,
      name: '무제한 요금제',
      data: '무제한',
      voice: '무제한',
      sms: '무제한',
      price: 59900,
      carrier: 'SKT',
      networkType: '5G',
      description: '완전 무제한 요금제',
      features: ['데이터/통화/문자 무제한', '모든 부가서비스 무료'],
   },
]

const LandingPage = () => {
   const { isAuthenticated } = useSelector((state) => state.auth)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [recommendedPlans, setRecommendedPlans] = useState([])
   const surveys = useSelector((state) => state.survey)

   useEffect(() => {
      // 설문 리스트 불러오기 (최초 1회)
      dispatch(fetchSurveys())
   }, [dispatch])

   useEffect(() => {
      // surveys.surveys 배열에서 좋아요 순 정렬 및 추천 요금제 추출
      if (Array.isArray(surveys.surveys) && surveys.surveys.length > 0) {
         const sortedPlans = [...surveys.surveys]
            .map((plan) => ({ ...plan, likes: parseInt(localStorage.getItem(`plan-likes-${plan.id}`) || '0') }))
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 4)
         setRecommendedPlans(sortedPlans)
      }
   }, [surveys.surveys])

   const handleLike = (planId) => {
      const currentLikes = parseInt(localStorage.getItem(`plan-likes-${planId}`) || '0')
      const newLikes = currentLikes + 1
      localStorage.setItem(`plan-likes-${planId}`, newLikes.toString())

      // 좋아요 업데이트 후 목록 다시 정렬
      const updatedPlans = recommendedPlans.map((plan) => (plan.id === planId ? { ...plan, likes: newLikes } : plan))
      setRecommendedPlans(updatedPlans.sort((a, b) => b.likes - a.likes))
   }

   const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
   }

   return (
      <div>
         {/* 섹션 1: 배너 & 로그인 */}
         <section className="common-padding bg-sub">
            <div className="container">
               <div className="row align-items-center">
                  <div className="col-lg-8">
                     <Slider {...sliderSettings}>
                        <div>
                           <img src={banner1} alt="프로모션 1" className="img-fluid rounded" />
                        </div>
                        <div>
                           <img src={banner2} alt="프로모션 2" className="img-fluid rounded" />
                        </div>
                        <div>
                           <img src={banner3} alt="프로모션 3" className="img-fluid rounded" />
                        </div>
                        <div>
                           <img src={banner4} alt="프로모션 4" className="img-fluid rounded" />
                        </div>
                     </Slider>
                  </div>
                  <div className="col-lg-4">
                     <LoginWidget />
                  </div>
               </div>
            </div>
         </section>

         {/* 섹션 2: 추천 요금제 (로그인 시에만 표시) */}
         {isAuthenticated && (
            <section className="common-padding">
               <RecommendPlans plans={recommendedPlans} onLike={handleLike} />
            </section>
         )}

         {/* 섹션 3: 전체 요금제 */}
         <section className="common-padding bg-sub">
            <div className="container">
               <h2 className="text-center mb-5">요금제</h2>
               <div className="row justify-content-center g-4">
                  {defaultPlans.map((plan) => (
                     <div key={plan.id} className="col-lg-3 col-md-6 col-12">
                        <div className="plan-card" onClick={() => navigate(`/plans/${plan.id}`)}>
                           <div className="plan-card-container">
                              <div className="plan-content">
                                 <div className="plan-title">{plan.name}</div>
                                 <div className="plan-feature">
                                    ✅ 데이터 {plan.data}
                                    {plan.data !== '무제한' && ' + 1Mbps'}
                                 </div>
                                 <div className="plan-feature">✅ 통화 {plan.voice}</div>
                                 <div className="plan-feature">✅ 문자 {plan.sms}</div>
                              </div>
                              <div className="price-container">
                                 <div className="price-original">￦{(plan.price + 1000).toLocaleString()}</div>
                                 <div className='d-flex align-items-end gap-2'>
                                    <div className="price-current">￦{plan.price.toLocaleString()}</div>
                                    <div className="price-unit">/월</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 섹션 4: 제휴사 */}
         <section className="common-padding">
            <div className="container">
               <h2 className="text-center mb-5">제휴사</h2>
               <div className="row">
                  {[
                     { name: 'SKT', logo: carrierSKT },
                     { name: 'KT', logo: carrierKT },
                     { name: 'LG U+', logo: carrierLGU },
                  ].map((carrier, index) => (
                     <div key={index} className="col-md-4 col-12 text-center g-4">
                        <div className="rounded-circle bg-sub d-inline-flex align-items-center justify-content-center" style={{ width: '200px', height: '200px' }}>
                           <div>
                              <img src={carrier.logo} alt={carrier.name} style={{ width: '120px', height: 'auto', marginBottom: '10px' }} />
                              <h4>{carrier.name}</h4>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   )
}

export default LandingPage
