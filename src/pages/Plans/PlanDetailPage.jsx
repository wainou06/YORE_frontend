import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobileAlt, faWifi, faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import PriceSummary from '@components/plans/PriceSummary'

const PlanDetailPage = () => {
   const { id } = useParams()
   const navigate = useNavigate()
   const [plan, setPlan] = useState(null)
   const [options, setOptions] = useState({
      age: '',
      contract: '',
      services: [],
   })

   // 임시 데이터
   const mockPlan = {
      id: 1,
      name: '5G 라이트',
      carrier: 'SKT',
      data: '5GB',
      voice: '무제한',
      sms: '무제한',
      price: 29900,
      features: ['데이터 소진 시 1Mbps 무제한', 'T멤버십 기본 제공', 'T우주 무제한 제공'],
   }

   const additionalServices = [
      { id: 1, name: '안심 옵션', description: '분실/도난 보험', price: 3000 },
      { id: 2, name: '데이터 안심', description: '초과 요금 무제한', price: 5000 },
      { id: 3, name: '키즈 안심', description: '유해 콘텐츠 차단', price: 2000 },
      { id: 4, name: '콘텐츠 팩', description: '스트리밍 서비스 무제한', price: 7000 },
   ]

   useEffect(() => {
      // TODO: API 연동
      setPlan(mockPlan)
   }, [id])

   const handleOptionChange = (key, value) => {
      setOptions((prev) => ({
         ...prev,
         [key]: value,
      }))
   }

   const handleServiceToggle = (service) => {
      setOptions((prev) => {
         const services = prev.services.slice()
         const index = services.findIndex((s) => s.id === service.id)

         if (index === -1) {
            services.push(service)
         } else {
            services.splice(index, 1)
         }

         return {
            ...prev,
            services,
         }
      })
   }

   const handleCheckout = ({ totalPrice, points }) => {
      // TODO: 결제 페이지로 이동
      navigate('/checkout', {
         state: {
            plan,
            options,
            totalPrice,
            points,
         },
      })
   }

   if (!plan) {
      return (
         <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">Loading...</span>
            </div>
         </div>
      )
   }

   return (
      <div className="container py-5">
         <div className="row">
            {/* 요금제 정보 */}
            <div className="col-lg-8 mb-4 mb-lg-0">
               <div className="card shadow-sm mb-4">
                  <div className="card-body">
                     <div className={`badge ${plan.carrier === 'SKT' ? 'bg-danger' : plan.carrier === 'KT' ? 'bg-primary' : 'bg-danger'} mb-3`}>{plan.carrier}</div>
                     <h2 className="card-title mb-4">{plan.name}</h2>

                     <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                           <div className="d-flex align-items-center">
                              <FontAwesomeIcon icon={faWifi} className="text-primary me-2" size="2x" />
                              <div>
                                 <div className="small text-muted">데이터</div>
                                 <strong>{plan.data}</strong>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                           <div className="d-flex align-items-center">
                              <FontAwesomeIcon icon={faMobileAlt} className="text-primary me-2" size="2x" />
                              <div>
                                 <div className="small text-muted">통화</div>
                                 <strong>{plan.voice}</strong>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-4">
                           <div className="d-flex align-items-center">
                              <FontAwesomeIcon icon={faEnvelope} className="text-primary me-2" size="2x" />
                              <div>
                                 <div className="small text-muted">문자</div>
                                 <strong>{plan.sms}</strong>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="mb-4">
                        <h5 className="mb-3">주요 혜택</h5>
                        <ul className="list-unstyled">
                           {plan.features.map((feature, index) => (
                              <li key={index} className="mb-2">
                                 <FontAwesomeIcon icon={faCheckCircle} className="text-primary me-2" />
                                 {feature}
                              </li>
                           ))}
                        </ul>
                     </div>

                     {/* 옵션 선택 */}
                     <div className="mb-4">
                        <h5 className="mb-3">나이 선택</h5>
                        <select className="form-select" value={options.age} onChange={(e) => handleOptionChange('age', Number(e.target.value))}>
                           <option value="">선택하세요</option>
                           <option value="19">19-24세</option>
                           <option value="25">25-64세</option>
                           <option value="65">65세 이상</option>
                        </select>
                     </div>

                     <div className="mb-4">
                        <h5 className="mb-3">약정 기간</h5>
                        <select className="form-select" value={options.contract} onChange={(e) => handleOptionChange('contract', Number(e.target.value))}>
                           <option value="">선택하세요</option>
                           <option value="0">무약정</option>
                           <option value="12">12개월</option>
                           <option value="24">24개월</option>
                        </select>
                     </div>

                     <div>
                        <h5 className="mb-3">부가 서비스</h5>
                        <div className="row">
                           {additionalServices.map((service) => (
                              <div key={service.id} className="col-md-6 mb-3">
                                 <div className={`card ${options.services.find((s) => s.id === service.id) ? 'border-primary' : ''}`} onClick={() => handleServiceToggle(service)} style={{ cursor: 'pointer' }}>
                                    <div className="card-body">
                                       <h6 className="card-title">{service.name}</h6>
                                       <p className="card-text small text-muted mb-2">{service.description}</p>
                                       <div className="text-primary">+{service.price.toLocaleString()}원</div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 가격 요약 */}
            <div className="col-lg-4">
               <div className="sticky-top" style={{ top: '20px' }}>
                  <PriceSummary plan={plan} options={options} onCheckout={handleCheckout} />
               </div>
            </div>
         </div>
      </div>
   )
}

export default PlanDetailPage
