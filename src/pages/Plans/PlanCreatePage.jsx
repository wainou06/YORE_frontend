import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createPlan } from '@/features/plans/planSlice'
import { createService } from '@/features/services/serviceSlice'
import api from '@/api/axiosApi'

import PlanQuotaForm from '@/components/Plans/PlanQuotaForm'
import FeatureForm from '@/components/Plans/FeatureForm'
import ImageUploadForm from '@/components/Plans/ImageUploadForm'
import BasicInfoForm from '@/components/Plans/BasicInfoForm'
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

const PlanCreatePage = () => {
   const [planData, setPlanData] = useState({
      name: '',
      description: '',
      price: '',
      networkType: '',
      data: '',
      voice: '',
      sms: '',
      features: [''],
      services: [],
      requiredServices: [],
      age: '',
      dis: '',
      basePrice: '',
      type: '',
   })
   const [images, setImages] = useState([])
   const [errors, setErrors] = useState({})
   const [newServices, setNewServices] = useState([{ name: '', description: '', price: '' }])
   const navigate = useNavigate()
   const location = useLocation()
   const dispatch = useDispatch()
   const admin = useSelector((state) => state.admin.isAuthenticated)
   const user = useSelector((state) => state.auth.user)
   const isAdminRoute = location.pathname.startsWith('/admin')
   const planLoading = useSelector((state) => state.plans.loading)
   const serviceLoading = useSelector((state) => state.services.loading)

   // 통신사 정보 fetch
   const [agencyInfo, setAgencyInfo] = useState(null)
   const fetchAgencyInfo = useCallback(async () => {
      if (!user?.id) return
      try {
         const res = await api.get(`/agencies/by-user/${user.id}`)
         setAgencyInfo(res.data)
      } catch (err) {
         setAgencyInfo(null)
      }
   }, [user?.id])
   useEffect(() => {
      if (!isAdminRoute && user?.id) fetchAgencyInfo()
   }, [isAdminRoute, user?.id, fetchAgencyInfo])

   // 이미지 핸들러
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

   // 부가서비스 핸들러
   const handleNewServiceChange = (idx, field, value) => {
      setNewServices((prev) =>
         prev.map((s, i) => {
            if (i !== idx) return s
            if (field === 'price') {
               const onlyNum = value.replace(/[^0-9]/g, '')
               return { ...s, price: onlyNum ? formatWithComma(onlyNum) : '' }
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

   // 입력 핸들러
   const handleInputChange = (e) => {
      const { name, value } = e.target
      if (name === 'networkType') {
         setPlanData((prev) => ({ ...prev, networkType: value, type: value }))
      } else if (name === 'data') {
         // '무제한' 입력 시 999999로 변환
         if (value.trim() === '무제한') {
            setPlanData((prev) => ({ ...prev, data: '999999' }))
         } else {
            setPlanData((prev) => ({ ...prev, data: value }))
         }
      } else {
         setPlanData((prev) => ({ ...prev, [name]: value }))
      }
   }
   const handlePriceChange = (e) => {
      const { name, value } = e.target
      let onlyNum = value.replace(/[^0-9]/g, '')
      if (!onlyNum) onlyNum = ''
      setPlanData((prev) => ({ ...prev, [name]: onlyNum ? formatWithComma(onlyNum) : '' }))
   }
   const handleFeatureChange = (index, value) => {
      const newFeatures = [...planData.features]
      newFeatures[index] = value
      setPlanData((prev) => ({ ...prev, features: newFeatures }))
   }

   // features 추가/삭제 함수
   const addFeature = () => {
      setPlanData((prev) => ({ ...prev, features: [...prev.features, ''] }))
   }
   const removeFeature = (index) => {
      setPlanData((prev) => ({
         ...prev,
         features: prev.features.filter((_, i) => i !== index),
      }))
   }

   // 유효성 검사
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
      if (planData.features.some((f) => !f)) newErrors.features = '모든 혜택을 입력해주세요.'
      if (images.length === 0) newErrors.images = '최소 1개의 이미지를 업로드해주세요.'
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   // 제출
   const handleSubmit = async (e) => {
      e.preventDefault()
      console.log(admin)
      if (!validateForm()) return
      if (!admin && !agencyInfo?.id) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '통신사 정보가 없습니다. 다시 로그인하거나 관리자에게 문의하세요.' }))
         return
      }
      let agencyId = admin ? 1 : agencyInfo.id
      const basePriceNum = Number(stripComma(planData.basePrice || planData.price)) || 0
      const disNum = Number(planData.dis) || 0
      let finalPriceNum
      if (disNum === 0) {
         finalPriceNum = basePriceNum
      } else {
         finalPriceNum = Math.round(basePriceNum * disNum)
      }
      const { features, networkType, requiredServices, price, ...rest } = planData
      // 부가서비스 값이 모두 채워진 항목만 추출 및 provider, fee 필드 추가
      const filledServices = newServices
         .filter((svc) => svc.name && svc.description && svc.price)
         .map((svc) => ({
            name: svc.name,
            description: svc.description,
            provider: admin ? 'YORE' : agencyInfo?.agencyName,
            fee: Number(stripComma(svc.price)),
         }))
      const planPayload = {
         ...rest,
         basePrice: basePriceNum,
         finalPrice: finalPriceNum,
         status: admin ? planData.status || 'active' : 'pending',
         agencyId,
         // ENUM 컬럼은 항상 문자열로 보장
         type: planData.type ? String(planData.type) : '',
         age: planData.age ? String(planData.age) : '',
         dis: planData.dis ? String(planData.dis) : '',
         // 빈 값('')이 아닌 혜택만 benefits에 저장 (string)
         benefits: JSON.stringify((features || []).filter((f) => f && f.trim() !== '')),
         data: String(planData.data).replace(/[^0-9]/g, ''),
         voice: String(planData.voice).replace(/[^0-9]/g, ''),
         sms: String(planData.sms).replace(/[^0-9]/g, ''),
      }
      // 부가서비스가 있으면 services 필드 추가, 없으면 삭제
      if (filledServices.length > 0) {
         planPayload.services = filledServices
      } else {
         delete planPayload.services
      }
      console.log('Submitting plan payload:', planPayload)
      const formData = new FormData()
      formData.append('planData', JSON.stringify(planPayload))
      images.forEach((img) => formData.append('images', img.file))
      const planResult = await dispatch(createPlan(formData))
      const planId = planResult?.payload?.id || planResult?.payload?.plan?.id
      if (!planId) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '요금제 생성에 실패했습니다.' }))
         return
      }
      const servicePromises = newServices
         .filter((svc) => svc.name && svc.description && svc.price)
         .map((svc) =>
            dispatch(
               createService({
                  name: svc.name,
                  description: svc.description,
                  provider: admin ? 'YORE' : agencyInfo?.agencyName,
                  planId,
                  fee: stripComma(svc.price),
               })
            )
         )
      await Promise.all(servicePromises)

      if (admin) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '요금제 및 부가서비스가 등록되었습니다.' }))
         navigate('/admin/plans')
      } else {
         dispatch(showModalThunk({ type: 'alert', placeholder: '요금제 및 부가서비스가 등록되었습니다. 관리자 승인 후 공개될 예정입니다.' }))
         navigate('/agency/plans')
      }
   }

   return (
      <div className="container py-5">
         <h2 className="mb-4">새 요금제 등록</h2>
         <form onSubmit={handleSubmit}>
            <div className="card shadow-sm mb-4">
               <div className="card-body">
                  <BasicInfoForm planData={planData} errors={errors} networkTypes={networkTypeOptions} ageOptions={ageOptions} disOptions={disOptions} onInputChange={handleInputChange} onPriceChange={handlePriceChange} />
                  <PlanQuotaForm planData={planData} errors={errors} onInputChange={handleInputChange} />
                  <FeatureForm features={planData.features} errors={errors} onFeatureChange={handleFeatureChange} onAddFeature={addFeature} onRemoveFeature={removeFeature} />
                  <ImageUploadForm images={images} onImageUpload={handleImageUpload} onRemoveImage={removeImage} onSetMainImage={onSetMainImage} errors={errors} />
                  {/* 부가서비스 직접 입력 UI */}
                  <div className="mb-3">
                     <label className="form-label" htmlFor="service-name-0">
                        부가서비스 직접 추가
                     </label>
                     {newServices.map((svc, idx) => (
                        <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
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

               {admin && (
                  <>
                     <button type="button" className={`btn btn-outline-success${planData.status === 'active' ? ' active' : ''}`} onClick={() => setPlanData((prev) => ({ ...prev, status: 'active' }))}>
                        승인
                     </button>
                     <button type="button" className={`btn btn-outline-danger${planData.status === 'inactive' ? ' active' : ''}`} onClick={() => setPlanData((prev) => ({ ...prev, status: 'inactive' }))}>
                        거부
                     </button>
                  </>
               )}
               <button type="button" className="btn btn-secondary" onClick={() => navigate(isAdminRoute ? '/admin/plans' : '/plans')}>
                  취소
               </button>
               <button type="submit" className="btn btn-primary" disabled={planLoading || serviceLoading}>
                  {planLoading || serviceLoading ? '등록 중...' : '요금제 등록'}
               </button>
            </div>
         </form>
      </div>
   )
}

export default PlanCreatePage
