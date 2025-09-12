import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PlanFilters from '@/components/shared/PlanFilters'

const INITIAL_FILTERS = {
   approval: 'all',
   type: 'all',
   age: 'all',
   dis: 'all',
   minPrice: '',
   maxPrice: '',
}

const AgencyPlanList = () => {
   // 임시 데이터 (slice, redux 사용 안함)
   const tempPlans = [
      {
         id: 1,
         name: 'YORE 5G 100GB',
         description: '5G 데이터 100GB, 음성 무제한, 문자 300건',
         price: '39000',
         data: '100000',
         voice: '999999',
         sms: '300',
         type: '6',
         age: '20',
         dis: '24',
         status: 'approved',
         benefits: '["넷플릭스 3개월 무료", "유튜브 프리미엄 1개월"]',
      },
      {
         id: 2,
         name: 'YORE LTE 청소년',
         description: 'LTE 데이터 10GB, 음성 200분, 문자 100건',
         price: '22000',
         data: '10000',
         voice: '200',
         sms: '100',
         type: '3',
         age: '18',
         dis: '0',
         status: 'pending',
         benefits: '["카카오페이 5천원 쿠폰"]',
      },
   ]

   const [filters, setFilters] = useState(INITIAL_FILTERS)

   const handleFilterChange = (newFilters) => {
      setFilters(newFilters)
   }

   // slice 없이 임시 데이터 필터링
   const filteredPlans = tempPlans.filter((plan) => {
      if (filters.approval !== 'all') {
         if (filters.approval === 'pending' && plan.status !== 'pending') return false
         if (filters.approval === 'approved' && plan.status !== 'approved') return false
         if (filters.approval === 'rejected' && plan.status !== 'rejected') return false
      }
      if (filters.type !== 'all' && plan.type !== filters.type) return false
      if (filters.age !== 'all' && plan.age !== filters.age) return false
      if (filters.dis !== 'all' && plan.dis !== filters.dis) return false
      const price = parseInt(plan.price)
      if (filters.minPrice && price < parseInt(filters.minPrice)) return false
      if (filters.maxPrice && price > parseInt(filters.maxPrice)) return false
      return true
   })

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
                                       <span className={`badge me-2 ${plan.status === 'approved' ? 'bg-success' : plan.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>{plan.status === 'approved' ? '승인됨' : plan.status === 'rejected' ? '거절됨' : '승인 대기중'}</span>
                                    </div>
                                 </div>
                                 <p className="card-text text-muted small mb-2">{plan.description}</p>
                                 <div className="text-primary mb-3">{parseInt(plan.price).toLocaleString()}원</div>

                                 <div className="d-flex gap-2 mb-3">
                                    <div className="p-2 bg-light rounded flex-grow-1">
                                       <small className="d-block text-muted">데이터</small>
                                       <strong>{plan.data === '999999' ? '무제한' : `${plan.data}MB`}</strong>
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
                                    <div className="badge bg-info">{plan.type === '2' ? '3G' : plan.type === '3' ? 'LTE' : '5G'}</div>
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
