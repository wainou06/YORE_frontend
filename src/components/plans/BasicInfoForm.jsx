import React from 'react'

const BasicInfoForm = ({ planData, errors, networkTypes, ageOptions, disOptions, onInputChange, onPriceChange }) => {
   return (
      <div className="mb-4">
         <h5 className="card-title mb-3">기본 정보</h5>
         <div className="row">
            <div className="col-md-6 mb-3">
               <label className="form-label" htmlFor="plan-name">
                  요금제 이름*
               </label>
               <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name" id="plan-name" aria-label="요금제 이름" title="요금제 이름" value={planData.name} onChange={onInputChange} />
               {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-md-6 mb-3">
               <label className="form-label" htmlFor="plan-price">
                  가격 (원)*
               </label>
               <input type="text" className={`form-control ${errors.price ? 'is-invalid' : ''}`} name="price" id="plan-price" aria-label="가격" title="가격" value={planData.price} onChange={onPriceChange} />
               {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
         </div>
         <div className="mb-3">
            <label className="form-label" htmlFor="plan-description">
               설명*
            </label>
            <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} name="description" id="plan-description" aria-label="설명" title="설명" value={planData.description} onChange={onInputChange} rows="3" />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
         </div>
         <div className="mb-3">
            <label className="form-label" htmlFor="plan-networkType">
               네트워크 타입*
            </label>
            <select className={`form-select ${errors.networkType ? 'is-invalid' : ''}`} name="networkType" id="plan-networkType" aria-label="네트워크 타입" title="네트워크 타입" value={planData.networkType} onChange={onInputChange}>
               <option value="">선택하세요</option>
               {networkTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                     {type.label}
                  </option>
               ))}
            </select>
            {errors.networkType && <div className="invalid-feedback">{errors.networkType}</div>}
         </div>

         <div className="mb-3">
            <label className="form-label" htmlFor="plan-age">
               연령대*
            </label>
            <select className={`form-select ${errors.age ? 'is-invalid' : ''}`} name="age" id="plan-age" aria-label="연령대" title="연령대" value={planData.age} onChange={onInputChange}>
               <option value="">선택하세요</option>
               {ageOptions &&
                  ageOptions.map((opt) => (
                     <option key={opt.value} value={opt.value}>
                        {opt.label}
                     </option>
                  ))}
            </select>
            {errors.age && <div className="invalid-feedback">{errors.age}</div>}
         </div>

         <div className="mb-3">
            <label className="form-label" htmlFor="plan-dis">
               약정기간*
            </label>
            <select className={`form-select ${errors.dis ? 'is-invalid' : ''}`} name="dis" id="plan-dis" aria-label="약정기간" title="약정기간" value={planData.dis} onChange={onInputChange}>
               <option value="">선택하세요</option>
               {disOptions &&
                  disOptions.map((opt) => (
                     <option key={opt.value} value={opt.value}>
                        {opt.label}
                     </option>
                  ))}
            </select>
            {errors.dis && <div className="invalid-feedback">{errors.dis}</div>}
         </div>
      </div>
   )
}

export default BasicInfoForm
