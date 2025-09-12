import api from './axiosApi'

export const userPlansAPI = {
   createUserPlan: (data) => api.post('/user-plans', data),
   getUserPlans: (params) => api.get('/user-plans', { params }),
   getUserPlan: (id) => api.get(`/user-plans/${id}`),
   cancelUserPlan: (id) => api.post(`/user-plans/${id}/cancel`),
}
