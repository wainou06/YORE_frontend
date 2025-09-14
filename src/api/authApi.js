import api from './axiosApi'

export const authAPI = {
   // 인증
   login: (email, password, userType) => api.post('/auth/login', { email, password, userType }),
   register: (userData) => api.post('/auth/register', userData),
   logout: () => api.post('/auth/logout'),

   // 프로필
   getProfile: () => api.get('/auth/profile'),

   // 이메일 변경
   updateProfile: ({ email }) => api.put('/auth/profile', { email }), // PUT으로 변경

   // 비밀번호 변경
   changePassword: ({ currentPassword, newPassword }) => api.put('/auth/profile/password', { currentPassword, newPassword }),

   // 생일 변경
   changeBirth: ({ birth }) => api.put('/auth/profile/birth', { birth }), // PUT으로 일관

   // 기업 정보 수정
   updateAgencyProfile: ({ agencyName, businessNumber }) => api.put('/auth/profile/agency', { agencyName, businessNumber }), // URL과 PUT 일치
}

export default authAPI
