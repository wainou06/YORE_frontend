import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PlanCard from '@components/plans/PlanCard'
import PlanFilters from '@components/plans/PlanFilters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { plansAPI } from '@/api/plansApi'

const PlanListPage = () => {
   const [searchParams, setSearchParams] = useSearchParams()
   const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
   const [plans, setPlans] = useState([])
   const [filteredPlans, setFilteredPlans] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   console.log('요금제 목록: ', plans)

   const handleSearch = (e) => {
      e.preventDefault()
      setSearchParams({ search: searchTerm })
      applyFilters(searchTerm)
      setSearchTerm('') // 검색 후 입력창 비우기
   }

   const handleFilterChange = (filters) => {
      applyFilters(searchTerm, filters)
   }

   const applyFilters = (search = searchTerm, filters = {}) => {
      let filtered = [...plans]

      // 통신사 필터 (agencyName 기준)
      if (filters.carrier && filters.carrier !== 'all') {
         filtered = filtered.filter((plan) => {
            const agencyName = plan.agency?.agencyName || plan.agencyName || plan.carrier || ''
            return agencyName === filters.carrier
         })
      }

      // 가격대 필터
      if (filters.priceRange && filters.priceRange !== 'all') {
         const [min, max] = filters.priceRange.split('-').map(Number)
         filtered = filtered.filter((plan) => {
            if (max) {
               return plan.basePrice >= min && plan.basePrice <= max
            }
            return plan.basePrice >= min
         })
      }

      // 데이터(GB) 필터
      if (filters.dataAmount && filters.dataAmount !== 'all') {
         filtered = filtered.filter((plan) => {
            let dataValue = plan.data || plan.dataAmount || ''
            if (typeof dataValue === 'string') {
               dataValue = dataValue.replace(/[^\d]/g, '')
            }
            const dataNum = Number(dataValue)
            if (filters.dataAmount === 'unlimited') {
               return plan.data === '무제한' || plan.data === '999999'
            }
            const [min, max] = filters.dataAmount.split('-').map(Number)
            if (max) {
               return dataNum >= min && dataNum <= max
            }
            return dataNum >= min
         })
      }

      // 검색어 필터 (agencyName도 포함)
      if (search) {
         filtered = filtered.filter((plan) => {
            const agencyName = plan.agency?.agencyName || plan.agencyName || plan.carrier || ''
            return plan.name.toLowerCase().includes(search.toLowerCase()) || agencyName.toLowerCase().includes(search.toLowerCase())
         })
      }

      setFilteredPlans(filtered)
   }

   useEffect(() => {
      const fetchPlans = async () => {
         setLoading(true)
         try {
            const res = await plansAPI.getPlans()
            setPlans(res.data)
            setFilteredPlans(res.data)
            setError(null)
         } catch (err) {
            setError('요금제 목록을 불러오지 못했습니다.')
         } finally {
            setLoading(false)
         }
      }
      fetchPlans()
   }, [])

   useEffect(() => {
      applyFilters(searchTerm)
   }, [plans])

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
         <div className="container py-5 text-center">
            <p className="text-danger">{error}</p>
         </div>
      )
   }

   // 통신사 옵션 추출 (중복 제거)
   const carrierOptions = Array.from(new Set(plans.map((plan) => plan.agency?.agencyName || plan.agencyName || plan.carrier).filter(Boolean)))

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
         <PlanFilters onFilterChange={handleFilterChange} carrierOptions={carrierOptions} />
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
