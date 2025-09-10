import React from 'react'
import { Form } from 'react-bootstrap'

const PlanFilters = ({ filters, onFilterChange }) => {
   const handleChange = (e) => {
      const { name, value } = e.target
      onFilterChange({ ...filters, [name]: value })
   }

   return (
      <div className="card">
         <div className="card-body">
            <h5 className="card-title mb-3">필터</h5>

            <Form.Group className="mb-3">
               <Form.Label>승인 상태</Form.Label>
               <Form.Select name="approval" value={filters.approval} onChange={handleChange}>
                  <option value="all">전체</option>
                  <option value="approved">승인됨</option>
                  <option value="pending">승인 대기중</option>
                  <option value="rejected">거절됨</option>
               </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
               <Form.Label>활성 상태</Form.Label>
               <Form.Select name="status" value={filters.status} onChange={handleChange}>
                  <option value="all">전체</option>
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
               </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
               <Form.Label>통신망</Form.Label>
               <Form.Select name="type" value={filters.type} onChange={handleChange}>
                  <option value="all">전체</option>
                  <option value="2">3G</option>
                  <option value="3">LTE</option>
                  <option value="4">5G</option>
               </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
               <Form.Label>연령대</Form.Label>
               <Form.Select name="age" value={filters.age} onChange={handleChange}>
                  <option value="all">전체</option>
                  <option value="18">청소년</option>
                  <option value="20">성인</option>
                  <option value="65">실버</option>
               </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
               <Form.Label>약정기간</Form.Label>
               <Form.Select name="dis" value={filters.dis} onChange={handleChange}>
                  <option value="all">전체</option>
                  <option value="0">무약정</option>
                  <option value="12">12개월</option>
                  <option value="24">24개월</option>
                  <option value="36">36개월</option>
               </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
               <Form.Label>가격 범위</Form.Label>
               <div className="d-flex gap-2">
                  <Form.Control type="number" name="minPrice" placeholder="최소" value={filters.minPrice} onChange={handleChange} />
                  <Form.Control type="number" name="maxPrice" placeholder="최대" value={filters.maxPrice} onChange={handleChange} />
               </div>
            </Form.Group>
         </div>
      </div>
   )
}

export default PlanFilters
