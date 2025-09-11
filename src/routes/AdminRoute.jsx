import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/global.css'
import '@/assets/css/admin.css'
import { AdminSidebar } from '@/pages/Admin/AdminSidebar'

const AdminLayout = () => {
   // const adminInfo = localStorage.getItem('adminInfo')

   // console.log(adminInfo)

   // const admin = useSelector((state) => state.admin)

   const admin = sessionStorage.getItem('admin')
   console.log(admin)

   if (!admin) {
      console.log('관리자 정보 없음')
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
                  <Outlet />
               </div>
            </div>
         </div>
      </div>
   )
}

const AdminRoute = () => {
   return <AdminLayout />
}

export default AdminRoute
