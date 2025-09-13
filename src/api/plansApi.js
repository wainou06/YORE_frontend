import api from './axiosApi'

export const plansAPI = {
   
   createPlan: (data) => api.post('/plans', data),

}

export default plansAPI
