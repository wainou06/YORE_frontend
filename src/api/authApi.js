import api from './axiosApi'

export const authAPI = {
   // 인증
   login: (email, password, userType) => api.post('/auth/login', { email, password, userType }),
   register: (userData) => api.post('/auth/register', userData),
   logout: () => api.post('/auth/logout'),

   // 프로필
   getProfile: () => api.get('/auth/profile'),
   updateProfile: (data) => api.put('/auth/profile', data),
   changePassword: (data) => api.put('/auth/profile/password', data),
   updateAgencyProfile: (data) => api.put('/auth/profile/agency', data),
}

export default authAPI
