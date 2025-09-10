import api, { plansAPI, servicesAPI } from './api'

export const planService = {
   ...plansAPI,

   // 통신사의 요금제 목록 조회
   getAgencyPlans: async () => {
      const response = await api.get('/api/plans/agency')
      return response.data
   },

   // 이미지가 포함된 요금제 생성을 위한 특수 메서드
   createPlanWithImages: async (planData) => {
      try {
         const formData = new FormData()

         // 이미지 파일 처리
         if (planData.images && planData.images.length > 0) {
            planData.images.forEach((image, index) => {
               formData.append('images', image.file)
               formData.append(
                  `images_metadata`,
                  JSON.stringify({
                     index,
                     isMain: image.isMain || false,
                  })
               )
            })
         }

         // JSON 데이터 처리
         const { images, ...rest } = planData
         formData.append('data', JSON.stringify(rest))

         const response = await api.post('/plans', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         })
         return response.data
      } catch (error) {
         throw error
      }
   },

   // 승인 대기 중인 요금제 목록 조회
   getPendingPlans: () => plansAPI.getPlans({ status: 'pending' }),

   // 승인된 요금제 목록 조회
   getApprovedPlans: () => plansAPI.getPlans({ status: 'approved' }),

   // 특정 통신사의 요금제 목록 조회
   getCarrierPlans: (carrierId) => plansAPI.getPlans({ carrierId }),

   // 요금제 승인/반려 처리
   approvePlan: (id, status, rejectionReason) => api.post(`/plans/${id}/approve`, { status, rejectionReason }),
}

export const serviceService = {
   ...servicesAPI,

   // 사용 가능한 부가 서비스 목록 조회
   getAvailableServices: () => servicesAPI.getServices({ isAvailable: true }),

   // 특정 요금제의 필수 부가 서비스 목록 조회
   getPlanRequiredServices: (planId) => api.get(`/plans/${planId}/required-services`),

   // 요금제에 부가 서비스 연결
   attachServiceToPlan: (planId, serviceId, isRequired = false) => api.post(`/plans/${planId}/services`, { serviceId, isRequired }),

   // 요금제에서 부가 서비스 제거
   detachServiceFromPlan: (planId, serviceId) => api.delete(`/plans/${planId}/services/${serviceId}`),
}
