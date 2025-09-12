import api from './axiosApi'

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
