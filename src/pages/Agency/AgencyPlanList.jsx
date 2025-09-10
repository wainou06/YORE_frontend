import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { planService } from '@/services/planService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

const AgencyPlanList = () => {
   const [plans, setPlans] = useState([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetchPlans()
   }, [])

   const fetchPlans = async () => {
      try {
         const response = await planService.getAgencyPlans()
         setPlans(response.data)
         setLoading(false)
      } catch (error) {
         console.error('요금제 목록 로딩 실패:', error)
         setLoading(false)
      }
   }

   const handleDelete = async (planId) => {
      if (!window.confirm('정말로 이 요금제를 삭제하시겠습니까?')) {
         return
      }

      try {
         await planService.deletePlan(planId)
         setPlans(plans.filter((plan) => plan.id !== planId))
         alert('요금제가 삭제되었습니다.')
      } catch (error) {
         console.error('요금제 삭제 실패:', error)
         alert('요금제 삭제에 실패했습니다.')
      }
   }

   if (loading) {
      return <div className="text-center mt-5">로딩중...</div>
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
            {plans.length === 0 ? (
               <div className="col text-center py-5">
                  <p className="text-muted">등록된 요금제가 없습니다.</p>
                  <Link to="/agency/plans/create" className="btn btn-primary">
                     첫 요금제 등록하기
                  </Link>
               </div>
            ) : (
               plans.map((plan) => (
                  <div key={plan.id} className="col-md-6 mb-4">
                     <div className="card h-100">
                        <div className="card-body">
                           <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 className="card-title mb-0">{plan.name}</h5>
                              <span className={`badge ${plan.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>{plan.status === 'approved' ? '승인됨' : '승인 대기중'}</span>
                           </div>
                           <p className="card-text text-muted small mb-2">{plan.description}</p>
                           <div className="text-primary mb-3">{parseInt(plan.price).toLocaleString()}원</div>

                           <div className="d-flex gap-2">
                              <div className="p-2 bg-light rounded flex-grow-1">
                                 <small className="d-block text-muted">데이터</small>
                                 <strong>{plan.data}</strong>
                              </div>
                              <div className="p-2 bg-light rounded flex-grow-1">
                                 <small className="d-block text-muted">통화</small>
                                 <strong>{plan.voice}</strong>
                              </div>
                              <div className="p-2 bg-light rounded flex-grow-1">
                                 <small className="d-block text-muted">문자</small>
                                 <strong>{plan.sms}</strong>
                              </div>
                           </div>
                        </div>
                        <div className="card-footer bg-white border-top-0">
                           <div className="d-flex justify-content-end gap-2">
                              <Link to={`/plans/${plan.id}/edit`} className="btn btn-outline-primary btn-sm">
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
               ))
            )}
         </div>
      </div>
   )
}

export default AgencyPlanList
