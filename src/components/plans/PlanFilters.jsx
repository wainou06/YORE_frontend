import { useState } from 'react'

const PlanFilters = ({ onFilterChange }) => {
   const [filters, setFilters] = useState({
      carrier: 'all',
      priceRange: 'all',
      dataAmount: 'all',
   })

   const handleFilterChange = (key, value) => {
      const newFilters = {
         ...filters,
         [key]: value,
      }
      setFilters(newFilters)
      onFilterChange(newFilters)
   }

   return (
      <div className="bg-light p-4 rounded mb-4">
         <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
               <label className="form-label">통신사</label>
               <select className="form-select" value={filters.carrier} onChange={(e) => handleFilterChange('carrier', e.target.value)}>
                  <option value="all">전체</option>
                  <option value="SKT">SKT</option>
                  <option value="KT">KT</option>
                  <option value="LG U+">LG U+</option>
               </select>
            </div>

            <div className="col-md-4 mb-3 mb-md-0">
               <label className="form-label">가격대</label>
               <select className="form-select" value={filters.priceRange} onChange={(e) => handleFilterChange('priceRange', e.target.value)}>
                  <option value="all">전체</option>
                  <option value="0-30000">3만원 이하</option>
                  <option value="30000-50000">3만원-5만원</option>
                  <option value="50000-70000">5만원-7만원</option>
                  <option value="70000">7만원 이상</option>
               </select>
            </div>

            <div className="col-md-4">
               <label className="form-label">데이터</label>
               <select className="form-select" value={filters.dataAmount} onChange={(e) => handleFilterChange('dataAmount', e.target.value)}>
                  <option value="all">전체</option>
                  <option value="0-5">5GB 이하</option>
                  <option value="5-10">5GB-10GB</option>
                  <option value="10-20">10GB-20GB</option>
                  <option value="unlimited">무제한</option>
               </select>
            </div>
         </div>
      </div>
   )
}

export default PlanFilters
