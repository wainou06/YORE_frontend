import { Outlet, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearError as clearAdminError } from '@/features/admin/adminSlice'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/global.css'
import '@/assets/css/admin.css'
import { AdminSidebar } from '@/pages/Admin/AdminSidebar'

const AdminLayout = () => {
   const dispatch = useDispatch()
   const admin = useSelector((state) => state.admin)

   useEffect(() => {
      // 컴포넌트가 unmount될 때 에러 상태 초기화
      return () => {
         dispatch(clearAdminError())
      }
   }, [dispatch])

   if (!admin.admin) {
      console.log('관리자 정보 없음 - AdminLayout')
      dispatch(clearAdminError()) // 관리자 인증 실패 시 에러 초기화
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
