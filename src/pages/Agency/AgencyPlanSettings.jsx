import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProfile, selectUser, selectIsAuthenticated } from '@features/auth/authSlice'
import '@assets/css/PlanSettings.css'

const API_BASE = `${import.meta.env.VITE_APP_API_URL}/auth`

const AgencyPlanSettings = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const user = useSelector(selectUser)
   const isAuthenticated = useSelector(selectIsAuthenticated)

   const [plans, setPlans] = useState([])
   const [searchKeyword, setSearchKeyword] = useState('')

   useEffect(() => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')

      if (isAuthenticated && user) {
         fetchPlans(token)
      } else if (token) {
         dispatch(getProfile())
            .unwrap()
            .then(() => fetchPlans(token))
            .catch(() => navigate('/'))
      } else {
         navigate('/')
      }
   }, [dispatch, isAuthenticated, user, navigate])

   const fetchPlans = async (token) => {
      try {
         const res = await fetch(`${API_BASE}/plans`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         })

         if (!res.ok) throw new Error('요금제 불러오기 실패')

         const data = await res.json()
         if (data.success) {
            setPlans(data.plans)
         } else {
            console.error('요금제 데이터 없음')
         }
      } catch (err) {
         console.error(err)
      }
   }

   const handleSearch = (e) => {
      setSearchKeyword(e.target.value)
   }

   const filteredPlans = plans.filter((plan) => plan.name.toLowerCase().includes(searchKeyword.toLowerCase()))

   const handleChangePlan = (planId) => {
      alert(`요금제 변경: ${planId}`)
      // 실제 변경 로직은 서버 호출 필요
   }

   return (
      <div className="container content_box py-4">
         <h4 className="mb-4">요금제 변경</h4>

         {/* 검색창 */}
         <div className="mb-3">
            <input type="text" className="form-control" placeholder="요금제 검색" value={searchKeyword} onChange={handleSearch} />
         </div>

         {/* 요금제 표 */}
         <table className="table table-striped">
            <thead>
               <tr>
                  <th>요금제 기간</th>
                  <th>요금제 이름</th>
                  <th>요금제 가격</th>
                  <th>변경</th>
               </tr>
            </thead>
            <tbody>
               {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                     <tr key={plan.id}>
                        <td>{plan.period}</td>
                        <td>{plan.name}</td>
                        <td>{plan.price}</td>
                        <td>
                           <button className="btn btn-primary btn-sm" onClick={() => handleChangePlan(plan.id)}>
                              변경
                           </button>
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

export default AgencyPlanSettings
