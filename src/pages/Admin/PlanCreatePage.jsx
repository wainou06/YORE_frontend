import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { planService, serviceService } from '@/services/planService'
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons'
import '@assets/css/PlanDetail.css'

const PlanCreatePage = () => {
   const navigate = useNavigate()
   const [planData, setPlanData] = useState({
      name: '',
      description: '',
      price: '',
      networkType: '',
      data: '',
      voice: '',
      sms: '',
      features: [''],
      images: [],
      services: [],
      requiredServices: [],
   })

   const [errors, setErrors] = useState({})

   // 기본 요금제 네트워크 타입 옵션
   const networkTypes = ['LTE', '5G']

   const [additionalServices, setAdditionalServices] = useState([])

   useEffect(() => {
      const fetchServices = async () => {
         try {
            const response = await serviceService.getAvailableServices()
            setAdditionalServices(response.data)
         } catch (error) {
            console.error('부가 서비스 목록 조회 실패:', error)
            alert('부가 서비스 목록을 불러오는데 실패했습니다.')
         }
      }

      fetchServices()
   }, [])

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setPlanData((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   const handlePriceChange = (e) => {
      const value = e.target.value.replace(/[^0-9]/g, '')
      setPlanData((prev) => ({
         ...prev,
         price: value,
      }))
   }

   const handleFeatureChange = (index, value) => {
      const newFeatures = [...planData.features]
      newFeatures[index] = value
      setPlanData((prev) => ({
         ...prev,
         features: newFeatures,
      }))
   }

   const addFeature = () => {
      setPlanData((prev) => ({
         ...prev,
         features: [...prev.features, ''],
      }))
   }

   const removeFeature = (index) => {
      setPlanData((prev) => ({
         ...prev,
         features: prev.features.filter((_, i) => i !== index),
      }))
   }

   const handleImageUpload = async (e) => {
      const files = Array.from(e.target.files)
      const imagePromises = files.map((file) => {
         return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
               resolve({
                  file,
                  preview: e.target.result,
                  isMain: false,
               })
            }
            reader.readAsDataURL(file)
         })
      })

      const images = await Promise.all(imagePromises)
      setPlanData((prev) => ({
         ...prev,
         images: [...prev.images, ...images],
      }))
   }

   const removeImage = (index) => {
      setPlanData((prev) => ({
         ...prev,
         images: prev.images.filter((_, i) => i !== index),
      }))
   }

   const setMainImage = (index) => {
      setPlanData((prev) => ({
         ...prev,
         images: prev.images.map((img, i) => ({
            ...img,
            isMain: i === index,
         })),
      }))
   }

   const handleServiceToggle = (service) => {
      setPlanData((prev) => {
         const services = [...prev.services]
         const index = services.indexOf(service.id)

         if (index === -1) {
            services.push(service.id)
         } else {
            services.splice(index, 1)
            // 필수 서비스에서도 제거
            const reqIndex = prev.requiredServices.indexOf(service.id)
            if (reqIndex !== -1) {
               prev.requiredServices.splice(reqIndex, 1)
            }
         }

         return {
            ...prev,
            services,
         }
      })
   }

   const handleRequiredServiceToggle = (serviceId) => {
      setPlanData((prev) => {
         const requiredServices = [...prev.requiredServices]
         const index = requiredServices.indexOf(serviceId)

         if (index === -1) {
            // 서비스가 선택되어 있을 때만 필수 서비스로 지정 가능
            if (prev.services.includes(serviceId)) {
               requiredServices.push(serviceId)
            }
         } else {
            requiredServices.splice(index, 1)
         }

         return {
            ...prev,
            requiredServices,
         }
      })
   }

   const validateForm = () => {
      const newErrors = {}

      if (!planData.name) newErrors.name = '요금제 이름을 입력해주세요.'
      if (!planData.description) newErrors.description = '요금제 설명을 입력해주세요.'
      if (!planData.price) newErrors.price = '가격을 입력해주세요.'
      if (!planData.networkType) newErrors.networkType = '네트워크 타입을 선택해주세요.'
      if (!planData.data) newErrors.data = '데이터 제공량을 입력해주세요.'
      if (!planData.voice) newErrors.voice = '통화 제공량을 입력해주세요.'
      if (!planData.sms) newErrors.sms = 'SMS 제공량을 입력해주세요.'
      if (planData.features.some((f) => !f)) newErrors.features = '모든 혜택을 입력해주세요.'
      if (planData.images.length === 0) newErrors.images = '최소 1개의 이미지를 업로드해주세요.'

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!validateForm()) return

      try {
         const response = await planService.createPlanWithImages(planData)
         alert('요금제가 등록되었습니다.')
         navigate('/admin/plans')
      } catch (error) {
         console.error('요금제 등록 실패:', error)
         alert(error.response?.data?.message || '요금제 등록에 실패했습니다.')
      }
   }

   return (
      <div className="container py-5">
         <h2 className="mb-4">새 요금제 등록</h2>
         <form onSubmit={handleSubmit}>
            <div className="card shadow-sm mb-4">
               <div className="card-body">
                  {/* 기본 정보 */}
                  <div className="mb-4">
                     <h5 className="card-title mb-3">기본 정보</h5>
                     <div className="row">
                        <div className="col-md-6 mb-3">
                           <label className="form-label">요금제 이름*</label>
                           <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name" value={planData.name} onChange={handleInputChange} />
                           {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                           <label className="form-label">가격 (원)*</label>
                           <input type="text" className={`form-control ${errors.price ? 'is-invalid' : ''}`} name="price" value={planData.price} onChange={handlePriceChange} />
                           {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                        </div>
                     </div>
                     <div className="mb-3">
                        <label className="form-label">설명*</label>
                        <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} name="description" value={planData.description} onChange={handleInputChange} rows="3" />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                     </div>
                     <div className="mb-3">
                        <label className="form-label">네트워크 타입*</label>
                        <select className={`form-select ${errors.networkType ? 'is-invalid' : ''}`} name="networkType" value={planData.networkType} onChange={handleInputChange}>
                           <option value="">선택하세요</option>
                           {networkTypes.map((type) => (
                              <option key={type} value={type}>
                                 {type}
                              </option>
                           ))}
                        </select>
                        {errors.networkType && <div className="invalid-feedback">{errors.networkType}</div>}
                     </div>
                  </div>

                  {/* 제공량 */}
                  <div className="mb-4">
                     <h5 className="card-title mb-3">제공량</h5>
                     <div className="row">
                        <div className="col-md-4 mb-3">
                           <label className="form-label">데이터*</label>
                           <input type="text" className={`form-control ${errors.data ? 'is-invalid' : ''}`} name="data" value={planData.data} onChange={handleInputChange} placeholder="예: 5GB, 무제한" />
                           {errors.data && <div className="invalid-feedback">{errors.data}</div>}
                        </div>
                        <div className="col-md-4 mb-3">
                           <label className="form-label">통화*</label>
                           <input type="text" className={`form-control ${errors.voice ? 'is-invalid' : ''}`} name="voice" value={planData.voice} onChange={handleInputChange} placeholder="예: 200분, 무제한" />
                           {errors.voice && <div className="invalid-feedback">{errors.voice}</div>}
                        </div>
                        <div className="col-md-4 mb-3">
                           <label className="form-label">문자*</label>
                           <input type="text" className={`form-control ${errors.sms ? 'is-invalid' : ''}`} name="sms" value={planData.sms} onChange={handleInputChange} placeholder="예: 100건, 무제한" />
                           {errors.sms && <div className="invalid-feedback">{errors.sms}</div>}
                        </div>
                     </div>
                  </div>

                  {/* 혜택 */}
                  <div className="mb-4">
                     <h5 className="card-title mb-3">
                        혜택
                        <button type="button" className="btn btn-sm btn-outline-primary ms-2" onClick={addFeature}>
                           + 추가
                        </button>
                     </h5>
                     {planData.features.map((feature, index) => (
                        <div key={index} className="mb-2 d-flex align-items-center">
                           <input type="text" className={`form-control ${errors.features ? 'is-invalid' : ''}`} value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} placeholder="혜택을 입력하세요" />
                           {index > 0 && (
                              <button type="button" className="btn btn-outline-danger ms-2" onClick={() => removeFeature(index)}>
                                 <FontAwesomeIcon icon={faTrash} />
                              </button>
                           )}
                        </div>
                     ))}
                     {errors.features && <div className="text-danger small mt-1">{errors.features}</div>}
                  </div>

                  {/* 이미지 업로드 */}
                  <div className="mb-4">
                     <h5 className="card-title mb-3">이미지</h5>
                     <div className="mb-3">
                        <input type="file" className={`form-control ${errors.images ? 'is-invalid' : ''}`} accept="image/*" multiple onChange={handleImageUpload} />
                        {errors.images && <div className="invalid-feedback">{errors.images}</div>}
                     </div>
                     <div className="row">
                        {planData.images.map((image, index) => (
                           <div key={index} className="col-md-4 mb-3">
                              <div className="card">
                                 <img src={image.preview} className="card-img-top" alt={`Preview ${index + 1}`} />
                                 <div className="card-body">
                                    <div className="form-check mb-2">
                                       <input type="radio" className="form-check-input" name="mainImage" checked={image.isMain} onChange={() => setMainImage(index)} />
                                       <label className="form-check-label">대표 이미지</label>
                                    </div>
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeImage(index)}>
                                       삭제
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 부가 서비스 */}
                  <div>
                     <h5 className="card-title mb-3">부가 서비스</h5>
                     <div className="row">
                        {additionalServices.map((service) => (
                           <div key={service.id} className="col-md-6 mb-3">
                              <div className={`card ${planData.services.includes(service.id) ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }}>
                                 <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                       <div>
                                          <h6 className="card-title">{service.name}</h6>
                                          <p className="card-text small text-muted mb-2">{service.description}</p>
                                          <div className="text-primary">+{service.price.toLocaleString()}원</div>
                                       </div>
                                       <div className="d-flex flex-column">
                                          <div className="form-check">
                                             <input type="checkbox" className="form-check-input" checked={planData.services.includes(service.id)} onChange={() => handleServiceToggle(service)} />
                                             <label className="form-check-label">선택</label>
                                          </div>
                                          {planData.services.includes(service.id) && (
                                             <div className="form-check mt-2">
                                                <input type="checkbox" className="form-check-input" checked={planData.requiredServices.includes(service.id)} onChange={() => handleRequiredServiceToggle(service.id)} />
                                                <label className="form-check-label">필수</label>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* 제출 버튼 */}
            <div className="d-flex justify-content-end gap-2">
               <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/plans')}>
                  취소
               </button>
               <button type="submit" className="btn btn-primary">
                  요금제 등록
               </button>
            </div>
         </form>
      </div>
   )
}

export default PlanCreatePage
