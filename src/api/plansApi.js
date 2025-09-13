import api from './axiosApi'

export const plansAPI = {
   // 요금제 생성
   createPlan: (data) => api.post('/plans', data),
   // 요금제 목록 조회 (권한별 분기)
   getPlans: () => api.get('/plans'),
}

export default plansAPI
