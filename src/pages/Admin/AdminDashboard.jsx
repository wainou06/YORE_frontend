import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { analyticsAPI } from '@/services/api'
import { showModalThunk } from '@/features/modal/modalSlice'
import { ModalAlert } from '@/components/common/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { statsAPI } from '../../services/api'
import '../../assets/css/AdminDashboard.css'
import { getTotalUsersThunk } from '@/features/analytics/analyticsSlice'

const AdminDashboard = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { admin, isAuthenticated } = useSelector((state) => state.admin)
   const modal = useSelector((state) => state.modal)
   const [darkMode, setDarkMode] = useState(false)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
   const [inquiries, setInquiries] = useState([])
   const [stats, setStats] = useState({
      totalUsers: 0,
      totalRevenue: 0,
      newUsers: 0,
      averageOrder: 0,
      totalOrders: 0,
      conversionRate: 0,
      recentOrders: [],
   })
   const totalUsers = useSelector((state) => state.analytics)
   console.log(totalUsers)

   useEffect(() => {
      // 다크 모드 설정 로드
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
         setDarkMode(true)
         document.documentElement.setAttribute('data-theme', 'dark')
      }

      if (!admin || !isAuthenticated) {
         dispatch(showModalThunk({ type: 'alert', placeholder: '관리자 권한이 없습니다.' }))
         return
      }

      const fetchStats = async () => {
         setLoading(true)
         setError(null)
         try {
            const [statsResponse, inquiriesResponse] = await Promise.all([analyticsAPI.getServiceStats(), analyticsAPI.getServiceStats()])
            setStats(typeof statsResponse.data === 'object' && statsResponse.data !== null ? statsResponse.data : {})
            setInquiries(Array.isArray(inquiriesResponse.data) ? inquiriesResponse.data : [])
         try {
            dispatch(getTotalUsersThunk())
            // API 호출로 데이터 가져오기
            const [statsResponse, inquiriesResponse] = await Promise.all([statsAPI.getDashboardStats(), statsAPI.getInquiries()])

            setStats(statsResponse.data)
            setInquiries(inquiriesResponse.data)
         } catch (error) {
            // 임시 데이터로 폴백
            const mockOrders = [
               { id: 1, customerName: '홍길동', planName: 'SKT 5G 언택트 52', amount: 52000, status: 'completed', date: '2025-09-05' },
               { id: 2, customerName: '김철수', planName: 'KT 5G 슈퍼플랜', amount: 65000, status: 'completed', date: '2025-09-04' },
               { id: 3, customerName: '이영희', planName: 'LG U+ 5G 프리미엄', amount: 85000, status: 'pending', date: '2025-09-03' },
               { id: 4, customerName: '박지성', planName: 'SKT 5G 점프', amount: 45000, status: 'completed', date: '2025-09-02' },
               { id: 5, customerName: '최민수', planName: 'KT 5G 베이직', amount: 38000, status: 'cancelled', date: '2025-09-01' },
            ]
            const totalOrders = mockOrders.length
            const totalRevenue = mockOrders.filter((order) => order.status === 'completed').reduce((sum, order) => sum + order.amount, 0)
            const completedOrders = mockOrders.filter((order) => order.status === 'completed').length
            const conversionRate = ((completedOrders / totalOrders) * 100).toFixed(1)
            const averageOrder = Math.round(totalRevenue / completedOrders)
            setStats({
               totalUsers: 150,
               totalOrders,
               totalRevenue,
               conversionRate,
               newUsers: 15,
               averageOrder,
               recentOrders: mockOrders.sort((a, b) => new Date(b.date) - new Date(a.date)),
            })
            setInquiries([
               { id: 1, userName: '김민지', content: '요금제 변경 문의', status: 'pending', date: '2025-09-05' },
               { id: 2, userName: '박지훈', content: '결제 오류 문의', status: 'completed', date: '2025-09-04' },
               { id: 3, userName: '최서연', content: '서비스 이용 문의', status: 'pending', date: '2025-09-03' },
               { id: 4, userName: '이준호', content: '환불 문의', status: 'completed', date: '2025-09-02' },
               { id: 5, userName: '정하윤', content: '계정 관련 문의', status: 'pending', date: '2025-09-01' },
            ])
            setError(null)
         } finally {
            setLoading(false)
         }
      }

      fetchStats()
   }, [admin, isAuthenticated, dispatch])

   // 모달이 닫힐 때 홈으로 이동
   useEffect(() => {
      if (modal.type === null && (!admin || !isAuthenticated)) {
         navigate('/')
      }
   }, [modal.type, admin, isAuthenticated, navigate])
   }, [navigate])

   return (
      <>
         {modal.type === 'alert' && <ModalAlert />}
         {loading ? (
            <div className="text-center my-5">로딩 중...</div>
         ) : (
            <div className="admin-main-content">
               {error && <div className="text-center my-5 text-danger">{error}</div>}
               <div className="page-title">
                  <h1>홈</h1>
               </div>
               <div className="stats-grid">
                  <div className="stat-card">
                     <h3>총 사용자 수</h3>
                     <div className="stat-value">{(stats.totalUsers ?? 0).toLocaleString()}</div>
                     <div className="stat-change positive">+10%</div>
                  </div>
                  <div className="stat-card">
                     <h3>총 수익</h3>
                     <div className="stat-value">₩{(stats.totalRevenue ?? 0).toLocaleString()}</div>
                     <div className="stat-change positive">+5%</div>
                  </div>
                  <div className="stat-card">
                     <h3>신규 가입자</h3>
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
                           {(Array.isArray(stats.recentOrders) ? stats.recentOrders : []).map((order) => (
                              <tr key={order.id}>
                                 <td>{order.customerName}</td>
                                 <td>{order.planName}</td>
                                 <td>₩{order.amount.toLocaleString()}</td>
                                 <td>
                                    <span className={`status-badge ${order.status}`}>{order.status === 'completed' ? '완료' : order.status === 'pending' ? '대기' : '취소'}</span>
                                 </td>
                                 <td>{order.date}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </section>
               <section className="recent-section">
                  <h2>최근 문의 사항</h2>
                  <div className="table-container">
                     <table className="admin-table">
                        <thead>
                           <tr>
                              <th>사용자</th>
                              <th>문의 내용</th>
                              <th>상태</th>
                              <th>문의일</th>
                           </tr>
                        </thead>
                        <tbody>
                           {(Array.isArray(inquiries) ? inquiries : []).map((inquiry) => (
                              <tr key={inquiry.id}>
                                 <td>{inquiry.userName}</td>
                                 <td>{inquiry.content}</td>
                                 <td>
                                    <span className={`status-badge ${inquiry.status}`}>{inquiry.status === 'completed' ? '완료' : '처리 중'}</span>
                                 </td>
                                 <td>{inquiry.date}</td>
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
