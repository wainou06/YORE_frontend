import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMyUserPlans } from '@/features/userPlans/userPlanSlice'
import '@assets/css/PlanSettings.css'

const PlanSettings = () => {
   const dispatch = useDispatch()
   const { userPlans, loading, error } = useSelector((state) => state.userPlans)
   const [searchKeyword, setSearchKeyword] = useState('')

   useEffect(() => {
      dispatch(getMyUserPlans())
   }, [dispatch])

   const handleSearch = (e) => {
      setSearchKeyword(e.target.value)
   }

   // 검색 필터
   const filteredPlans = userPlans.filter((plan) => {
      const planName = plan.plan?.name || ''
      return planName.toLowerCase().includes(searchKeyword.toLowerCase())
   })

   // 상태별 뱃지/색상 클래스 반환
   const getStatusClass = (status) => {
      switch (status) {
         case 'active':
            return 'badge bg-primary' // 블루(글씨 흰색)
         case 'canceled':
            return 'badge bg-danger' // 레드(글씨 흰색)
         case 'expired':
            return 'badge bg-disabled text-secondary' // 회색(글씨 회색)
         case 'pending':
            return 'badge bg-warning text-black' // 노랑(글씨 검정)
         default:
            return 'badge bg-light text-black'
      }
   }

   return (
      <div className="container content_box py-4">
         <h4 className="mb-4">내 요금제</h4>

         {/* 검색창 */}
         <div className="mb-3">
            <input type="text" className="form-control" placeholder="요금제 검색" value={searchKeyword} onChange={handleSearch} />
         </div>

         {/* 에러/로딩 */}
         {loading && <div className="text-center my-3">불러오는 중...</div>}
         {error && <div className="alert alert-danger">{typeof error === 'string' ? error : error.message}</div>}

         {/* 요금제 표 */}
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
                           <span className={getStatusClass(plan.status)}>
                              {plan.status === 'active' && '진행중'}
                              {plan.status === 'expired' && '만료'}
                              {plan.status === 'canceled' && '취소'}
                              {plan.status === 'pending' && '대기'}
                              {!['active', 'expired', 'canceled', 'pending'].includes(plan.status) && plan.status}
                           </span>
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
   )
}

export default PlanSettings
