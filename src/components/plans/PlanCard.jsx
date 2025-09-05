import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobileAlt, faWifi, faEnvelope } from '@fortawesome/free-solid-svg-icons'

const PlanCard = ({ plan }) => {
   return (
      <div className="card h-100">
         <div className="card-body">
            <div className={`badge ${plan.carrier === 'SKT' ? 'bg-danger' : plan.carrier === 'KT' ? 'bg-primary' : 'bg-danger'} mb-3`}>{plan.carrier}</div>
            <h5 className="card-title">{plan.name}</h5>

            <div className="my-3">
               <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faWifi} className="text-primary me-2" />
                  <span>데이터 {plan.data}</span>
               </div>
               <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-primary me-2" />
                  <span>통화 {plan.voice}</span>
               </div>
               <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary me-2" />
                  <span>문자 {plan.sms}</span>
               </div>
            </div>

            <div className="text-end mt-4">
               <h4 className="text-primary mb-0">{plan.price.toLocaleString()}원</h4>
               <small className="text-muted">월</small>
            </div>
         </div>

         <div className="card-footer bg-transparent border-top-0">
            <Link to={`/plans/${plan.id}`} className="btn btn-outline-primary w-100">
               자세히 보기
            </Link>
         </div>
      </div>
   )
}

export default PlanCard
