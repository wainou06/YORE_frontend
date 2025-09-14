import { Routes, Route } from 'react-router-dom'
import Layout from '@components/common/Layout'
import LandingPage from '@pages/Landing/LandingPage'
import SignupPage from '@pages/Auth/SignupPage'
import PlanListPage from '@pages/Plans/PlanListPage'
import CarrierListPage from '@pages/Carriers/CarrierListPage'
import PlanDetailPage from '@pages/Plans/PlanDetailPage'
import CheckoutPage from '@pages/Checkout/CheckoutPage'
import CheckoutCompletePage from '@pages/Checkout/CheckoutCompletePage'
import AdminRoute from './AdminRoute'
import AdminDashboard from '@pages/Admin/AdminDashboard'
import UserManagement from '@pages/Admin/UserManagement'
import PlanManagement from '@pages/Admin/PlanManagement'
import PlanCreatePage from '@pages/Plans/PlanCreatePage'
import OrderManagement from '@pages/Admin/OrderManagement'
import NotFoundPage from '@pages/Error/NotFoundPage'
import TermsPage from '@pages/Legal/TermsPage'
import PrivacyPage from '@pages/Legal/PrivacyPage'
import KakaoCallback from '@components/common/KakaoCallback'
import MyInfo from '@pages/Auth/MyInfo'
import MySettings from '@pages/Auth/MySettings'
import PlanSettings from '@pages/Auth/PlanSettings'
import Billing from '@pages/Auth/Billing'
import AgencyPlanList from '@pages/Agency/AgencyPlanList'
import AgencyRoute from './AgencyRoute'
import AgencySettings from '@/pages/Agency/AgencySettings'
import AgencyPlanSettings from '@/pages/Agency/AgencyPlanSettings'

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="signup" element={<SignupPage />} />

            {/* 내 정보 */}
            <Route path="myinfo" element={<MyInfo />} />
            <Route path="myinfo/mysettings" element={<MySettings />} />
            <Route path="myinfo/plansettings" element={<PlanSettings />} />
            <Route path="myinfo/billing" element={<Billing />} />

            {/* 인증 */}
            <Route path="auth/kakao/callback" element={<KakaoCallback />} />

            {/* 요금제 */}
            <Route path="plans">
               <Route index element={<PlanListPage />} />
               <Route path=":id" element={<PlanDetailPage />} />
            </Route>

            <Route path="carriers" element={<CarrierListPage />} />

            {/* 결제 */}
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/complete" element={<CheckoutCompletePage />} />

            {/* 정책 */}
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
         </Route>

         {/* 에이전시 라우트 */}
         <Route path="/agency" element={<AgencyRoute />}>
            <Route path="plans">
               <Route index element={<AgencyPlanList />} />
               <Route path="create" element={<PlanCreatePage />} />
            </Route>
            <Route path="agencySettings" element={<AgencySettings />} />
            <Route path="agencyPlanSettings" element={<AgencyPlanSettings />} />
         </Route>

         {/* 관리자 라우트 - 별도의 레이아웃으로 분리 */}
         <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="plans" element={<PlanManagement />} />
            <Route path="plans/create" element={<PlanCreatePage />} />
            <Route path="orders" element={<OrderManagement />} />
         </Route>

         {/* 404 Not Found 페이지 */}
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
   )
}

export default AppRoutes
