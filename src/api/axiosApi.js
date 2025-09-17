import axios from 'axios'

const api = axios.create({
   baseURL: import.meta.env.VITE_APP_API_URL,
})

api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')
      if (token) {
         config.headers.Authorization = `Bearer ${token}`
      }
      if (adminToken) {
         config.headers.Authorization = `Bearer ${adminToken}`
      }
      return config
   },
   (error) => {
      return Promise.reject(error)
   }
)

api.interceptors.response.use(
   (response) => response,
   (error) => {
      const originalRequest = error.config
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true
         localStorage.removeItem('token')
         sessionStorage.removeItem('token')
         localStorage.removeItem('adminToken')
         sessionStorage.removeItem('adminToken')
      }
      return Promise.reject(error)
   }
)

if (!import.meta.env.VITE_APP_API_URL) {
   console.warn('VITE_APP_API_URL이 설정되지 않았습니다.')
}

export default api
