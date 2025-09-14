import api from './axiosApi'

export const transactionAPI = {
   
   createTransaction: (data) => api.post('/transactions', data),
   
}

export default transactionAPI
