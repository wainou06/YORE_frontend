import adminApi from './adminAxiosApi'

export const adminAPI = {
   // 관리자 인증
   loginAdmin: (credentials) => adminApi.post('/api/admin/login', credentials),
   registerAdmin: (adminData) => adminApi.post('/api/admin/register', adminData),

   // 사용자 관리
   getUsers: (params) => adminApi.get('/api/admin/users', { params }),
   getUser: (id) => adminApi.get(`/api/admin/users/${id}`),
   updateUserStatus: (id, status) => adminApi.patch(`/api/admin/users/${id}/status`, { status }),
   updateUserRole: (id, role) => adminApi.patch(`/api/admin/users/${id}/role`, { role }),

   // 통계
   getAdminStats: () => adminApi.get('/api/admin/statistics'),

   // 로그
   exportLogs: () => adminApi.get('/api/admin/logs/export'),
}
