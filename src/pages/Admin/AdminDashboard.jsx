import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { showModalThunk } from '@/features/modal/modalSlice'
import { ModalAlert } from '@/components/common/Modal'
import { useNavigate, Link } from 'react-router-dom'
import '../../assets/css/AdminDashboard.css'
import { getHomeStatusThunk } from '@/features/analytics/analyticsSlice'

const AdminDashboard = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { isAuthenticated } = useSelector((state) => state.admin)
   const modal = useSelector((state) => state.modal)
   const [error, setError] = useState(null)
   const [stats, setStats] = useState({
      totalUsers: 0,
      totalRevenue: 0,
      newUsers: 0,
      averageOrder: 0,
      totalOrders: 0,
      conversionRate: 0,
      recentOrders: [],
   })
   const { loading, home } = useSelector((state) => state.analytics)

   useEffect(() => {
      // 다크 모드 설정 로드
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
         document.documentElement.setAttribute('data-theme', 'dark')
      }

      if (!isAuthenticated) {
         navigate('/')
         return
      }

      dispatch(getHomeStatusThunk())
   }, [dispatch])

   useEffect(() => {
      if (loading == false) {
         setStats({
            totalUsers: home.data?.totalUsers,
            totalRevenue: home.data?.totalRevenue,
            newUsers: home.data?.newUsers,
            averageOrder: home.data?.averageOrder,
            recentOrders: home.data?.recentOrders,
         })
      }
   }, [loading])

   console.log(home)

   return (
      <>
         {modal.type === 'alert' && <ModalAlert />}
         {false ? (
            <div className="text-center my-5">로딩 중...</div>
         ) : (
            <div className="admin-main-content">
               {error && <div className="text-center my-5 text-danger">{error}</div>}
               <div className="page-title">
                  <h2>홈</h2>
               </div>
               <div className="stats-grid">
                  <div className="stat-card">
                     <h3>총 사용자 수</h3>
                     <div className="stat-value">{(stats.totalUsers ?? 0).toLocaleString()}</div>
                     <div className="stat-change positive">+{stats.newUsers}</div>
                  </div>
                  <div className="stat-card">
                     <h3>총 수익</h3>
                     <div className="stat-value">₩{(stats.totalRevenue ?? 0).toLocaleString()}</div>
                     <div className="stat-change positive">+5%</div>
                  </div>
                  <div className="stat-card">
                     <h3>신규 가입자(하루)</h3>
                     <div className="stat-value">{(stats.newUsers ?? 0).toLocaleString()}</div>
                     <div className="stat-change positive">+15%</div>
                  </div>
                  <div className="stat-card">
                     <h3>평균 결제 금액</h3>
                     <div className="stat-value">₩{(stats.averageOrder ?? 0).toLocaleString()}</div>
                     <div className="stat-change negative">-2%</div>
                  </div>
               </div>
               <section className="recent-section">
                  <h2>최근 결제 내역</h2>
                  <div className="table-container">
                     <table className="admin-table">
                        <thead>
                           <tr>
                              <th>사용자</th>
                              <th>요금제</th>
                              <th>결제 금액</th>
                              <th>상태</th>
                              <th>결제일</th>
                           </tr>
                        </thead>
                        <tbody>
                           {stats?.recentOrders?.map((order) => (
                              <tr key={order.id}>
                                 <td>{order.userName}</td>
                                 <td>{order.planName}</td>
                                 <td>₩{order.totalAmount.toLocaleString()}</td>
                                 <td>
                                    <span className={`status-badge ${order.status}`}>{order.status === 'success' ? '완료' : order.status === 'pending' ? '대기' : '취소'}</span>
                                 </td>
                                 <td>{order.date}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </section>
            </div>
         )}
      </>
   )
}

export default AdminDashboard
