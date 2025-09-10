import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { plansAPI, servicesAPI } from '@/services/api'
import BasicInfoForm from '@/components/Plans/BasicInfoForm'
import PlanQuotaForm from '@/components/Plans/PlanQuotaForm'
import FeatureForm from '@/components/Plans/FeatureForm'
import ImageUploadForm from '@/components/Plans/ImageUploadForm'
import AdditionalServicesForm from '@/components/Plans/AdditionalServicesForm'
import '@assets/css/PlanDetail.css'

const PlanCreatePage = () => {
   const navigate = useNavigate()
   const location = useLocation()
   const admin = useSelector((state) => state.admin)
   const user = useSelector((state) => state.auth.user)
   const isAdminRoute = location.pathname.startsWith('/admin')

   useEffect(() => {
      // 관리자 경로인 경우 관리자 권한 체크
      if (isAdminRoute && !admin.admin) {
         alert('관리자만 접근할 수 있습니다.')
         navigate('/')
         return
      }

      // 일반 경로인 경우 통신사 권한 체크
      if (!isAdminRoute && (!user || user.access !== 'agency')) {
         alert('통신사 회원만 요금제를 등록할 수 있습니다.')
         navigate('/')
         return
      }
   }, [admin, user, isAdminRoute, navigate])
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
            const response = await servicesAPI.getAllServices()
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
         const submitData = {
            ...planData,
            status: admin.admin ? 'approved' : 'pending', // 관리자가 등록하는 경우 자동 승인
            agencyId: user?.agency?.id, // 통신사 ID 추가
         }
         const response = await (admin.admin ? plansAPI.createPlanAsAdmin(submitData) : plansAPI.createPlan(submitData))
         if (admin.admin) {
            alert('요금제가 등록되었습니다.')
            navigate('/admin/plans')
         } else {
            alert('요금제가 등록되었습니다. 관리자 승인 후 공개될 예정입니다.')
            navigate('/plans')
         }
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
                  <BasicInfoForm planData={planData} errors={errors} networkTypes={networkTypes} onInputChange={handleInputChange} onPriceChange={handlePriceChange} />

                  <PlanQuotaForm planData={planData} errors={errors} onInputChange={handleInputChange} />

                  <FeatureForm features={planData.features} errors={errors} onFeatureChange={handleFeatureChange} onAddFeature={addFeature} onRemoveFeature={removeFeature} />

                  <ImageUploadForm images={planData.images} errors={errors} onImageUpload={handleImageUpload} onRemoveImage={removeImage} onSetMainImage={setMainImage} />

                  <AdditionalServicesForm services={additionalServices} planServices={planData.services} requiredServices={planData.requiredServices} onServiceToggle={handleServiceToggle} onRequiredServiceToggle={handleRequiredServiceToggle} />
               </div>
            </div>

            {/* 제출 버튼 */}
            <div className="d-flex justify-content-end gap-2">
               <button type="button" className="btn btn-secondary" onClick={() => navigate(isAdminRoute ? '/admin/plans' : '/plans')}>
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
