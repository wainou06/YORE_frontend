import api from './axiosApi'

export const notificationAPI = {
   // 알림 생성/조회
   createNotification: (data) => api.post('/notifications', data),
   getNotifications: (params) => api.get('/notifications', { params }),

   // 알림 상태 관리
   getUnreadCount: () => api.get('/notifications/unread-count'),
   markAsRead: (id) => api.patch(`/notifications/${id}/read`),
   markAllAsRead: () => api.patch('/notifications/read-all'),

   // 필터링된 알림 조회
   getNotificationsByType: (type) => api.get(`/notifications/type/${type}`),
   getServiceNotifications: (serviceId) => api.get(`/notifications/services/${serviceId}`),
   getAgencyNotifications: (agencyId) => api.get(`/notifications/agencies/${agencyId}`),
}

export default notificationAPI
