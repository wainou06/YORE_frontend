import api from './axiosApi'

export const userPlansAPI = {
   // 내 요금제 생성
   createUserPlan: (data) => api.post('/user-plans', data),
   // 내 요금제 목록 조회
   getMyUserPlans: () => api.get('/user-plans'),
   // 내 요금제 청구서 조회
   getMyUserPlanBill: () => api.get('/user-plans/bill'),
}

export default userPlansAPI
