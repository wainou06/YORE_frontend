import adminApi from './adminAxiosApi'

export const adminAPI = {
   // 관리자 인증
   loginAdmin: (credentials) => adminApi.post('/admin/login', credentials),
   registerAdmin: (adminData) => adminApi.post('/admin/register', adminData),

   // 사용자 관리
   getUsers: (params) => adminApi.get('/admin/users', { params }),
   getUser: (id) => adminApi.get(`/admin/users/${id}`),
   updateUserStatus: (id, status) => adminApi.patch(`/admin/users/${id}/status`, { status }),
   updateUserRole: (id, role) => adminApi.patch(`/admin/users/${id}/role`, { role }),

   // 통계
   getAdminStats: () => adminApi.get('/admin/statistics'),

   // 로그
   exportLogs: () => adminApi.get('/admin/logs/export'),
}
