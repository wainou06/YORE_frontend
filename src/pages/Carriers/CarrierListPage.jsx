import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

// Swiper 스타일
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

const carriers = [
   {
      id: 1,
      name: 'SKT',
      description: '대한민국 1위 통신사 SK텔레콤',
      coverage: '전국 99.5% 5G 커버리지',
      benefits: ['T멤버십 혜택', 'wavve 무료 구독', 'FLO 무료 이용'],
      plans: [
         { id: 1, name: '5GX 프라임', data: '무제한', price: 89000 },
         { id: 2, name: '5GX 스탠다드', data: '200GB', price: 75000 },
         { id: 3, name: '5GX 슬림', data: '100GB', price: 59000 },
      ],
   },
   {
      id: 2,
      name: 'KT',
      description: '국민이 선택한 통신사 KT',
      coverage: '전국 99% 5G 커버리지',
      benefits: ['KT멤버십 혜택', 'Seezn 무료 구독', 'Genie 무료 이용'],
      plans: [
         { id: 4, name: '5G 슈퍼플랜', data: '무제한', price: 85000 },
         { id: 5, name: '5G 스페셜', data: '200GB', price: 69000 },
         { id: 6, name: '5G 라이트', data: '100GB', price: 55000 },
      ],
   },
   {
      id: 3,
      name: 'LG U+',
      description: '고객 만족도 1위 LG U+',
      coverage: '전국 98.5% 5G 커버리지',
      benefits: ['U+멤버십 혜택', 'U+모바일tv 무료', 'U+뮤직 무료 이용'],
      plans: [
         { id: 7, name: '5G 프리미엄', data: '무제한', price: 85000 },
         { id: 8, name: '5G 스페셜', data: '200GB', price: 69000 },
         { id: 9, name: '5G 라이트', data: '100GB', price: 55000 },
      ],
   },
]

const PlanCard = ({ plan }) => {
   return (
      <div className="card h-100 shadow-sm">
         <div className="card-body">
            <h5 className="card-title">{plan.name}</h5>
            <p className="card-text text-primary fw-bold">월 {plan.price.toLocaleString()}원</p>
            <p className="card-text">데이터 {plan.data}</p>
            <button className="btn btn-outline-primary w-100">COMING SOON...</button>
         </div>
      </div>
   )
}

const CarrierSection = ({ carrier }) => {
   return (
      <section className="carrier-section py-5">
         <div className="container">
            <div className="row mb-4">
               <div className="col-lg-6">
                  <h2 className="mb-3">{carrier.name}</h2>
                  <p className="lead mb-3">{carrier.description}</p>
                  <p className="text-muted mb-3">{carrier.coverage}</p>
                  <ul className="list-unstyled">
                     {carrier.benefits.map((benefit, index) => (
                        <li key={index} className="mb-2">
                           ✓ {benefit}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
            <div className="row">
               <div className="col-12 position-relative">
                  <div className="custom-swiper-button-prev">
                     <FontAwesomeIcon icon={faChevronLeft} />
                  </div>
                  <div className="custom-swiper-button-next">
                     <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                  <Swiper
                     modules={[Navigation, FreeMode]}
                     navigation={{
                        prevEl: '.custom-swiper-button-prev',
                        nextEl: '.custom-swiper-button-next',
                     }}
                     freeMode={{
                        enabled: true,
                        momentum: true,
                        momentumRatio: 0.8,
                     }}
                     spaceBetween={16}
                     slidesPerView={1}
                     breakpoints={{
                        480: {
                           slidesPerView: 1.5,
                           spaceBetween: 16,
                        },
                        768: {
                           slidesPerView: 2,
                           spaceBetween: 20,
                        },
                        992: {
                           slidesPerView: 2.5,
                           spaceBetween: 24,
                        },
                        1200: {
                           slidesPerView: 3,
                           spaceBetween: 24,
                        },
                     }}
                     className="plans-swiper"
                  >
                     {carrier.plans.map((plan) => (
                        <SwiperSlide key={plan.id}>
                           <PlanCard plan={plan} />
                        </SwiperSlide>
                     ))}
                  </Swiper>
               </div>
            </div>
         </div>
      </section>
   )
}

const CarrierListPage = () => {
   const [activeCarrier, setActiveCarrier] = useState(carriers[0].id)

   return (
      <div className="carriers-page">
         <div className="bg-light py-5">
            <div className="container">
               <h1 className="text-center mb-4">통신사 요금제</h1>
               <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                  {carriers.map((carrier) => (
                     <button key={carrier.id} className={`btn btn-lg ${activeCarrier === carrier.id ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveCarrier(carrier.id)}>
                        {carrier.name}
                     </button>
                  ))}
               </div>
            </div>
         </div>
         {carriers.map((carrier) => (
            <div key={carrier.id} style={{ display: activeCarrier === carrier.id ? 'block' : 'none' }}>
               <CarrierSection carrier={carrier} />
            </div>
         ))}
      </div>
   )
}

export default CarrierListPage
