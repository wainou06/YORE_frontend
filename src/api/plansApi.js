import api from './axiosApi'

export const plansAPI = {
   // 공개 접근
   getPlans: (params) => api.get('/plans', { params }),
   getPlan: (id) => api.get(`/plans/${id}`),

   // 통신사 전용 (CRUD)
   getAgencyPlans: () => api.get('/plans/agency'),
   createPlan: (formData) => {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
      return api.post('/plans', formData, config)
   },
   updatePlan: (id, data) => api.put(`/plans/${id}`, data),
   deletePlan: (id) => api.delete(`/plans/${id}`),

   // 관리자 전용
   // 승인/반려
   approvePlan: (id, { status, rejectionReason }) => api.patch(`/plans/${id}/approve`, { status, rejectionReason }),
   // 관리자도 요금제 등록/삭제 가능
   createPlanAsAdmin: (formData) => {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
      return api.post('/plans', formData, config)
   },
   deletePlanAsAdmin: (id) => api.delete(`/plans/${id}`),
}

export default plansAPI
