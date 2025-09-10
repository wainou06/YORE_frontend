import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { fetchAgencyPlans, deletePlan, approvePlan, selectAgencyPlans, selectPlanLoading, selectPlanError } from '@/features/plans/planSlice'
import PlanFilters from '@/components/shared/PlanFilters'
import { toast } from 'react-toastify'

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
   const plans = useSelector(selectAgencyPlans)
   const loading = useSelector(selectPlanLoading)
   const error = useSelector(selectPlanError)
   const [filters, setFilters] = useState(INITIAL_FILTERS)

   useEffect(() => {
      dispatch(fetchAgencyPlans())
   }, [dispatch])

   const handleFilterChange = (newFilters) => {
      setFilters(newFilters)
   }

   const handleStatusToggle = async (planId, currentStatus) => {
      try {
         await dispatch(
            approvePlan({
               id: planId,
               status: currentStatus === 'approved' ? 'rejected' : 'approved',
               rejectionReason: currentStatus === 'approved' ? '승인 취소' : '',
            })
         ).unwrap()
         toast.success(`요금제가 ${currentStatus === 'approved' ? '거절' : '승인'}되었습니다.`)
      } catch (error) {
         toast.error('요금제 상태 변경에 실패했습니다.')
      }
   }

   const handleDelete = async (planId) => {
      if (window.confirm('정말 이 요금제를 삭제하시겠습니까?')) {
         try {
            await dispatch(deletePlan(planId)).unwrap()
            toast.success('요금제가 삭제되었습니다.')
         } catch (error) {
            toast.error('요금제 삭제에 실패했습니다.')
         }
      }
   }

   const filteredPlans = plans.filter((plan) => {
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
                                       <span className={`badge me-2 ${plan.status === 'approved' ? 'bg-success' : plan.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>{plan.status === 'approved' ? '승인됨' : plan.status === 'rejected' ? '거절됨' : '승인 대기중'}</span>
                                       {(plan.status === 'pending' || plan.status === 'rejected') && (
                                          <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusToggle(plan.id, plan.status)}>
                                             <FontAwesomeIcon icon={faCheck} className="me-1" />
                                             승인 요청
                                          </button>
                                       )}
                                       {plan.status === 'approved' && (
                                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusToggle(plan.id, plan.status)}>
                                             <FontAwesomeIcon icon={faTimes} className="me-1" />
                                             승인 취소
                                          </button>
                                       )}
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
                              </div>
                              <div className="card-footer bg-white border-top-0">
                                 <div className="d-flex justify-content-end gap-2">
                                    <Link to={`/agency/plans/${plan.id}/edit`} className="btn btn-outline-primary btn-sm">
                                       <FontAwesomeIcon icon={faEdit} className="me-1" />
                                       수정
                                    </Link>
                                    <button onClick={() => handleDelete(plan.id)} className="btn btn-outline-danger btn-sm">
                                       <FontAwesomeIcon icon={faTrash} className="me-1" />
                                       삭제
                                    </button>
                                 </div>
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
