import api from './axiosApi'

export const authAPI = {
   // 인증
   login: (email, password, userType) => api.post('/auth/login', { email, password, userType }),
   register: (userData) => api.post('/auth/register', userData),
   logout: () => api.post('/auth/logout'),

   // 프로필 조회
   getProfile: () => api.get('/auth/profile'),

   // 이메일 변경
   updateProfile: ({ email }) => api.post('/auth/change-email', { email }),

   // 비밀번호 변경
   changePassword: ({ currentPassword, newPassword }) => api.post('/auth/change-password', { currentPassword, newPassword }),

   // 생일 변경
   changeBirth: ({ birth }) => api.post('/auth/change-birth', { birth }),

   // 기업 정보 수정
   updateAgencyProfile: ({ agencyName, businessNumber }) => api.put('/auth/profile/agency', { agencyName, businessNumber }),
}

export default authAPI
