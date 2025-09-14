import api from './axiosApi'

export const userPlansAPI = {
   createUserPlan: (data) => api.post('/user-plans', data),
  
}

export default userPlansAPI
