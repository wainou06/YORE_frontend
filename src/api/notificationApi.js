import api from './axiosApi'

export const notificationAPI = {
   // 알림 생성
   create: (data) => api.post('/notifications', data),

   // 알림 목록 조회
   list: () => api.get('/notifications'),

   // 알림 읽음 처리
   markAsRead: (id) => api.patch(`/notifications/${id}/read`),

   // 알림 삭제
   delete: (id) => api.delete(`/notifications/${id}`),
}

export default notificationAPI
