import api from './axiosApi'

export const plansAPI = {
   // 요금제 생성
   createPlan: (data) => api.post('/plans', data),
   // 요금제 목록 조회 (권한별 분기)
   getPlans: () => api.get('/plans'),
   // 통신사별 요금제 목록 조회
   getPlansByAgency: (agencyId) => api.get(`/plans?agencyId=${agencyId}`),
   // 요금제 수정
   updatePlan: (id, data) => api.put(`/plans/${id}`, data),
   // 요금제 삭제
   deletePlan: (id) => api.delete(`/plans/${id}`),
   // 단일 요금제 상세 조회
   getPlanById: (id) => api.get(`/plans/${id}`),
   // 통신사 전체 조회
   getAgencies: () => api.get('/agencies'),
}

export default plansAPI
