import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/global.css'
import '@/assets/css/admin.css'
import { AdminSidebar } from '@/pages/Admin/AdminSidebar'
import { clearAdminError } from '@/features/admin/adminSlice'

const AdminLayout = () => {
   const { isAuthenticated } = useSelector((state) => state.admin)

   if (!isAuthenticated) {
      console.log('관리자 인증 필요 - AdminLayout')
      return <Navigate to="/admin/login" replace />
   }
   return (
      <div className="admin-layout">
         <div className="admin-container">
            <div className="admin-content">
               <div className="admin-layout-container">
                  <div className="admin-sidebar">
                     <AdminSidebar />
                  </div>
                  {/* <main className="admin-main"> */}
                  <Outlet />
                  {/* </main> */}
               </div>
            </div>
         </div>

         {/* <div></div> */}
      </div>
   )
}

const AdminRoute = () => {
   // 개발 단계에서는 권한 체크를 비활성화
   return <AdminLayout />
}

export default AdminRoute
