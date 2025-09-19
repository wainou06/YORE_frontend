import { getOrdersStatusThunk } from '@/features/analytics/analyticsSlice'
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
   const [filterName, setFilterName] = useState('')
   const [filterStatus, setFilterStatus] = useState('')

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

      dispatch(getOrdersStatusThunk({ currentPage, filterName, filterStatus }))
   }, [currentPage, dispatch, filterName, filterStatus])

   // 주문 목록 로드
   useEffect(() => {
      if (!loading) {
         setOrders(ordersStatus.data)
         setTotalPages(ordersStatus.totalPages)
      }
   }, [loading])

   const handleSearch = (e) => {
      e.preventDefault()
      setCurrentPage(1)
      setFilterName(searchTerm)
      setFilterStatus(statusFilter)
   }

   const onKeydownKey = (e) => {
      if (e.key === 'Enter') {
         handleSearch()
         return
      }
   }

   return (
      <div className="admin-main-content">
         <div className="container py-5">
            <div className="page-title">
               <h2 className="mb-4">주문 관리</h2>
            </div>
            {/* 검색 및 필터 */}
            <div className="admin-color card shadow-sm mb-4">
               <div className="card-body">
                  <form onSubmit={handleSearch}>
                     <div className="row g-2">
                        <div className="col-md-6">
                           <input onKeyDown={(e) => onKeydownKey(e.target.value)} type="text" className="admin-color-second form-control" placeholder="고객명, 이메일, 요금제명으로 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                           <select className="admin-color-second form-select admin-color-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                              <option value="">모든 상태</option>
                              <option value="success">결제완료</option>
                              <option value="pending">결제대기</option>
                              <option value="failed">결제실패</option>
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
