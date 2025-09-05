import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PlanCard from '@components/plans/PlanCard'
import PlanFilters from '@components/plans/PlanFilters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const PlanListPage = () => {
   const [searchParams, setSearchParams] = useSearchParams()
   const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
   const [filteredPlans, setFilteredPlans] = useState([])

   // 임시 데이터
   const mockPlans = [
      {
         id: 1,
         name: '5G 라이트',
         carrier: 'SKT',
         data: '5GB',
         voice: '무제한',
         sms: '무제한',
         price: 29900,
      },
      {
         id: 2,
         name: '5G 스탠다드',
         carrier: 'KT',
         data: '10GB',
         voice: '무제한',
         sms: '무제한',
         price: 39900,
      },
      {
         id: 3,
         name: '5G 프리미엄',
         carrier: 'LG U+',
         data: '15GB',
         voice: '무제한',
         sms: '무제한',
         price: 49900,
      },
      {
         id: 4,
         name: '5G 플래티넘',
         carrier: 'SKT',
         data: '무제한',
         voice: '무제한',
         sms: '무제한',
         price: 59900,
      },
      {
         id: 5,
         name: '5G 라이트 플러스',
         carrier: 'KT',
         data: '8GB',
         voice: '무제한',
         sms: '무제한',
         price: 34900,
      },
      {
         id: 6,
         name: '5G 스페셜',
         carrier: 'LG U+',
         data: '20GB',
         voice: '무제한',
         sms: '무제한',
         price: 54900,
      },
   ]

   const handleSearch = (e) => {
      e.preventDefault()
      setSearchParams({ search: searchTerm })
   }

   const handleFilterChange = (filters) => {
      let filtered = [...mockPlans]

      // 통신사 필터
      if (filters.carrier !== 'all') {
         filtered = filtered.filter((plan) => plan.carrier === filters.carrier)
      }

      // 가격대 필터
      if (filters.priceRange !== 'all') {
         const [min, max] = filters.priceRange.split('-').map(Number)
         filtered = filtered.filter((plan) => {
            if (max) {
               return plan.price >= min && plan.price <= max
            }
            return plan.price >= min
         })
      }

      // 검색어 필터
      if (searchTerm) {
         filtered = filtered.filter((plan) => plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || plan.carrier.toLowerCase().includes(searchTerm.toLowerCase()))
      }

      setFilteredPlans(filtered)
   }

   useEffect(() => {
      setFilteredPlans(mockPlans)
   }, [])

   return (
      <div className="container py-5">
         <h2 className="text-center mb-4">요금제</h2>

         {/* 검색창 */}
         <div className="row justify-content-center mb-4">
            <div className="col-md-6">
               <form onSubmit={handleSearch}>
                  <div className="input-group">
                     <input type="search" className="form-control" placeholder="요금제 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                     <button className="btn btn-primary" type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                     </button>
                  </div>
               </form>
            </div>
         </div>

         {/* 필터 */}
         <PlanFilters onFilterChange={handleFilterChange} />

         {/* 요금제 목록 */}
         <div className="row">
            {filteredPlans.map((plan) => (
               <div key={plan.id} className="col-md-4 mb-4">
                  <PlanCard plan={plan} />
               </div>
            ))}
         </div>

         {filteredPlans.length === 0 && (
            <div className="text-center py-5">
               <p className="text-muted">검색 결과가 없습니다.</p>
            </div>
         )}
      </div>
   )
}

export default PlanListPage
