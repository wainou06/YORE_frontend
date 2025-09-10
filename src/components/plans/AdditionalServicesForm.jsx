import React from 'react'

const AdditionalServicesForm = ({ services, planServices, requiredServices, onServiceToggle, onRequiredServiceToggle }) => {
   return (
      <div>
         <h5 className="card-title mb-3">부가 서비스</h5>
         <div className="row">
            {services.map((service) => (
               <div key={service.id} className="col-md-6 mb-3">
                  <div className={`card ${planServices.includes(service.id) ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }}>
                     <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                           <div>
                              <h6 className="card-title">{service.name}</h6>
                              <p className="card-text small text-muted mb-2">{service.description}</p>
                              <div className="text-primary">+{service.price.toLocaleString()}원</div>
                           </div>
                           <div className="d-flex flex-column">
                              <div className="form-check">
                                 <input type="checkbox" className="form-check-input" checked={planServices.includes(service.id)} onChange={() => onServiceToggle(service)} />
                                 <label className="form-check-label">선택</label>
                              </div>
                              {planServices.includes(service.id) && (
                                 <div className="form-check mt-2">
                                    <input type="checkbox" className="form-check-input" checked={requiredServices.includes(service.id)} onChange={() => onRequiredServiceToggle(service.id)} />
                                    <label className="form-check-label">필수</label>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

export default AdditionalServicesForm
