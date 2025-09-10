import { Routes, Route } from 'react-router-dom'
import Layout from '@components/common/Layout'
import LandingPage from '@pages/Landing/LandingPage'
import SignupPage from '@pages/Auth/SignupPage'
import OAuthCallback from '@pages/Auth/OAuthCallback'
import PlanListPage from '@pages/Plans/PlanListPage'
import CarrierListPage from '@pages/Carriers/CarrierListPage'
import PlanDetailPage from '@pages/Plans/PlanDetailPage'
import CheckoutPage from '@pages/Checkout/CheckoutPage'
import CheckoutCompletePage from '@pages/Checkout/CheckoutCompletePage'
import AdminRoute from './AdminRoute'
import AdminDashboard from '@pages/Admin/AdminDashboard'
import UserManagement from '@pages/Admin/UserManagement'
import PlanManagement from '@pages/Admin/PlanManagement'
import OrderManagement from '@pages/Admin/OrderManagement'
import NotFoundPage from '@pages/Error/NotFoundPage'
import TermsPage from '@pages/Legal/TermsPage'
import PrivacyPage from '@pages/Legal/PrivacyPage'
import KakaoCallback from '@components/common/KakaoCallback'

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="auth/callback" element={<OAuthCallback />} />

            <Route path="auth/kakao/callback" element={<KakaoCallback />} />

            <Route path="plans" element={<PlanListPage />} />
            <Route path="plans/:id" element={<PlanDetailPage />} />
            <Route path="carriers" element={<CarrierListPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/complete" element={<CheckoutCompletePage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
         </Route>

         {/* 관리자 라우트 - 별도의 레이아웃으로 분리 */}
         <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="plans" element={<PlanManagement />} />
            <Route path="orders" element={<OrderManagement />} />
         </Route>

         {/* 404 Not Found 페이지 */}
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
   )
}

export default AppRoutes
