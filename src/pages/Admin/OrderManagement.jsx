import { getOrdersStatusThunk } from '@/features/analytics/analyticsSlice'
import { faL } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const OrderManagement = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const [orders, setOrders] = useState([])
   const [searchTerm, setSearchTerm] = useState('')
   const [statusFilter, setStatusFilter] = useState('')
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)
   const { isAuthenticated } = useSelector((state) => state.admin)
   const { loading, ordersStatus } = useSelector((state) => state.analytics)

   // 관리자 권한 체크
   useEffect(() => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
         document.documentElement.setAttribute('data-theme', 'dark')
      }

      if (!isAuthenticated) {
         navigate('/')
         return
      }

      dispatch(getOrdersStatusThunk(currentPage))
   }, [currentPage, dispatch])

   // 주문 목록 로드
   useEffect(() => {
      if (!loading) {
         console.log(ordersStatus)
         setOrders(ordersStatus.data)
         setTotalPages(ordersStatus.totalPages)
      }
      const fetchOrders = async () => {
         try {
            // TODO: API 연동
            // const response = await fetch(
            //   `/api/admin/orders?page=${currentPage}&search=${searchTerm}&status=${statusFilter}`
            // );
            // const data = await response.json();
            // 테스트용 주문 데이터
            // const mockOrders = [
            //    {
            //       id: 1,
            //       customerName: '홍길동',
            //       customerEmail: 'hong@example.com',
            //       customerPhone: '010-1234-5678',
            //       planName: 'SKT 5G 프리미엄',
            //       planCarrier: 'SKT',
            //       originalPrice: 85000,
            //       amount: 63750,
            //       discountRate: 25,
            //       paymentMethod: 'card',
            //       cardCompany: '삼성카드',
            //       cardNumber: '5412-****-****-1234',
            //       status: 'completed',
            //       orderDate: '2025-09-05 14:30:00',
            //       completedDate: '2025-09-05 14:31:23',
            //       usePoint: 0,
            //       earnedPoint: 1275,
            //       contract: '24개월',
            //       features: ['VIP 혜택', '데이터 완전 무제한'],
            //    },
            //    {
            //       id: 2,
            //       customerName: '김철수',
            //       customerEmail: 'kim@example.com',
            //       customerPhone: '010-9876-5432',
            //       planName: 'KT 5G 슈퍼플랜',
            //       planCarrier: 'KT',
            //       originalPrice: 65000,
            //       amount: 52000,
            //       discountRate: 20,
            //       paymentMethod: 'card',
            //       cardCompany: '현대카드',
            //       cardNumber: '4321-****-****-5678',
            //       status: 'pending',
            //       orderDate: '2025-09-05 13:45:00',
            //       usePoint: 1000,
            //       earnedPoint: 1020,
            //       contract: '12개월',
            //       features: ['데이터 로밍', '음악 스트리밍'],
            //    },
            //    {
            //       id: 3,
            //       customerName: '이영희',
            //       customerEmail: 'lee@example.com',
            //       customerPhone: '010-2222-3333',
            //       planName: 'LG U+ 5G 베이직',
            //       planCarrier: 'LGU+',
            //       originalPrice: 45000,
            //       amount: 38250,
            //       discountRate: 15,
            //       paymentMethod: 'bank',
            //       bankName: '신한은행',
            //       accountNumber: '110-***-******',
            //       status: 'completed',
            //       orderDate: '2025-09-04 10:15:00',
            //       completedDate: '2025-09-04 10:17:42',
            //       usePoint: 500,
            //       earnedPoint: 757,
            //       contract: '무약정',
            //       features: ['기본 데이터'],
            //    },
            //    {
            //       id: 4,
            //       customerName: '박지성',
            //       customerEmail: 'park@example.com',
            //       customerPhone: '010-7777-8888',
            //       planName: '청소년 요금제',
            //       planCarrier: 'SKT',
            //       originalPrice: 35000,
            //       amount: 24500,
            //       discountRate: 30,
            //       paymentMethod: 'card',
            //       cardCompany: '국민카드',
            //       cardNumber: '9876-****-****-4321',
            //       status: 'failed',
            //       orderDate: '2025-09-04 09:30:00',
            //       failReason: '한도초과',
            //       features: ['유해 콘텐츠 차단', '위치 알림'],
            //    },
            // ]
            // // 검색어 필터링
            // let filteredOrders = mockOrders
            // if (searchTerm) {
            //    const searchLower = searchTerm.toLowerCase()
            //    filteredOrders = mockOrders.filter((order) => order.customerName.toLowerCase().includes(searchLower) || order.customerEmail.toLowerCase().includes(searchLower) || order.planName.toLowerCase().includes(searchLower))
            // }
            // // 상태 필터링
            // if (statusFilter) {
            //    filteredOrders = filteredOrders.filter((order) => order.status === statusFilter)
            // }
            // // 페이지네이션
            // const itemsPerPage = 5
            // const start = (currentPage - 1) * itemsPerPage
            // const paginatedOrders = filteredOrders.slice(start, start + itemsPerPage)
            // setOrders(paginatedOrders)
            // setTotalPages(Math.ceil(filteredOrders.length / itemsPerPage))
         } catch (error) {
            console.error('주문 목록 로드 실패:', error)
         }
      }

      fetchOrders()
   }, [currentPage, searchTerm, statusFilter, loading])

   const handleSearch = (e) => {
      e.preventDefault()
      setCurrentPage(1)
      // fetchOrders()가 useEffect에 의해 자동으로 호출됨
   }

   const handleRefund = async (orderId) => {
      if (!window.confirm('정말 환불 처리하시겠습니까?')) return

      try {
         // TODO: API 연동
         // await fetch(`/api/admin/orders/${orderId}/refund`, {
         //   method: 'POST'
         // });

         // 임시 상태 업데이트
         setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: 'refunded' } : order)))
      } catch (error) {
         console.error('환불 처리 실패:', error)
         alert('환불 처리에 실패했습니다. 다시 시도해주세요.')
      }
   }

   return (
      <div className="admin-main-content">
         <div className="page-title">
            <h2 className="mb-4">주문 관리</h2>
         </div>

         <div className="container py-5">
            {/* 검색 및 필터 */}
            <div className="admin-color card shadow-sm mb-4">
               <div className="card-body">
                  <form onSubmit={handleSearch}>
                     <div className="row g-2">
                        <div className="col-md-6">
                           <input type="text" className="admin-color-second form-control" placeholder="고객명, 이메일, 요금제명으로 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                           <select className="admin-color-second form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                              <option value="">모든 상태</option>
                              <option value="completed">결제완료</option>
                              <option value="pending">결제대기</option>
                              <option value="failed">결제실패</option>
                              <option value="refunded">환불완료</option>
                           </select>
                        </div>
                        <div className="col-md-2">
                           <button type="submit" className="btn btn-primary w-100">
                              검색
                           </button>
                        </div>
                     </div>
                  </form>
               </div>
            </div>

            {/* 주문 목록 */}
            <div className="admin-color card shadow-sm">
               <div className=" table-responsive">
                  <table className="admin-color-table table table-hover mb-0">
                     <thead>
                        <tr>
                           <th>주문번호</th>
                           <th>고객 정보</th>
                           <th>요금제 정보</th>
                           <th>결제 정보</th>
                           <th>포인트</th>
                           <th>상태</th>
                           <th>관리</th>
                        </tr>
                     </thead>
                     <tbody>
                        {orders?.map((order) => (
                           <tr key={order.id} className="align-middle">
                              <td>
                                 <div className="fw-bold">#{order.id}</div>
                                 <div className="admin-color-text small text-muted">{new Date(order.orderDate).toLocaleDateString()}</div>
                              </td>
                              <td>
                                 <div className="fw-bold">{order.customerName}</div>
                                 <div className="small">{order.customerEmail}</div>
                                 <div className="admin-color-text small text-muted">{order.customerPhone}</div>
                              </td>
                              <td>
                                 <div className="fw-bold">{order.planName}</div>
                                 <div className="small">
                                    <span className={`badge me-1 ${order.planCarrier === 'SKT' ? 'bg-danger' : order.planCarrier === 'KT' ? 'bg-primary' : 'bg-danger'}`}>{order.planCarrier}</span>
                                    <span className="admin-color-text text-muted">{order.contract}</span>
                                 </div>
                                 <div className="mt-1">
                                    {order.features.map((feature, index) => (
                                       <span key={index} className="admin-color badge bg-light text-dark me-1">
                                          {feature}
                                       </span>
                                    ))}
                                 </div>
                              </td>
                              <td>
                                 <div className="fw-bold text-primary">{order.amount.toLocaleString()}원</div>
                                 {order.originalPrice !== order.amount && <div className="admin-color-text small text-muted text-decoration-line-through">{order.originalPrice.toLocaleString()}원</div>}
                                 <div className="small">
                                    {order.paymentMethod === 'card' ? (
                                       <>
                                          {order.cardCompany}
                                          <br />
                                          {order.cardNumber}
                                       </>
                                    ) : (
                                       <>
                                          {order.bankName}
                                          <br />
                                          {order.accountNumber}
                                       </>
                                    )}
                                 </div>
                              </td>
                              <td>
                                 {order.usePoint > 0 && <div className="text-danger">-{order.usePoint.toLocaleString()}P</div>}
                                 {order.earnedPoint > 0 && <div className="text-success">+{order.earnedPoint.toLocaleString()}P</div>}
                              </td>
                              <td>
                                 <div>
                                    <span className={`badge bg-${order.status === 'success' ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'failed' ? 'danger' : 'secondary'}`}>
                                       {order.status === 'success' ? '결제완료' : order.status === 'pending' ? '결제대기' : order.status === 'failed' ? '결제실패' : '환불완료'}
                                    </span>
                                 </div>
                                 {order.completedDate && <div className="admin-color-text small text-muted mt-1">완료: {new Date(order.completedDate).toLocaleTimeString()}</div>}
                                 {order.refundedDate && <div className="admin-color-text small text-muted mt-1">환불: {new Date(order.refundedDate).toLocaleDateString()}</div>}
                                 {order.failReason && <div className="small text-danger mt-1">사유: {order.failReason}</div>}
                              </td>
                              <td>
                                 <div className="btn-group-vertical w-100">
                                    <button className="btn btn-sm btn-outline-primary mb-1" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                                       상세보기
                                    </button>
                                    {order.status === 'completed' && (
                                       <button className="btn btn-sm btn-outline-danger" onClick={() => handleRefund(order.id)}>
                                          환불처리
                                       </button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* 페이지네이션 */}
            <div className="d-flex justify-content-center mt-4">
               <nav>
                  <ul className="admin-color-list pagination">
                     <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="admin-color page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                           이전
                        </button>
                     </li>
                     {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                           <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                              {i + 1}
                           </button>
                        </li>
                     ))}
                     <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="admin-color page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                           다음
                        </button>
                     </li>
                  </ul>
               </nav>
            </div>
         </div>
      </div>
   )
}

export default OrderManagement
