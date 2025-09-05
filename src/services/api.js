import axios from 'axios'

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
      const token = localStorage.getItem('token')
      if (token) {
         config.headers.Authorization = `Bearer ${token}`
      }
      return config
   },
   (error) => {
      return Promise.reject(error)
   }
)

// 응답 인터셉터
api.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config

      // 토큰 만료 시 처리 (401 에러)
      if (error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true

         try {
            const refreshToken = localStorage.getItem('refreshToken')
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/refresh`, {
               refreshToken,
            })

            const { token } = response.data
            localStorage.setItem('token', token)

            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
         } catch (error) {
            // 리프레시 토큰도 만료된 경우
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return Promise.reject(error)
         }
      }

      return Promise.reject(error)
   }
)

export const authAPI = {
   login: (credentials) => api.post('/auth/login', credentials),
   register: (userData) => api.post('/auth/register', userData),
   logout: () => api.post('/auth/logout'),
   getCurrentUser: () => api.get('/auth/me'),
}

export const usersAPI = {
   getUsers: (params) => api.get('/users', { params }),
   getUser: (id) => api.get(`/users/${id}`),
   updateUser: (id, data) => api.put(`/users/${id}`, data),
   deleteUser: (id) => api.delete(`/users/${id}`),
}

export const plansAPI = {
   getPlans: () => api.get('/plans'),
   getPlan: (id) => api.get(`/plans/${id}`),
   createPlan: (data) => api.post('/plans', data),
   updatePlan: (id, data) => api.put(`/plans/${id}`, data),
   deletePlan: (id) => api.delete(`/plans/${id}`),
}

export const ordersAPI = {
   getOrders: (params) => api.get('/orders', { params }),
   getOrder: (id) => api.get(`/orders/${id}`),
   createOrder: (data) => api.post('/orders', data),
   updateOrder: (id, data) => api.put(`/orders/${id}`, data),
   cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
}

export const statsAPI = {
   getDashboardStats: () => api.get('/stats/dashboard'),
   getUserStats: () => api.get('/stats/users'),
   getOrderStats: () => api.get('/stats/orders'),
   getRevenueStats: () => api.get('/stats/revenue'),
   getInquiries: (params) => api.get('/inquiries', { params }),
}

// 환경변수 설정 확인
if (!import.meta.env.VITE_APP_API_URL) {
   console.warn('VITE_APP_API_URL이 설정되지 않았습니다.')
}

export default api
