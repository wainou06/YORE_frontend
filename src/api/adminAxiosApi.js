import axios from 'axios'

const adminApi = axios.create({
   baseURL: import.meta.env.VITE_APP_API_URL,
   headers: {
      'Content-Type': 'application/json',
   },
})

adminApi.interceptors.request.use(
   (config) => {
      const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

      if (adminToken) {
         config.headers.Authorization = `Bearer ${adminToken}`
      }
      return config
   },
   (error) => {
      return Promise.reject(error)
   }
)

adminApi.interceptors.response.use(
   (response) => response,
   (error) => {
      const originalRequest = error.config
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true
         localStorage.removeItem('adminToken')
         sessionStorage.removeItem('adminToken')
      }
      return Promise.reject(error)
   }
)

if (!import.meta.env.VITE_APP_API_URL) {
   console.warn('VITE_APP_API_URL이 설정되지 않았습니다.')
}

export default adminApi
