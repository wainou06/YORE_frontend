import { getPlansStatusThunk } from '@/features/analytics/analyticsSlice'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const PlanManagement = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { isAuthenticated } = useSelector((state) => state.admin)
   const { loading, plansStatus } = useSelector((state) => state.analytics)
   const [plans, setPlans] = useState([])
   const [carriers, setCarriers] = useState([])
   const [selectedCarrier, setSelectedCarrier] = useState('')
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)

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
      dispatch(getPlansStatusThunk(currentPage))
   }, [currentPage, dispatch])

   // 통신사 목록 로드
   useEffect(() => {
      const fetchCarriers = async () => {
         try {
            const carriersList = [
               { id: '3G', name: '3G', color: '#ED1C24' },
               { id: 'LTE', name: 'LTE', color: '#1F3870' },
               { id: '5G', name: '5G', color: '#D13B27' },
            ]
            setCarriers(carriersList)
         } catch (error) {
            console.error('통신사 목록 로드 실패:', error)
         }
      }

      fetchCarriers()
   }, [])

   // 요금제 목록 로드
   useEffect(() => {
      if (!loading) {
         console.log(plansStatus)
         setPlans(plansStatus.data)
         setTotalPages(plansStatus.totalPages)
      }
   }, [currentPage, plansStatus])

   const handleStatusChange = async (planId, newStatus) => {
      try {
         // TODO: API 연동
         // await fetch(`/api/admin/plans/${planId}/status`, {
         //   method: 'PUT',
         //   body: JSON.stringify({ status: newStatus })
         // });

         // 임시 상태 업데이트
         setPlans(plans.map((plan) => (plan.id === planId ? { ...plan, status: newStatus } : plan)))
      } catch (error) {
         console.error('요금제 상태 변경 실패:', error)
      }
   }

   return (
      <div className="admin-main-content">
         <div className="page-title">
            <div className="d-flex justify-content-between align-items-center mb-4">
               <h2>요금제 관리</h2>
               <button className="btn btn-primary" onClick={() => navigate('/admin/plans/new')}>
                  새 요금제 등록
               </button>
            </div>
         </div>
         <div className="container py-5">
            {/* 필터 */}
            <div className="admin-color card shadow-sm mb-4">
               <div className="card-body">
                  <div className="row g-2">
                     <div className="col-md-3">
                        <select className="admin-color-second admin-color-select form-select" value={selectedCarrier} onChange={(e) => setSelectedCarrier(e.target.value)}>
                           <option value="">모든 통신사</option>
                           {carriers.map((carrier) => (
                              <option key={carrier.id} value={carrier.id}>
                                 {carrier.name}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            {/* 요금제 목록 */}
            <div className="admin-color card shadow-sm">
               <div className="table-responsive">
                  <table className="admin-color-table table table-hover mb-0">
                     <thead>
                        <tr>
                           <th>ID</th>
                           <th>요금제명</th>
                           <th>통신사</th>
                           <th>데이터</th>
                           <th>음성</th>
                           <th>문자</th>
                           <th>가격</th>
                           <th>할인</th>
                           <th>특징</th>
                           <th>등록일</th>
                           <th>상태</th>
                           <th>관리</th>
                        </tr>
                     </thead>
                     <tbody>
                        {plans?.map((plan) => {
                           const carrier = carriers.find((c) => c.id === plan.carrier)
                           return (
                              <tr key={plan.id}>
                                 <td>{plan.id}</td>
                                 <td>
                                    <strong>{plan.name}</strong>
                                 </td>
                                 <td>
                                    <span
                                       className="badge"
                                       style={{
                                          backgroundColor: carrier?.color || '#6c757d',
                                          color: 'white',
                                       }}
                                    >
                                       {plan.carrier}
                                    </span>
                                 </td>
                                 <td>{plan.data}</td>
                                 <td>{plan.voice}</td>
                                 <td>{plan.sms}</td>
                                 <td>
                                    <div>
                                       <strong>{plan.price.toLocaleString()}원</strong>
                                       {plan.discountRate > 0 && <div className="small text-success">{plan.discountRate}% 할인 가능</div>}
                                    </div>
                                 </td>
                                 <td>
                                    <div className="text-center">
                                       <span className="badge bg-primary">{plan.discountRate}%</span>
                                    </div>
                                 </td>
                                 <td>
                                    <div style={{ maxWidth: '200px' }}>
                                       {/* {plan.features.map((feature, index) => (
                                          <span key={index} className="admin-color badge bg-light text-dark me-1 mb-1">
                                             {feature}
                                          </span>
                                       ))} */}
                                    </div>
                                 </td>
                                 <td>{plan.createdAt}</td>
                                 <td>
                                    <span className={`badge bg-${plan.status === 'active' ? 'success' : 'danger'}`}>{plan.status === 'active' ? '판매중' : '판매중지'}</span>
                                 </td>
                                 <td>
                                    <div className="btn-group">
                                       <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/admin/plans/${plan.id}/edit`)}>
                                          수정
                                       </button>
                                       <button className={`btn btn-sm btn-outline-${plan.status === 'active' ? 'danger' : 'success'}`} onClick={() => handleStatusChange(plan.id, plan.status === 'active' ? 'inactive' : 'active')}>
                                          {plan.status === 'active' ? '판매중지' : '판매재개'}
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           )
                        })}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* 페이지네이션 */}
            <div className="d-flex justify-content-center mt-4">
               <nav>
                  <ul className="admin-color-list pagination">
                     <li style={{ cursor: 'pointer' }} className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
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
                     <li style={{ cursor: 'pointer' }} className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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

export default PlanManagement
