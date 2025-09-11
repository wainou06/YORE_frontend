import React from 'react'

const PlanQuotaForm = ({ planData, errors, onInputChange }) => {
   return (
      <div className="mb-4">
         <h5 className="card-title mb-3">제공량</h5>
         <div className="row">
            <div className="col-md-4 mb-3">
               <label className="form-label">데이터*</label>
               <input type="text" className={`form-control ${errors.data ? 'is-invalid' : ''}`} name="data" value={planData.data} onChange={onInputChange} placeholder="예: 5GB, 무제한" />
               {errors.data && <div className="invalid-feedback">{errors.data}</div>}
            </div>
            <div className="col-md-4 mb-3">
               <label className="form-label">통화*</label>
               <input type="text" className={`form-control ${errors.voice ? 'is-invalid' : ''}`} name="voice" value={planData.voice} onChange={onInputChange} placeholder="예: 200분, 무제한" />
               {errors.voice && <div className="invalid-feedback">{errors.voice}</div>}
            </div>
            <div className="col-md-4 mb-3">
               <label className="form-label">문자*</label>
               <input type="text" className={`form-control ${errors.sms ? 'is-invalid' : ''}`} name="sms" value={planData.sms} onChange={onInputChange} placeholder="예: 100건, 무제한" />
               {errors.sms && <div className="invalid-feedback">{errors.sms}</div>}
            </div>
         </div>
      </div>
   )
}

export default PlanQuotaForm
