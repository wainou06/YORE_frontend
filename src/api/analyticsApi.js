import api from './adminAxiosApi'

export const analyticsAPI = {
   //홈 통계
   getHomeStatus: () => api.get('/analytics/getHomeStatus'),
   getUserStatus: ({ page, filter }) => api.get(`/analytics/getUserStatus?page=${page}&filter=${filter}`),
   getPlansStatus: ({ page, filter }) => api.get(`/analytics/getPlansStatus?page=${page}&filter=${filter}`),
   getOrdersStatus: ({ page, filterName, filterStatus }) => api.get(`/analytics/getOrdersStatus?page=${page}&filterName=${filterName}&filterStatus=${filterStatus}`),
   getUserDetail: (id) => api.get(`/analytics/getUserDetail?id=${id}`),
   putPlanStatus: ({ id, status }) => api.put(`/analytics/putPlanStatus?id=${id}&status=${status}`),

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
