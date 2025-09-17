import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMyUserPlans, selectUserPlans } from '@/features/auth/authSlice'
import '@assets/css/PlanSettings.css'

const PlanSettings = () => {
   const dispatch = useDispatch()
   const userPlans = useSelector(selectUserPlans)
   const loading = useSelector((state) => state.auth.loading)
   const error = useSelector((state) => state.auth.error)

   const [searchKeyword, setSearchKeyword] = useState('')

   useEffect(() => {
      dispatch(getMyUserPlans())
   }, [dispatch])

   const handleSearch = (e) => setSearchKeyword(e.target.value)

   const filteredPlans = userPlans.filter((plan) => (plan.plan?.name || '').toLowerCase().includes(searchKeyword.toLowerCase()))

   const getStatusClass = (status) => {
      switch (status) {
         case 'active':
            return 'badge bg-primary'
         case 'canceled':
            return 'badge bg-danger'
         case 'expired':
            return 'badge bg-disabled text-secondary'
         case 'pending':
            return 'badge bg-warning text-black'
         default:
            return 'badge bg-light text-black'
      }
   }

   const getStatusText = (status) => {
      switch (status) {
         case 'active':
            return '진행중'
         case 'canceled':
            return '취소'
         case 'expired':
            return '만료'
         case 'pending':
            return '대기'
         default:
            return status
      }
   }

   return (
      <div className="container content_box py-5">
         <div className="row justify-content-center">
            <div className="col-12 col-md-10">
               <h4 className="mb-4">내 요금제</h4>

               <div className="mb-3">
                  <input type="text" className="form-control plan-search" placeholder="요금제 검색" value={searchKeyword} onChange={handleSearch} />
               </div>

               {loading && <div className="text-center my-3">불러오는 중...</div>}
               {error && <div className="alert alert-danger">{typeof error === 'string' ? error : error.message}</div>}

               <div className="table-responsive plan-table">
                  <table className="table table-striped">
                     <thead>
                        <tr>
                           <th>요금제 기간</th>
                           <th>요금제 이름</th>
                           <th>요금제 가격</th>
                           <th>요금제 상태</th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredPlans.length > 0 ? (
                           filteredPlans.map((plan) => (
                              <tr key={plan.id}>
                                 <td>{plan.plan?.dis ? `${plan.plan.dis}개월` : '-'}</td>
                                 <td>{plan.plan?.name || '-'}</td>
                                 <td>{plan.total_fee?.toLocaleString() || '-'}</td>
                                 <td>
                                    <span className={getStatusClass(plan.status)}>{getStatusText(plan.status)}</span>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="4" className="text-center">
                                 검색 결과가 없습니다.
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   )
}

export default PlanSettings
