import axios from './axiosApi'

// userId로 부가서비스 조회
export const getUserServicesByUserId = async (userId) => {
   const res = await axios.get('/user-services', {
      params: { userId },
   })
   return res.data
}
