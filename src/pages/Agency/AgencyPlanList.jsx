import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PlanFilters from '@/components/shared/PlanFilters'
import { getPlans } from '@/features/plans/planSlice'

const INITIAL_FILTERS = {
   approval: 'all',
   type: 'all',
   age: 'all',
   dis: 'all',
   minPrice: '',
   maxPrice: '',
}

const AgencyPlanList = () => {
   const dispatch = useDispatch()
   const { plans = [], loading, error } = useSelector((state) => state.plans)
   const [filters, setFilters] = useState(INITIAL_FILTERS)

   useEffect(() => {
      dispatch(getPlans())
   }, [dispatch])

   const handleFilterChange = (newFilters) => setFilters(newFilters)

   console.log('요금제 목록:', plans)

   // 필터링 useMemo로 최적화
   const filteredPlans = useMemo(() => {
      return (plans || []).filter((plan) => {
         // status(승인) 필드: null/undefined 방어 및 정책 반영
         const status = plan.status || plan.approvalStatus || 'pending'
         if (filters.approval !== 'all') {
            if (filters.approval === 'pending' && status !== 'pending') return false
            if (filters.approval === 'approved' && status !== 'approved' && status !== 'active') return false
            if (filters.approval === 'rejected' && status !== 'rejected' && status !== 'inactive') return false
         }
         if (filters.type !== 'all' && plan.type !== filters.type) return false
         if (filters.age !== 'all' && plan.age !== filters.age) return false
         if (filters.dis !== 'all' && plan.dis !== filters.dis) return false
         const price = parseInt(plan.price || plan.finalPrice || plan.basePrice || 0)
         if (filters.minPrice && price < parseInt(filters.minPrice)) return false
         if (filters.maxPrice && price > parseInt(filters.maxPrice)) return false
         return true
      })
   }, [plans, filters])

   if (loading) {
      return (
         <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">로딩중...</span>
            </div>
         </div>
      )
   }

   if (error) {
      return (
         <div className="container py-5">
            <div className="alert alert-danger" role="alert">
               요금제 목록을 불러오는데 실패했습니다: {error}
            </div>
         </div>
      )
   }

   return (
      <div className="container py-5">
         <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>요금제 관리</h2>
            <Link to="/agency/plans/create" className="btn btn-primary">
               <FontAwesomeIcon icon={faPlus} className="me-2" />새 요금제 등록
            </Link>
         </div>

         <div className="row">
            <div className="col-lg-3 mb-4">
               <PlanFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>

            <div className="col-lg-9">
               {filteredPlans.length === 0 ? (
                  <div className="text-center py-5">
                     <p className="text-muted">등록된 요금제가 없습니다.</p>
                     <Link to="/agency/plans/create" className="btn btn-primary">
                        첫 요금제 등록하기
                     </Link>
                  </div>
               ) : (
                  <div className="row g-4">
                     {filteredPlans.map((plan) => (
                        <div key={plan.id} className="col-md-6">
                           <div className="card h-100">
                              <div className="card-body">
                                 <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h5 className="card-title mb-0">{plan.name}</h5>
                                    <div>
                                       {(() => {
                                          // status(승인) 필드: null/undefined 방어 및 정책 반영
                                          const status = plan.status || plan.approvalStatus || 'pending'
                                          let badgeClass = 'bg-warning',
                                             label = '승인 대기중'
                                          if (status === 'approved' || status === 'active') {
                                             badgeClass = 'bg-success'
                                             label = '승인됨'
                                          } else if (status === 'rejected' || status === 'inactive') {
                                             badgeClass = 'bg-danger'
                                             label = '거절됨'
                                          }
                                          return <span className={`badge me-2 ${badgeClass}`}>{label}</span>
                                       })()}
                                    </div>
                                 </div>
                                 <p className="card-text text-muted small mb-2">{plan.description}</p>
                                 <div className="text-primary mb-3">
                                    {(() => {
                                       const price = parseInt(plan.basePrice)
                                       return isNaN(price) ? '-' : price.toLocaleString() + '원'
                                    })()}
                                 </div>

                                 <div className="d-flex gap-2 mb-3">
                                    <div className="p-2 bg-light rounded flex-grow-1">
                                       <small className="d-block text-muted">데이터</small>
                                       <strong>{plan.data === '999999' ? '무제한' : `${plan.data}GB`}</strong>
                                    </div>
                                    <div className="p-2 bg-light rounded flex-grow-1">
                                       <small className="d-block text-muted">통화</small>
                                       <strong>{plan.voice === '999999' ? '무제한' : `${plan.voice}분`}</strong>
                                    </div>
                                    <div className="p-2 bg-light rounded flex-grow-1">
                                       <small className="d-block text-muted">문자</small>
                                       <strong>{plan.sms === '999999' ? '무제한' : `${plan.sms}건`}</strong>
                                    </div>
                                 </div>

                                 <div className="d-flex gap-2 mb-3">
                                    <div className="badge bg-info">
                                       {(() => {
                                          if (plan.type === '2') return '3G'
                                          if (plan.type === '3') return 'LTE'
                                          if (plan.type === '6') return '5G'
                                          return plan.type || '-'
                                       })()}
                                    </div>
                                    <div className="badge bg-info">{plan.age === '18' ? '청소년' : plan.age === '20' ? '성인' : '실버'}</div>
                                    <div className="badge bg-info">{plan.dis === '0' ? '무약정' : `${plan.dis}개월`}</div>
                                 </div>

                                 {/* 혜택 리스트 안전 파싱 및 표시 */}
                                 {(() => {
                                    let benefits = []
                                    try {
                                       benefits = Array.isArray(plan.benefits) ? plan.benefits : plan.benefits ? JSON.parse(plan.benefits) : []
                                    } catch {
                                       benefits = []
                                    }
                                    return benefits.length > 0 ? (
                                       <ul className="mb-2 ps-3 small text-success">
                                          {benefits.map((b, i) => (
                                             <li key={i}>{b}</li>
                                          ))}
                                       </ul>
                                    ) : null
                                 })()}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default AgencyPlanList
