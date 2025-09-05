import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { statsAPI } from '../../services/api'
import { faHome, faUsers, faCreditCard, faShoppingCart, faHandshake, faQuestionCircle, faMoon, faSearch } from '@fortawesome/free-solid-svg-icons'
import '../../assets/css/AdminDashboard.css'

const AdminDashboard = () => {
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.auth)
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

   useEffect(() => {
      // 다크 모드 설정 로드
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
         setDarkMode(true)
         document.documentElement.setAttribute('data-theme', 'dark')
      }

      if (!user || user.role !== 'admin') {
         console.log('관리자 권한 없음')
         navigate('/')
         return
      }

      const fetchStats = async () => {
         try {
            // API 호출로 데이터 가져오기
            const [statsResponse, inquiriesResponse] = await Promise.all([statsAPI.getDashboardStats(), statsAPI.getInquiries()])

            setStats(statsResponse.data)
            setInquiries(inquiriesResponse.data)
         } catch (error) {
            console.error('통계 데이터 로드 실패:', error)

            // 임시 데이터로 폴백
            const mockOrders = [
               {
                  id: 1,
                  customerName: '홍길동',
                  planName: 'SKT 5G 언택트 52',
                  amount: 52000,
                  status: 'completed',
                  date: '2025-09-05',
               },
               {
                  id: 2,
                  customerName: '김철수',
                  planName: 'KT 5G 슈퍼플랜',
                  amount: 65000,
                  status: 'completed',
                  date: '2025-09-04',
               },
               {
                  id: 3,
                  customerName: '이영희',
                  planName: 'LG U+ 5G 프리미엄',
                  amount: 85000,
                  status: 'pending',
                  date: '2025-09-03',
               },
               {
                  id: 4,
                  customerName: '박지성',
                  planName: 'SKT 5G 점프',
                  amount: 45000,
                  status: 'completed',
                  date: '2025-09-02',
               },
               {
                  id: 5,
                  customerName: '최민수',
                  planName: 'KT 5G 베이직',
                  amount: 38000,
                  status: 'cancelled',
                  date: '2025-09-01',
               },
            ]

            // 총 주문 수 계산
            const totalOrders = mockOrders.length

            // 완료된 주문의 총 매출 계산
            const totalRevenue = mockOrders.filter((order) => order.status === 'completed').reduce((sum, order) => sum + order.amount, 0)

            // 주문 완료율 계산
            const completedOrders = mockOrders.filter((order) => order.status === 'completed').length
            const conversionRate = ((completedOrders / totalOrders) * 100).toFixed(1)

            // 평균 주문 금액 계산
            const averageOrder = Math.round(totalRevenue / completedOrders)

            setStats({
               totalUsers: 150, // 임시 사용자 수
               totalOrders,
               totalRevenue,
               conversionRate,
               newUsers: 15, // 임시 신규 사용자 수
               averageOrder,
               recentOrders: mockOrders.sort((a, b) => new Date(b.date) - new Date(a.date)),
            })

            // 임시 문의 데이터 설정
            setInquiries([
               {
                  id: 1,
                  userName: '김민지',
                  content: '요금제 변경 문의',
                  status: 'pending',
                  date: '2025-09-05',
               },
               {
                  id: 2,
                  userName: '박지훈',
                  content: '결제 오류 문의',
                  status: 'completed',
                  date: '2025-09-04',
               },
               {
                  id: 3,
                  userName: '최서연',
                  content: '서비스 이용 문의',
                  status: 'pending',
                  date: '2025-09-03',
               },
               {
                  id: 4,
                  userName: '이준호',
                  content: '환불 문의',
                  status: 'completed',
                  date: '2025-09-02',
               },
               {
                  id: 5,
                  userName: '정하윤',
                  content: '계정 관련 문의',
                  status: 'pending',
                  date: '2025-09-01',
               },
            ])
         }
      }

      fetchStats()
   }, [user, navigate])

   return (
      <div className="admin-container">
         <div className="admin-content">
            <div className="admin-layout-container">
               {/* 좌측 사이드바 */}
               <div className="admin-sidebar">
                  <div className="sidebar-content">
                     <div className="sidebar-header">
                        <Link to="/admin" className="logo">
                           YORE
                        </Link>
                     </div>
                     <nav className="sidebar-menu">
                        <Link to="/admin" className="menu-item active">
                           <FontAwesomeIcon icon={faHome} />
                           <span>홈</span>
                        </Link>
                        <Link to="/admin/users" className="menu-item">
                           <FontAwesomeIcon icon={faUsers} />
                           <span>사용자</span>
                        </Link>
                        <Link to="/admin/plans" className="menu-item">
                           <FontAwesomeIcon icon={faCreditCard} />
                           <span>요금제</span>
                        </Link>
                        <Link to="/admin/orders" className="menu-item">
                           <FontAwesomeIcon icon={faShoppingCart} />
                           <span>결제</span>
                        </Link>
                        <Link to="/admin/partners" className="menu-item">
                           <FontAwesomeIcon icon={faHandshake} />
                           <span>제휴사</span>
                        </Link>
                        <Link to="/admin/inquiries" className="menu-item">
                           <FontAwesomeIcon icon={faQuestionCircle} />
                           <span>문의</span>
                        </Link>
                     </nav>
                     <div className="sidebar-footer">
                        <div
                           className="menu-item"
                           onClick={() => {
                              const newDarkMode = !darkMode
                              setDarkMode(newDarkMode)
                              document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light')
                              localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
                           }}
                           style={{ cursor: 'pointer' }}
                        >
                           <FontAwesomeIcon icon={faMoon} />
                           <span>다크 모드 {darkMode ? '끄기' : '켜기'}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 메인 컨텐츠 */}
               <div className="admin-main-content">
                  {/* 상단 헤더 */}
                  <div className="main-header">
                     <div className="header-logo">
                        <FontAwesomeIcon icon={faHome} />
                        <span>YORE</span>
                     </div>
                     <div className="header-right">
                        <div className="search-bar">
                           <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <img className="profile-image" src="https://placehold.co/40x40" alt="Profile" />
                     </div>
                  </div>

                  {/* 페이지 제목 */}
                  <div className="page-title">
                     <h1>홈</h1>
                  </div>

                  {/* 통계 카드 */}
                  <div className="stats-grid">
                     <div className="stat-card">
                        <h3>총 사용자 수</h3>
                        <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
                        <div className="stat-change positive">+10%</div>
                     </div>
                     <div className="stat-card">
                        <h3>총 수익</h3>
                        <div className="stat-value">₩{stats.totalRevenue.toLocaleString()}</div>
                        <div className="stat-change positive">+5%</div>
                     </div>
                     <div className="stat-card">
                        <h3>신규 가입자</h3>
                        <div className="stat-value">{stats.newUsers.toLocaleString()}</div>
                        <div className="stat-change positive">+15%</div>
                     </div>
                     <div className="stat-card">
                        <h3>평균 결제 금액</h3>
                        <div className="stat-value">₩{stats.averageOrder.toLocaleString()}</div>
                        <div className="stat-change negative">-2%</div>
                     </div>
                  </div>

                  {/* 최근 결제 내역 */}
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
                              {stats.recentOrders.map((order) => (
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

                  {/* 최근 문의 사항 */}
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
                              {inquiries.map((inquiry) => (
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
            </div>
         </div>
      </div>
   )
}

export default AdminDashboard
