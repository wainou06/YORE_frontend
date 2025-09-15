import api from './adminAxiosApi'

export const analyticsAPI = {
   //홈 통계
   getHomeStatus: () => api.get('/analytics/getHomeStatus'),
   getUserStatus: (page) => api.get(`/analytics/getUserStatus?page=${page}`),
   getPlansStatus: (page) => api.get(`/analytics/getPlansStatus?page=${page}`),
   getOrdersStatus: (page) => api.get(`/analytics/getOrdersStatus?page=${page}`),

   // 전체 통계
   getServiceStats: () => api.get('/analytics'),

   // 서비스별 통계
   getServiceDetailStats: (serviceId) => api.get(`/analytics/services/${serviceId}`),

   // 통신사별 통계
   getAgencyStats: (agencyId) => api.get(`/analytics/agencies/${agencyId}`),

   // 기간별 통계
   getPeriodStats: (params) => api.get('/analytics/period', { params }),

   // 조회수/구매 통계
   incrementViewCount: (serviceId) => api.post(`/analytics/${serviceId}/view`),
   updatePurchaseStats: (serviceId) => api.post(`/analytics/${serviceId}/purchase`),
}

export default analyticsAPI
