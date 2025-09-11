import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const FeatureForm = ({ features, errors, onFeatureChange, onAddFeature, onRemoveFeature }) => {
   return (
      <div className="mb-4">
         <h5 className="card-title mb-3">
            혜택
            <button type="button" className="btn btn-sm btn-outline-primary ms-2" onClick={onAddFeature}>
               + 추가
            </button>
         </h5>
         {features.map((feature, index) => (
            <div key={index} className="mb-2 d-flex align-items-center">
               <input type="text" className={`form-control ${errors.features ? 'is-invalid' : ''}`} value={feature} onChange={(e) => onFeatureChange(index, e.target.value)} placeholder="혜택을 입력하세요" />
               {index > 0 && (
                  <button type="button" className="btn btn-outline-danger ms-2" onClick={() => onRemoveFeature(index)}>
                     <FontAwesomeIcon icon={faTrash} />
                  </button>
               )}
            </div>
         ))}
         {errors.features && <div className="text-danger small mt-1">{errors.features}</div>}
      </div>
   )
}

export default FeatureForm
