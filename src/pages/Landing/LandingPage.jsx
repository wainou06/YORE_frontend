import { Swiper, SwiperSlide } from 'swiper/react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSurveys } from '@/features/survey/surveySlice'

import { getPlans } from '@/features/plans/planSlice'

import carrierSKT from '@assets/images/carrier/SK.png'
import carrierKT from '@assets/images/carrier/kt.png'
import carrierLGU from '@assets/images/carrier/LGU.png'

import '@assets/css/PlanCard.css'
import 'swiper/css/pagination'

import LoginWidget from '@components/common/LoginWidget'
import RecommendPlans from '@components/plans/RecommendPlans'
import { Autoplay, Pagination } from 'swiper/modules'

const LandingPage = () => {
   const { isAuthenticated } = useSelector((state) => state.auth)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [recommendedPlans, setRecommendedPlans] = useState([])
   const surveys = useSelector((state) => state.survey)
   const plans = useSelector((state) => state.plans.plans)
   const imgUrl = import.meta.env.VITE_APP_API_URL

   useEffect(() => {
      // 설문 리스트, 요금제 리스트 불러오기 (최초 1회)
      dispatch(fetchSurveys())
      dispatch(getPlans())
   }, [dispatch])

   console.log('요금 리스트:', plans)

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

   return (
      <div>
         {/* 섹션 1: 배너 & 로그인 */}
         <section className="common-padding bg-sub">
            <div className="container">
               <div className="row align-items-center">
                  <div className="col-lg-8 banner-section">
                     <div className="banner-swiper">
                        <Swiper
                           spaceBetween={30}
                           centeredSlides={true}
                           autoplay={{
                              delay: 10000,
                              disableOnInteraction: false,
                           }}
                           pagination={{
                              clickable: true,
                           }}
                           modules={[Autoplay, Pagination]}
                           className="mySwiper"
                        >
                           <SwiperSlide className="Slide1 rounded ">
                              <div className="Slide-bg rounded">
                                 <h3 className="text-white">
                                    맞춤 요금제를 YORE에서
                                    <br />
                                    리서치 하세요
                                 </h3>
                                 <div className="mt-40">
                                    <a href="/">👉 지금 시작하기</a>
                                 </div>
                              </div>
                           </SwiperSlide>
                           <SwiperSlide className="Slide2 rounded">
                              <div className="Slide-bg rounded">
                                 <h3 className="text-white">
                                    당신에게 알맞는
                                    <br /> 요금제를 찾아보세요
                                 </h3>
                                 <div className="mt-40">
                                    <a href="/plans">👉 바로가기</a>
                                 </div>
                              </div>
                           </SwiperSlide>
                           <SwiperSlide className="Slide3 rounded">
                              {' '}
                              <div className="Slide-bg rounded">
                                 <h3 className="text-white text-center">
                                    간편한 비교로
                                    <br /> 최적의 선택을!
                                 </h3>
                                 <div className="mt-40">
                                    <a href="/carriers">👉 바로가기</a>
                                 </div>
                              </div>
                           </SwiperSlide>
                           <SwiperSlide className="Slide4 rounded">
                              <div className="Slide-bg rounded">
                                 <h3 className="text-white">
                                    처음이시라고요?
                                    <br />
                                    회원가입부터 시작하세요!
                                 </h3>
                                 <p className="text-white">첫 가입 시, 쿠폰 증정!</p>
                                 <div className="mt-40">
                                    <a href="/signup">👉 가입하기</a>
                                 </div>
                              </div>
                           </SwiperSlide>
                        </Swiper>
                     </div>
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
                  {plans.length > 0 ? (
                     plans.slice(0, 4).map((plan) => (
                        <div key={plan.id} className="col-lg-3 col-md-6 col-12">
                           <div className="plan-card" onClick={() => navigate(`/plans/${plan.id}`)}>
                              <div className="plan-card-container">
                                 <div className="img-content">
                                    {/* 요금제 이미지 (planImgUrl) */}
                                    {plan.planImgUrl && (
                                       <div className="plan-img">
                                          <img src={plan.planImgUrl.startsWith('/') ? imgUrl + plan.planImgUrl : `${imgUrl}${plan.planImgUrl}`} alt={plan.name} />
                                       </div>
                                    )}
                                 </div>
                                 <div className="plan-content">
                                    <div className="plan-title">{plan.name}</div>
                                    <div className="plan-feature">
                                       ✅ 데이터 {['99999', '999999', 99999, 999999].includes(plan.data) ? '무제한' : plan.data}
                                       {['99999', '999999', 99999, 999999].includes(plan.data) || plan.data === '무제한' ? '' : ' + 1Mbps'}
                                    </div>
                                    <div className="plan-feature">✅ 통화 {['99999', '999999', 99999, 999999].includes(plan.voice) ? '무제한' : plan.voice}</div>
                                    <div className="plan-feature">✅ 문자 {['99999', '999999', 99999, 999999].includes(plan.sms) ? '무제한' : plan.sms}</div>
                                 </div>
                                 <div className="price-container">
                                    <div className="price-original">￦{(plan.basePrice + 1000).toLocaleString()}</div>
                                    <div className="d-flex align-items-end gap-2">
                                       <div className="price-current">￦{plan.basePrice.toLocaleString()}</div>
                                       <div className="price-unit">/월</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="text-center">요금제가 없습니다.</div>
                  )}
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
