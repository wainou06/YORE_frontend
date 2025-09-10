import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/global.css'
import '@/assets/css/admin.css'
import { AdminSidebar } from '@/pages/Admin/AdminSidebar'
import { clearAdminError } from '@/features/admin/adminSlice'

const AdminLayout = () => {
   const admin = useSelector((state) => state.admin)

   console.log(admin)

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
