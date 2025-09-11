import axios from 'axios'

// 관리자용 axios 인스턴스
export const adminApi = axios.create({
   baseURL: import.meta.env.VITE_APP_API_URL,
   headers: { 'Content-Type': 'application/json' },
})

adminApi.interceptors.request.use((config) => {
   const adminToken = localStorage.getItem('adminToken')
   if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
   }
   return config
})

// axios 인스턴스 생성
const api = axios.create({
   baseURL: import.meta.env.VITE_APP_API_URL,
   headers: {
      'Content-Type': 'application/json',
   },
})

// 요청 인터셉터
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) {
         config.headers.Authorization = `Bearer ${token}`
      }
      return config
   },
   (error) => {
      return Promise.reject(error)
   }
)

// 응답 인터셉터 (refreshToken 재발급 로직 제거, 토큰 만료 시 토큰만 삭제)
api.interceptors.response.use(
   (response) => response,
   (error) => {
      const originalRequest = error.config
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true
         // 토큰 만료 시 토큰 삭제 (refreshToken은 더 이상 사용하지 않음)
         localStorage.removeItem('token')
         sessionStorage.removeItem('token')
         // window.location.href = '/login' // 필요시 주석 해제
      }
      return Promise.reject(error)
   }
)

// Auth API
export const authAPI = {
   // 인증
   login: (email, password, userType) => api.post('/api/auth/login', { email, password, userType }),
   register: (userData) => api.post('/api/auth/register', userData),
   logout: () => api.post('/api/auth/logout'),

   // 프로필
   getProfile: () => api.get('/api/auth/profile'),
   updateProfile: (data) => api.put('/api/auth/profile', data),
   changePassword: (data) => api.put('/api/auth/profile/password', data),
   updateAgencyProfile: (data) => api.put('/api/auth/profile/agency', data),
}

// Admin API
export const adminAPI = {
   // 관리자 인증
   loginAdmin: (credentials) => adminApi.post('/api/admin/login', credentials),
   registerAdmin: (adminData) => adminApi.post('/api/admin/register', adminData),

   // 사용자 관리
   getUsers: (params) => adminApi.get('/api/admin/users', { params }),
   getUser: (id) => adminApi.get(`/api/admin/users/${id}`),
   updateUserStatus: (id, status) => adminApi.patch(`/api/admin/users/${id}/status`, { status }),
   updateUserRole: (id, role) => adminApi.patch(`/api/admin/users/${id}/role`, { role }),

   // 통계
   getAdminStats: () => adminApi.get('/api/admin/statistics'),

   // 로그
   exportLogs: () => adminApi.get('/api/admin/logs/export'),
}

// Services API
export const servicesAPI = {
   // 공개 접근
   getAllServices: (params) => api.get('/services', { params }),
   getService: (id) => api.get(`/services/${id}`),

   // 통신사 전용
   createService: (data) => api.post('/services', data),
   updateService: (id, data) => api.put(`/services/${id}`, data),
   deleteService: (id) => api.delete(`/services/${id}`),
}

// Plans API
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

// User Plans API
export const userPlansAPI = {
   createUserPlan: (data) => api.post('/user-plans', data),
   getUserPlans: (params) => api.get('/user-plans', { params }),
   getUserPlan: (id) => api.get(`/user-plans/${id}`),
   cancelUserPlan: (id) => api.post(`/user-plans/${id}/cancel`),
}

// Survey API
export const surveyAPI = {
   submitSurvey: (data) => api.post('/surveys', data),
   getSurveyResults: (id) => api.get(`/surveys/${id}`),
}

// Transactions API
export const transactionAPI = {
   getTransactions: (params) => api.get('/transactions', { params }),
   getTransaction: (id) => api.get(`/transactions/${id}`),
   createTransaction: (data) => api.post('/transactions', data),
   refundTransaction: (id) => api.post(`/transactions/${id}/refund`),
}

// Analytics API
export const analyticsAPI = {
   // 전체 통계
   getServiceStats: () => api.get('/api/analytics'),

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

// Notifications API
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

// 환경변수 설정 확인
if (!import.meta.env.VITE_APP_API_URL) {
   console.warn('VITE_APP_API_URL이 설정되지 않았습니다.')
}

export default api
