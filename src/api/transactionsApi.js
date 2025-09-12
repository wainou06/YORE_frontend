import api from './axiosApi'

export const transactionAPI = {
   getTransactions: (params) => api.get('/transactions', { params }),
   getTransaction: (id) => api.get(`/transactions/${id}`),
   createTransaction: (data) => api.post('/transactions', data),
   refundTransaction: (id) => api.post(`/transactions/${id}/refund`),
}

export default transactionAPI
