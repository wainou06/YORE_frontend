import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/global.css'
import '@/assets/css/admin.css'

const AdminLayout = () => {
   const { user } = useSelector((state) => state.auth)

   if (!user) {
      console.log('사용자 정보 없음 - AdminLayout')
      return <Navigate to="/" replace />
   }

   if (user.role !== 'admin') {
      console.log('관리자 권한 없음 - AdminLayout')
      return <Navigate to="/" replace />
   }
   return (
      <div className="admin-layout">
         <nav className="admin-nav">{/* 관리자 네비게이션 */}</nav>
         <main className="admin-main">
            <Outlet />
         </main>
      </div>
   )
}

const AdminRoute = () => {
   // 개발 단계에서는 권한 체크를 비활성화
   return <AdminLayout />
}

export default AdminRoute
