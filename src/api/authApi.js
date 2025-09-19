import api from './axiosApi'

export const authAPI = {
   login: (email, password, userType) => api.post('/auth/login', { email, password, userType }),
   register: (userData) => api.post('/auth/register', userData),
   logout: () => api.post('/auth/logout'),

   getProfile: () => api.get('/auth/profile'),

   updateProfile: ({ email }) => api.post('/auth/change-email', { email }),

   changePassword: ({ currentPassword, newPassword }) => api.post('/auth/change-password', { currentPassword, newPassword }),

   changeBirth: ({ birth }) => api.post('/auth/change-birth', { birth }),

   updateAgencyProfile: ({ agencyName, businessNumber }) => api.put('/auth/profile/agency', { agencyName, businessNumber }),

   findPassword: ({ method, value }) => api.post('/auth/find-password', { method, value }),

   getMyUserPlans: () => {
      const token = localStorage.getItem('token')
      return api.get('/user-plans', {
         headers: { Authorization: token ? `Bearer ${token}` : '' },
      })
   },
}

export default authAPI
