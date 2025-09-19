import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getPlanById, updatePlan } from '@/features/plans/planSlice'

import PlanQuotaForm from '@/components/plans/PlanQuotaForm'
import FeatureForm from '@/components/plans/FeatureForm'
import ImageUploadForm from '@/components/plans/ImageUploadForm'
import BasicInfoForm from '@/components/plans/BasicInfoForm'
import { formatWithComma, stripComma } from '@/utils/priceSet'
import '@assets/css/PlanDetail.css'

import { showModalThunk } from '@/features/modal/modalSlice'

const networkTypeOptions = [
   { value: '2', label: '3G' },
   { value: '3', label: 'LTE' },
   { value: '6', label: '5G' },
]
const ageOptions = [
   { value: '18', label: '청소년' },
   { value: '20', label: '성인' },
   { value: '65', label: '실버' },
]
const disOptions = [
   { value: '0', label: '무약정' },
   { value: '12', label: '12개월' },
   { value: '24', label: '24개월' },
]

const PlanEditPage = () => {
   const { id } = useParams()
   const [planData, setPlanData] = useState(null)
   const [images, setImages] = useState([])
   const [errors, setErrors] = useState({})
   const [newServices, setNewServices] = useState([{ name: '', description: '', price: '', provider: '' }])
   const navigate = useNavigate()
   const location = useLocation()
   const dispatch = useDispatch()

   const isAdminRoute = location.pathname.startsWith('/admin')
   const planLoading = useSelector((state) => state.plans.loading)
   const serviceLoading = useSelector((state) => state.services.loading)

   // 이미지 절대경로 변환 함수
   const BASE_URL = import.meta.env.VITE_APP_API_URL || ''
   function getFullImgUrl(imgURL) {
      if (!imgURL) return ''
      if (imgURL.startsWith('http')) return imgURL
      return BASE_URL.replace(/\/$/, '') + (imgURL.startsWith('/') ? imgURL : '/' + imgURL)
   }

   // 기존 plan 데이터 fetch
   useEffect(() => {
      if (id) {
         dispatch(getPlanById(id))
            .unwrap()
            .then((data) => {
               setPlanData({
                  ...data,
                  price: formatWithComma(String(data.price || data.basePrice || '')),
                  features: Array.isArray(data.benefits) ? data.benefits : data.benefits ? JSON.parse(data.benefits) : [''],
                  networkType: data.type,
               })
               // 기존 이미지 세팅
               setImages(
                  (data.images || []).map((img, idx) => ({
                     file: null,
                     preview: getFullImgUrl(img.imgURL),
                     isMain: img.mainImg === 'Y' || idx === 0,
                     imgURL: img.imgURL,
                  }))
               )
               // 기존 부가서비스 세팅
               setNewServices(
                  data.additionalServices && data.additionalServices.length > 0
                     ? data.additionalServices.map((svc) => ({
                          name: svc.name,
                          description: svc.description,
                          price: formatWithComma(typeof svc.fee === 'number' ? String(svc.fee) : svc.fee ? String(svc.fee) : '0'),
                          id: svc.id,
                          provider: svc.provider || data.agency?.agencyName || data.agencyName || '',
                       }))
                     : [{ name: '', description: '', price: '', provider: '' }]
               )
            })
      }
   }, [id, dispatch])

   // 이미지 핸들러 (생성과 동일)
   const handleImageUpload = (e) => {
      const files = Array.from(e.target.files)
      const newImages = files.map((file, i) => ({
         file,
         preview: URL.createObjectURL(file),
         isMain: images.length === 0 && i === 0,
      }))
      setImages((prev) => {
         if (!prev.some((img) => img.isMain) && newImages.length > 0) newImages[0].isMain = true
         return [...prev, ...newImages]
      })
   }
   const removeImage = (idx) => {
      setImages((prev) => {
         const removed = prev.filter((_, i) => i !== idx)
         if (prev[idx]?.isMain && removed.length > 0) removed[0].isMain = true
         return removed
      })
   }
   const onSetMainImage = (idx) => {
      setImages((prev) => prev.map((img, i) => ({ ...img, isMain: i === idx })))
   }

   // 부가서비스 핸들러 (생성과 동일)
   const handleNewServiceChange = (idx, field, value) => {
      setNewServices((prev) =>
         prev.map((s, i) => {
            if (i !== idx) return s
            if (field === 'price') {
               // 입력값에서 숫자만 추출 후 콤마 적용
               const onlyNum = value.replace(/[^0-9]/g, '')
               const formatted = onlyNum ? formatWithComma(onlyNum) : ''
               return { ...s, price: formatted }
            }
            return { ...s, [field]: value }
         })
      )
   }

   const addNewServiceField = () => {
      setNewServices((prev) => [...prev, { name: '', description: '', price: '' }])
   }

   const removeNewServiceField = (idx) => {
      setNewServices((prev) => prev.filter((_, i) => i !== idx))
   }

   // 입력 핸들러 (생성과 동일)
   const handleInputChange = (e) => {
      const { name, value } = e.target
      if (name === 'networkType') {
         setPlanData((prev) => ({ ...prev, networkType: value, type: value }))
      } else {
         setPlanData((prev) => ({ ...prev, [name]: value }))
      }
   }

   const handlePriceChange = (e) => {
      const { name, value } = e.target
      const onlyNum = value.replace(/[^0-9]/g, '')
      const formatted = onlyNum ? formatWithComma(onlyNum) : ''
      setPlanData((prev) => ({ ...prev, [name]: formatted }))
   }

   const handleFeatureChange = (index, value) => {
      setPlanData((prev) => {
         const newFeatures = [...(prev.features || [])]
         newFeatures[index] = value
         return { ...prev, features: newFeatures }
      })
   }

   // features 추가/삭제 함수
   const addFeature = () => {
      setPlanData((prev) => ({ ...prev, features: [...(prev.features || []), ''] }))
   }
   const removeFeature = (index) => {
      setPlanData((prev) => ({
         ...prev,
         features: (prev.features || []).filter((_, i) => i !== index),
      }))
   }

   // 유효성 검사 (생성과 동일)
   const validateForm = () => {
      const newErrors = {}
      if (!planData.name) newErrors.name = '요금제 이름을 입력해주세요.'
      if (!planData.description) newErrors.description = '요금제 설명을 입력해주세요.'
      if (!planData.price) newErrors.price = '가격을 입력해주세요.'
      if (!planData.networkType) newErrors.networkType = '네트워크 타입을 선택해주세요.'
      if (!planData.type) newErrors.type = '요금제 타입을 선택해주세요.'
      if (!planData.data) newErrors.data = '데이터 제공량을 입력해주세요.'
      if (!planData.voice) newErrors.voice = '통화 제공량을 입력해주세요.'
      if (!planData.sms) newErrors.sms = 'SMS 제공량을 입력해주세요.'
      if (!planData.age) newErrors.age = '연령대를 선택해주세요.'
      if (!planData.dis) newErrors.dis = '약정기간을 선택해주세요.'
      if ((planData.features || []).some((f) => !f)) newErrors.features = '모든 혜택을 입력해주세요.'
      if (images.length === 0) newErrors.images = '최소 1개의 이미지를 업로드해주세요.'
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   // 제출
   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!validateForm()) return
      // 실제로 저장될 부가서비스가 1개 이상인지 체크
      const filteredServices = newServices.filter((svc) => svc.name && svc.price)

      // 입력란이 1개만 있고 값이 모두 비어 있을 때도 저장 차단
      if (filteredServices.length === 0 && newServices.length === 1) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '최소 1개 이상의 부가서비스를 입력해야 합니다.' }))
         return
      }
      let agencyId = planData.agencyId
      const basePriceNum = Number(stripComma(planData.basePrice || planData.price)) || 0
      const disNum = Number(stripComma(planData.dis)) || 0
      let finalPriceNum
      if (disNum === 0) {
         finalPriceNum = basePriceNum
      } else {
         finalPriceNum = Math.round(basePriceNum * disNum)
      }
      const planPayload = {
         ...planData,
         price: stripComma(planData.price),
         agencyId,
         type: planData.type ? String(planData.type) : '',
         age: planData.age ? String(planData.age) : '',
         dis: planData.dis ? String(planData.dis) : '',
         basePrice: stripComma(planData.basePrice || planData.price),
         finalPrice: finalPriceNum,
         benefits: JSON.stringify((planData.features || []).filter((f) => f && f.trim() !== '')),
         data: String(planData.data).replace(/[^0-9]/g, ''),
         voice: String(planData.voice).replace(/[^0-9]/g, ''),
         sms: String(planData.sms).replace(/[^0-9]/g, ''),
         services: filteredServices.map((svc) => ({
            ...svc,
            fee: stripComma(svc.price),
            provider: planData.agency?.agencyName || planData.agencyName || '',
         })),
      }
      const formData = new FormData()
      formData.append('planData', JSON.stringify(planPayload))
      // 대표이미지(메인) 우선 순서로 정렬 후 업로드
      const sortedImages = [...images].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0))
      // 기존 이미지의 imgURL 정보도 함께 전송 (대표이미지 정보 포함)
      const existingImgUrls = sortedImages.filter((img) => !img.file && img.imgURL).map((img) => ({ imgURL: img.imgURL, isMain: img.isMain }))
      if (existingImgUrls.length > 0) {
         formData.append('existingImgUrls', JSON.stringify(existingImgUrls))
      }
      sortedImages.forEach((img) => {
         if (img.file) formData.append('images', img.file)
      })
      try {
         await dispatch(updatePlan({ id, data: formData })).unwrap()
         dispatch(showModalThunk({ type: 'alert', placeholder: '요금제가 수정되었습니다.' }))
         navigate(isAdminRoute ? '/admin/plans' : '/agency/plans')
      } catch (err) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '수정 실패: ' + (err?.message || err) }))
      }
   }

   if (!planData) return <div className="container py-5 text-center">Loading...</div>

   return (
      <div className="container py-5">
         <h2 className="mb-4">요금제 수정</h2>
         <form onSubmit={handleSubmit}>
            <div className="card shadow-sm mb-4">
               <div className="card-body">
                  <BasicInfoForm planData={planData} errors={errors} networkTypes={networkTypeOptions} ageOptions={ageOptions} disOptions={disOptions} onInputChange={handleInputChange} onPriceChange={handlePriceChange} />
                  <PlanQuotaForm planData={planData} errors={errors} onInputChange={handleInputChange} />
                  <FeatureForm features={planData.features || []} errors={errors} onFeatureChange={handleFeatureChange} onAddFeature={addFeature} onRemoveFeature={removeFeature} />
                  <ImageUploadForm images={images} onImageUpload={handleImageUpload} onRemoveImage={removeImage} onSetMainImage={onSetMainImage} errors={errors} />
                  {/* 부가서비스 직접 입력 UI */}
                  <div className="mb-3">
                     <label className="form-label">부가서비스 직접 추가/수정/삭제</label>
                     {newServices.map((svc, idx) => (
                        <div key={svc.id || idx} className="d-flex gap-2 mb-2 align-items-center">
                           <input type="text" className="form-control" placeholder="부가서비스명" value={svc.name} onChange={(e) => handleNewServiceChange(idx, 'name', e.target.value)} style={{ maxWidth: 180 }} name={`service-name-${idx}`} id={`service-name-${idx}`} aria-label="부가서비스명" />
                           <input
                              type="text"
                              className="form-control"
                              placeholder="설명"
                              value={svc.description}
                              onChange={(e) => handleNewServiceChange(idx, 'description', e.target.value)}
                              style={{ maxWidth: 300 }}
                              name={`service-description-${idx}`}
                              id={`service-description-${idx}`}
                              aria-label="설명"
                           />
                           <input type="text" className="form-control" placeholder="가격" value={svc.price} onChange={(e) => handleNewServiceChange(idx, 'price', e.target.value)} style={{ maxWidth: 120 }} name={`service-price-${idx}`} id={`service-price-${idx}`} aria-label="가격" />
                           <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeNewServiceField(idx)} disabled={newServices.length === 1}>
                              -
                           </button>
                           {idx === newServices.length - 1 && (
                              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addNewServiceField}>
                                 +
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
               <button type="button" className="btn btn-secondary" onClick={() => navigate(isAdminRoute ? '/admin/plans' : '/plans')}>
                  취소
               </button>
               <button type="submit" className="btn btn-primary" disabled={planLoading || serviceLoading}>
                  {planLoading || serviceLoading ? '수정 중...' : '저장'}
               </button>
            </div>
         </form>
      </div>
   )
}

export default PlanEditPage
