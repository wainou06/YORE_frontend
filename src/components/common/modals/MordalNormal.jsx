import '../../../assets/css/modal.css'

import { closeModal, getInput } from '@/features/modal/modalSlice'
import { useDispatch, useSelector } from 'react-redux'

export const ModalAlertComponent = () => {
   const dispatch = useDispatch()
   const modal = useSelector((state) => state.modal)

   const onClickClose = () => {
      dispatch(closeModal())
   }

   return (
      <div className=" overlay modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="modalTitleId" aria-modal="true">
         <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="modalTitleId">
                     알려드려요
                  </h5>
               </div>
               <div className="modal-body">
                  <p>{modal.placeholder}</p>
               </div>
               <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={onClickClose}>
                     확인
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export const ModalConfirmComponent = () => {
   const dispatch = useDispatch()
   const modal = useSelector((state) => state.modal)

   const onClickConfirm = () => {
      dispatch(getInput(true))
      dispatch(closeModal())
   }
   const onClickClose = () => {
      dispatch(getInput(null))
      dispatch(closeModal())
   }

   return (
      <div className=" overlay modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="modalTitleId" aria-modal="true">
         <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="modalTitleId">
                     선택해주세요
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClickClose} />
               </div>
               <div className="modal-body">
                  <p>{modal.placeholder}</p>
               </div>
               <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClickClose}>
                     취소
                  </button>
                  <button type="button" className="btn btn-primary" onClick={onClickConfirm}>
                     확인
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export const ModalPromptComponent = () => {
   const dispatch = useDispatch()
   const modal = useSelector((state) => state.modal)

   const onClickConfirm = () => {
      dispatch(getInput(input))
      dispatch(closeModal())
   }
   const onClickClose = () => {
      dispatch(getInput(null))
      dispatch(closeModal())
   }
   const onKeydownKey = (e) => {
      if (e.key === 'Enter') {
         onClickConfirm()
         return
      } else if (e.key === 'Escape') {
         onClickClose()
         return
      }
   }
   return (
      <div className="overlay">
         <div className="popup">
            <button onClick={onClickClose} className="close-btn">
               <i className="bi bi-x-circle"></i>
            </button>
            <div className="popup-content">
               <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => onKeydownKey(e)} className="popup-message" placeholder={modal.placeholder}></input>
               <p onClick={onClickConfirm} style={{ cursor: 'pointer' }} className="popup-message">
                  {'확인>'}
               </p>
            </div>
         </div>
      </div>
   )
}
