import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'

const PlanManagement = () => {
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.auth)
   const [plans, setPlans] = useState([])
   const [carriers, setCarriers] = useState([])
   const [selectedCarrier, setSelectedCarrier] = useState('')
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)

   // 관리자 권한 체크
   useEffect(() => {
      // if (!user || user.role !== 'admin') {
      //    navigate('/')
      // }
   }, [user, navigate])

   // 통신사 목록 로드
   useEffect(() => {
      const fetchCarriers = async () => {
         try {
            const carriersList = [
               { id: 'SKT', name: 'SKT', color: '#ED1C24' },
               { id: 'KT', name: 'KT', color: '#1F3870' },
               { id: 'LGU+', name: 'LG U+', color: '#D13B27' },
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
      const fetchPlans = async () => {
         try {
            const mockPlans = [
               {
                  id: 1,
                  name: '5G 프리미엄',
                  carrier: 'SKT',
                  data: '무제한',
                  voice: '무제한',
                  sms: '무제한',
                  price: 85000,
                  discountRate: 25,
                  status: 'active',
                  features: ['VIP 혜택', '데이터 완전 무제한', '5G 전용'],
                  createdAt: '2025-09-01',
               },
               {
                  id: 2,
                  name: '5G 슈퍼플랜',
                  carrier: 'KT',
                  data: '200GB',
                  voice: '무제한',
                  sms: '무제한',
                  price: 65000,
                  discountRate: 20,
                  status: 'active',
                  features: ['데이터 로밍', '음악 스트리밍'],
                  createdAt: '2025-09-02',
               },
               {
                  id: 3,
                  name: '5G 베이직',
                  carrier: 'LGU+',
                  data: '100GB',
                  voice: '300분',
                  sms: '300건',
                  price: 45000,
                  discountRate: 15,
                  status: 'inactive',
                  features: ['기본 데이터'],
                  createdAt: '2025-09-03',
               },
               {
                  id: 4,
                  name: '청소년 요금제',
                  carrier: 'SKT',
                  data: '50GB',
                  voice: '200분',
                  sms: '무제한',
                  price: 35000,
                  discountRate: 30,
                  status: 'active',
                  features: ['유해 콘텐츠 차단', '위치 알림'],
                  createdAt: '2025-09-04',
               },
               {
                  id: 5,
                  name: '실버 요금제',
                  carrier: 'KT',
                  data: '30GB',
                  voice: '무제한',
                  sms: '무제한',
                  price: 30000,
                  discountRate: 35,
                  status: 'active',
                  features: ['큰 글씨', '긴급 SOS'],
                  createdAt: '2025-09-05',
               },
            ]

            // 통신사 필터링
            const filteredPlans = selectedCarrier ? mockPlans.filter((plan) => plan.carrier === selectedCarrier) : mockPlans

            // 페이지네이션
            const itemsPerPage = 5
            const start = (currentPage - 1) * itemsPerPage
            const paginatedPlans = filteredPlans.slice(start, start + itemsPerPage)

            setPlans(paginatedPlans)
            setTotalPages(Math.ceil(filteredPlans.length / itemsPerPage))
         } catch (error) {
            console.error('요금제 목록 로드 실패:', error)
         }
      }

      fetchPlans()
   }, [currentPage, selectedCarrier])

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
                        <select className="admin-color-second form-select" value={selectedCarrier} onChange={(e) => setSelectedCarrier(e.target.value)}>
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
                        {plans.map((plan) => {
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
                                       {plan.features.map((feature, index) => (
                                          <span key={index} className="admin-color badge bg-light text-dark me-1 mb-1">
                                             {feature}
                                          </span>
                                       ))}
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

export default PlanManagement
