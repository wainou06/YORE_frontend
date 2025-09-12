import api from './axiosApi'

export const servicesAPI = {
   
   createService: (data) => api.post('/services', data),
   
}

export default servicesAPI
