import api from './axiosApi'

export const servicesAPI = {
   // 공개 접근
   getAllServices: (params) => api.get('/services', { params }),
   getService: (id) => api.get(`/services/${id}`),

   // 통신사 전용
   createService: (data) => api.post('/services', data),
   updateService: (id, data) => api.put(`/services/${id}`, data),
   deleteService: (id) => api.delete(`/services/${id}`),
}
