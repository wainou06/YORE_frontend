import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobileAlt, faWifi, faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import PriceSummary from '@components/plans/PriceSummary'
import carrierSKT from '@assets/images/carrier/SK.png'
import carrierKT from '@assets/images/carrier/KT.png'
import carrierLGU from '@assets/images/carrier/LGU.png'
import '@assets/css/PlanDetail.css'

const PlanDetailPage = () => {
   const { id } = useParams()
   const navigate = useNavigate()
   const [plan, setPlan] = useState(null)
   const [options, setOptions] = useState({
      age: '',
      contract: '',
      services: [],
      carrier: '',
   })

   const carriers = [
      { id: 'SKT', name: 'SKT', logo: carrierSKT, color: '#E3383B', bgColor: '#FFF5F5' },
      { id: 'KT', name: 'KT', logo: carrierKT, color: '#1C89ED', bgColor: '#F5F9FF' },
      { id: 'LGU', name: 'LG U+', logo: carrierLGU, color: '#E6007E', bgColor: '#FFF5FA' },
   ]

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
         features: ['데이터 소진 시 저속 무제한', '부가서비스 무료', 'T멤버십 기본 제공'],
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
         features: ['데이터 소진 시 저속 무제한', '부가서비스 2개 무료', 'Y멤버십 제공'],
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
         features: ['데이터 완전 무제한', '부가서비스 3개 무료', 'U+멤버십 제공'],
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
         features: ['데이터/통화/문자 무제한', '모든 부가서비스 무료', 'T우주 무제한 제공'],
      },
   ]

   const additionalServices = [
      { id: 1, name: '안심 옵션', description: '분실/도난 보험', price: 3000 },
      { id: 2, name: '데이터 안심', description: '초과 요금 무제한', price: 5000 },
      { id: 3, name: '키즈 안심', description: '유해 콘텐츠 차단', price: 2000 },
      { id: 4, name: '콘텐츠 팩', description: '스트리밍 서비스 무제한', price: 7000 },
   ]

   useEffect(() => {
      // ID에 해당하는 요금제 찾기
      const selectedPlan = defaultPlans.find((plan) => plan.id === parseInt(id))
      if (selectedPlan) {
         setPlan(selectedPlan)
      } else {
         // 요금제를 찾지 못한 경우 404 페이지나 홈으로 이동
         navigate('/')
      }
   }, [id, navigate])

   const handleOptionChange = (key, value) => {
      setOptions((prev) => ({
         ...prev,
         [key]: value,
      }))

      // 통신사 변경 시 요금제 정보도 업데이트
      if (key === 'carrier') {
         setPlan((prev) => ({
            ...prev,
            carrier: value,
         }))
      }
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
                     <div
                        className="badge mb-3"
                        style={{
                           backgroundColor: carriers.find((c) => c.id === plan.carrier)?.color || '#6c757d',
                        }}
                     >
                        {plan.carrier}
                     </div>
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

                     {/* 통신사 선택 */}
                     <div className="mb-4">
                        <h5 className="mb-3">통신사 선택</h5>
                        <div className="carrier-selection">
                           {carriers.map((carrier) => (
                              <div key={carrier.id} className={`carrier-option carrier-${carrier.id.toLowerCase()} ${options.carrier === carrier.id ? 'selected' : ''}`} onClick={() => handleOptionChange('carrier', carrier.id)}>
                                 <img src={carrier.logo} alt={carrier.name} />
                                 <div className="carrier-name">{carrier.name}</div>
                              </div>
                           ))}
                        </div>
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
