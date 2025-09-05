import { useSelector } from 'react-redux'
import Slider from 'react-slick'
import LoginWidget from '@components/common/LoginWidget'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobileAlt, faWifi, faComments } from '@fortawesome/free-solid-svg-icons'

const LandingPage = () => {
   const { isAuthenticated } = useSelector((state) => state.auth)

   const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
   }

   // 임시 데이터
   const mockPlans = [
      { id: 1, name: '5GB 요금제', data: '5GB', price: 29900, carrier: 'SKT' },
      { id: 2, name: '10GB 요금제', data: '10GB', price: 39900, carrier: 'KT' },
      { id: 3, name: '15GB 요금제', data: '15GB', price: 49900, carrier: 'LG U+' },
      { id: 4, name: '무제한 요금제', data: '무제한', price: 59900, carrier: 'SKT' },
   ]

   return (
      <div>
         {/* 섹션 1: 배너 & 로그인 */}
         <section className="common-padding bg-sub">
            <div className="container">
               <div className="row align-items-center">
                  <div className="col-lg-8">
                     <Slider {...sliderSettings}>
                        <div>
                           <img src="/images/banner/banner1.svg" alt="프로모션 1" className="img-fluid rounded" />
                        </div>
                        <div>
                           <img src="/images/banner/banner2.svg" alt="프로모션 2" className="img-fluid rounded" />
                        </div>
                        <div>
                           <img src="/images/banner/banner3.svg" alt="프로모션 3" className="img-fluid rounded" />
                        </div>
                        <div>
                           <img src="/images/banner/banner4.svg" alt="프로모션 4" className="img-fluid rounded" />
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
               <div className="container">
                  <h2 className="text-center mb-5">추천 요금제</h2>
                  <div className="row">
                     {mockPlans.slice(0, 2).map((plan) => (
                        <div key={plan.id} className="col-md-6">
                           <div className="card mb-4">
                              <div className="card-body">
                                 <h5 className="card-title">{plan.name}</h5>
                                 <p className="card-text">
                                    데이터: {plan.data}
                                    <br />
                                    통신사: {plan.carrier}
                                 </p>
                                 <div className="text-end">
                                    <h4 className="text-primary mb-0">{plan.price.toLocaleString()}원</h4>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}

         {/* 섹션 3: 전체 요금제 */}
         <section className="common-padding bg-sub">
            <div className="container">
               <h2 className="text-center mb-5">요금제</h2>
               <div className="row">
                  {mockPlans.map((plan) => (
                     <div key={plan.id} className="col-md-3">
                        <div className="card mb-4">
                           <div className="card-body">
                              <h5 className="card-title">{plan.name}</h5>
                              <p className="card-text">
                                 데이터: {plan.data}
                                 <br />
                                 통신사: {plan.carrier}
                              </p>
                              <div className="text-end">
                                 <h4 className="text-primary mb-0">{plan.price.toLocaleString()}원</h4>
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
                  {['SKT', 'KT', 'LG U+'].map((carrier, index) => (
                     <div key={index} className="col-md-4 text-center">
                        <div className="rounded-circle bg-sub d-inline-flex align-items-center justify-content-center" style={{ width: '200px', height: '200px' }}>
                           <div>
                              <FontAwesomeIcon icon={index === 0 ? faMobileAlt : index === 1 ? faWifi : faComments} size="3x" className="text-primary mb-3" />
                              <h4>{carrier}</h4>
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
