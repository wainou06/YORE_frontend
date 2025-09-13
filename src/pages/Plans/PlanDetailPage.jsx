import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NotFoundPage from '@/pages/Error/NotFoundPage'
import { useDispatch, useSelector } from 'react-redux'
import { getPlanById, getPlansByAgency, getAgencies, deletePlan } from '@/features/plans/planSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobileAlt, faWifi, faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import PriceSummary from '@components/plans/PriceSummary'
import '@assets/css/PlanDetail.css'

import { showModalThunk } from '@/features/modal/modalSlice'

const PlanDetailPage = () => {
   const { id } = useParams()
   const navigate = useNavigate()

   const dispatch = useDispatch()

   const { plan, plans, loading, error, agencies } = useSelector((state) => state.plans)
   const user = useSelector((state) => state.auth?.user)
   // 선택된 통신사/요금제 상태
   const [selectedCarrier, setSelectedCarrier] = useState(null)
   const [planOptions, setPlanOptions] = useState([])
   const [selectedPlanId, setSelectedPlanId] = useState(null)
   // 이미지 갤러리 상태
   const [mainImg, setMainImg] = useState('')

   // .env의 VITE_APP_API_URL 사용
   const BASE_URL = import.meta.env.VITE_APP_API_URL || ''

   function getFullImgUrl(imgURL) {
      if (!imgURL) return ''
      if (imgURL.startsWith('http')) return imgURL
      return BASE_URL.replace(/\/$/, '') + (imgURL.startsWith('/') ? imgURL : '/' + imgURL)
   }

   // images fallback 로직 함수화
   const getImages = useCallback((planObj) => {
      if (!planObj) return []
      let images = planObj.images || (planObj.planImgUrl ? [{ imgURL: planObj.planImgUrl }] : [])
      if ((!images || images.length === 0) && planObj.imgURL) {
         images = [{ imgURL: planObj.imgURL }]
      }
      return images
   }, [])

   // 통신사 목록 DB에서 불러오기
   useEffect(() => {
      dispatch(getAgencies())
   }, [dispatch])

   // 최초 진입 시 상세 plan fetch 및 carrier 상태 세팅
   useEffect(() => {
      if (id && agencies.length > 0) {
         dispatch(getPlanById(id))
            .unwrap()
            .then((data) => {
               // 상세 plan의 통신사로 agencyId 세팅
               setSelectedCarrier(data.agency?.id || data.agencyId)
               setSelectedPlanId(data.id)
            })
            .catch(() => {
               setError('notfound')
            })
      }
   }, [id, agencies, dispatch])

   // carrier 변경 시 해당 통신사 요금제 목록 fetch
   useEffect(() => {
      if (selectedCarrier) {
         dispatch(getPlansByAgency(selectedCarrier))
            .unwrap()
            .then((list) => {
               setPlanOptions(list)
               if (!list.find((p) => p.id === selectedPlanId)) {
                  setSelectedPlanId(list[0]?.id)
               }
            })
      }
   }, [selectedCarrier, dispatch, selectedPlanId])

   // 선택된 planId가 바뀌면 planOptions에서 해당 plan 객체로 대체 렌더링
   const displayPlan = planOptions.find((p) => p.id === selectedPlanId) || plan

   // displayPlan 변경 시 대표 이미지(mainImg) 갱신
   useEffect(() => {
      if (!displayPlan) return
      const images = getImages(displayPlan)
      setMainImg(images[0]?.imgURL || displayPlan.planImgUrl || displayPlan.planImg || '')
   }, [displayPlan, getImages])

   // 통신사 변경 핸들러
   const handleCarrierChange = useCallback((agencyId) => {
      setSelectedCarrier(agencyId)
   }, [])

   // 요금제 옵션 변경 핸들러
   const handlePlanOptionChange = useCallback((planId) => {
      setSelectedPlanId(planId)
   }, [])

   // 수정 버튼 클릭 핸들러
   const handleEdit = useCallback(() => {
      if (!selectedPlanId) return
      // 관리자/에이전시 라우트 구분
      if (user?.access === 'admin') {
         navigate(`/admin/plans/${selectedPlanId}/edit`)
      } else if (user?.access === 'agency') {
         navigate(`/agency/plans/${selectedPlanId}/edit`)
      } else {
         navigate(`/plans/${selectedPlanId}/edit`)
      }
   }, [navigate, selectedPlanId, user?.access])

   // 삭제 버튼 핸들러
   const handleDelete = useCallback(async () => {
      const result = await dispatch(showModalThunk({ type: 'confirm', placeholder: '정말 삭제하시겠습니까?' }))
      if (result.payload) {
         try {
            await dispatch(deletePlan(selectedPlanId)).unwrap()
            dispatch(showModalThunk({ type: 'alert', placeholder: '삭제되었습니다.' }))
            navigate('/plans')
         } catch (err) {
            dispatch(showModalThunk({ type: 'alert', placeholder: '삭제 실패: ' + (err?.message || err) }))
         }
      }
   }, [dispatch, selectedPlanId, navigate])

   if (loading) {
      return (
         <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">Loading...</span>
            </div>
         </div>
      )
   }
   if (error === 'notfound') {
      return <NotFoundPage />
   }
   if (error) {
      return (
         <div className="container py-5 text-center">
            <div className="alert alert-danger">{error}</div>
         </div>
      )
   }
   if (!displayPlan) {
      return null
   }

   const images = getImages(displayPlan)

   return (
      <div className="container py-5">
         <div className="row">
            <div className="col-lg-8 mb-4 mb-lg-0">
               <div className="card shadow-sm mb-4">
                  {/* 요금제 이미지 갤러리 */}
                  {images.length > 0 && (
                     <div>
                        <img src={getFullImgUrl(mainImg || images[0]?.imgURL)} alt={displayPlan.name} className="card-img-top mb-2" style={{ width: 240, height: 240, objectFit: 'cover', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', aspectRatio: '1 / 1' }} />
                        {images.length > 1 && (
                           <div className="d-flex gap-2 mt-2">
                              {images.map((img, idx) => (
                                 <img
                                    key={img.imgURL}
                                    src={getFullImgUrl(img.imgURL)}
                                    alt={`썸네일${idx + 1}`}
                                    style={{ width: 60, height: 60, objectFit: 'cover', aspectRatio: '1 / 1', border: mainImg === img.imgURL ? '2px solid #007bff' : '1px solid #ccc', borderRadius: 8, cursor: 'pointer' }}
                                    onClick={() => setMainImg(img.imgURL)}
                                 />
                              ))}
                           </div>
                        )}
                     </div>
                  )}
                  {/* 관리자/통신사만 수정 버튼 노출 */}
                  {(user?.access === 'admin' || user?.access === 'agency') && (
                     <div className="d-flex justify-content-end p-3 gap-2">
                        <button className="btn btn-outline-primary btn-sm" onClick={handleEdit}>
                           수정
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
                           삭제
                        </button>
                     </div>
                  )}
                  <div className="card-body">
                     {/* 통신사 선택 (select 옵션) */}
                     <div className="mb-4">
                        <h5 className="mb-3">통신사 선택</h5>
                        <select className="form-select" value={selectedCarrier || ''} onChange={(e) => handleCarrierChange(Number(e.target.value))}>
                           <option value="" disabled>
                              통신사를 선택하세요
                           </option>
                           {agencies.map((agency) => (
                              <option key={agency.id} value={agency.id}>
                                 {agency.agencyName}
                              </option>
                           ))}
                        </select>
                     </div>
                     {/* 요금제 옵션 선택 */}
                     {planOptions.length > 0 && (
                        <div className="mb-4">
                           <h5 className="mb-3">요금제 선택</h5>
                           <select className="form-select" value={selectedPlanId || ''} onChange={(e) => handlePlanOptionChange(Number(e.target.value))}>
                              {planOptions.map((p) => (
                                 <option key={p.id} value={p.id}>
                                    {p.name} ({p.data}/{p.voice}/{p.sms}) - {p.basePrice.toLocaleString()}원
                                 </option>
                              ))}
                           </select>
                        </div>
                     )}
                     <div className="badge mb-3" style={{ backgroundColor: '#6c757d' }}>
                        {displayPlan.agency?.agencyName || displayPlan.agencyId}
                     </div>
                     <h2 className="card-title mb-4">{displayPlan.name}</h2>
                     <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                           <div className="d-flex align-items-center">
                              <FontAwesomeIcon icon={faWifi} className="text-primary me-2" size="2x" />
                              <div>
                                 <div className="small text-muted">데이터</div>
                                 <strong>{displayPlan.data}</strong>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                           <div className="d-flex align-items-center">
                              <FontAwesomeIcon icon={faMobileAlt} className="text-primary me-2" size="2x" />
                              <div>
                                 <div className="small text-muted">통화</div>
                                 <strong>{displayPlan.voice}</strong>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-4">
                           <div className="d-flex align-items-center">
                              <FontAwesomeIcon icon={faEnvelope} className="text-primary me-2" size="2x" />
                              <div>
                                 <div className="small text-muted">문자</div>
                                 <strong>{displayPlan.sms}</strong>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="mb-4">
                        <h5 className="mb-3">주요 혜택</h5>
                        <ul className="list-unstyled">
                           {(() => {
                              if (!displayPlan.benefits) return null
                              // 배열인데 요소가 1개이고, 그 값이 문자열 배열 포맷이면 파싱
                              if (Array.isArray(displayPlan.benefits)) {
                                 if (displayPlan.benefits.length === 1 && typeof displayPlan.benefits[0] === 'string' && displayPlan.benefits[0].startsWith('[')) {
                                    try {
                                       const arr = JSON.parse(displayPlan.benefits[0])
                                       if (Array.isArray(arr)) {
                                          return arr.map((feature, idx) => (
                                             <li key={idx} className="mb-2">
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-primary me-2" />
                                                {feature}
                                             </li>
                                          ))
                                       }
                                    } catch (e) {}
                                 }
                                 // 일반 배열
                                 return displayPlan.benefits.map((feature, idx) => (
                                    <li key={idx} className="mb-2">
                                       <FontAwesomeIcon icon={faCheckCircle} className="text-primary me-2" />
                                       {feature}
                                    </li>
                                 ))
                              }
                              // 문자열이면 줄바꿈 분리
                              return displayPlan.benefits.split('\n').map((feature, idx) => (
                                 <li key={idx} className="mb-2">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary me-2" />
                                    {feature}
                                 </li>
                              ))
                           })()}
                        </ul>
                     </div>
                     {/* 부가서비스 */}
                     {(() => {
                        let additionalServices = displayPlan.additionalServices
                        if (!additionalServices || additionalServices.length === 0) {
                           if (plan && plan.additionalServices && plan.additionalServices.length > 0) {
                              additionalServices = plan.additionalServices
                           } else if (plans && Array.isArray(plans)) {
                              const found = plans.find((p) => p.id === displayPlan.id)
                              if (found && found.additionalServices && found.additionalServices.length > 0) {
                                 additionalServices = found.additionalServices
                              }
                           }
                        }
                        if (additionalServices && additionalServices.length > 0) {
                           return (
                              <div className="mb-4">
                                 <div className="card card-body">
                                    <h5 className="mb-3">부가 서비스</h5>
                                    <ul className="list-unstyled mb-0">
                                       {additionalServices.map((svc) => (
                                          <li key={svc.id} className="mb-2">
                                             <span className="fw-bold">{svc.name}</span> ({svc.provider}) - {typeof svc.fee === 'number' ? svc.fee.toLocaleString() : ''}원{svc.description && <span className="text-muted ms-2">{svc.description}</span>}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>
                           )
                        }
                        return null
                     })()}
                  </div>
               </div>
            </div>
            <div className="col-lg-4">
               <div className="sticky-top" style={{ top: '20px' }}>
                  {/* 옵션/결제 등은 별도 구현 필요 */}
                  {/* <PriceSummary plan={displayPlan} options={options} onCheckout={handleCheckout} /> */}
               </div>
            </div>
         </div>
      </div>
   )
}

export default PlanDetailPage
