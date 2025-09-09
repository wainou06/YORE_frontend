import '../../assets/css/modal.css'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, getInput } from '../../features/modal/modalSlice'
import { useState } from 'react'

export const ModalAlert = () => {
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

export const ModalConfirm = () => {
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

export const ModalPrompt = () => {
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
               <i class="bi bi-x-circle"></i>
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

export const ModalRating = () => {
   const dispatch = useDispatch()
   const [input, setInput] = useState('')
   const [score, setScore] = useState(null)

   const onClickConfirm = () => {
      dispatch(getInput({ input, score }))
      dispatch(closeModal())
   }
   const onClickClose = () => {
      dispatch(getInput({}))
      dispatch(closeModal())
   }
   const onClickStar = (e) => {
      setScore(e)
   }

   return (
      <div className="overlay">
         <div className="popup">
            <button onClick={onClickClose} className="close-btn">
               <i class="bi bi-x-circle"></i>
            </button>
            <div className="popup-content">
               <p className="popup-message">별점 남기기</p>
               <ul className="popup-message">
                  <li className="popup-message-list" onClick={() => onClickStar(1)}>
                     {score >= 1 ? <>🌸</> : <>🥀</>}
                  </li>
                  <li className="popup-message-list" onClick={() => onClickStar(2)}>
                     {score >= 2 ? <>🌸</> : <>🥀</>}
                  </li>
                  <li className="popup-message-list" onClick={() => onClickStar(3)}>
                     {score >= 3 ? <>🌸</> : <>🥀</>}
                  </li>
                  <li className="popup-message-list" onClick={() => onClickStar(4)}>
                     {score >= 4 ? <>🌸</> : <>🥀</>}
                  </li>
                  <li className="popup-message-list" onClick={() => onClickStar(5)}>
                     {score >= 5 ? <>🌸</> : <>🥀</>}
                  </li>
               </ul>
               <textarea value={input} onChange={(e) => setInput(e.target.value)} className="popup-message-long" placeholder="평가를 남길거에요"></textarea>
               <p onClick={onClickConfirm} style={{ cursor: 'pointer' }} className="popup-message">
                  {'확인>'}
               </p>
            </div>
         </div>
      </div>
   )
}

export const ModalManagerLogin = () => {
   const dispatch = useDispatch()

   const [id, setId] = useState('')
   const [password, setPassword] = useState('')

   const onClickConfirm = () => {
      dispatch(getInput({ id, password }))
      dispatch(closeModal())
   }
   const onClickClose = () => {
      dispatch(getInput(null))
      dispatch(closeModal())
   }

   return (
      <div className="overlay modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="modalTitleId" aria-modal="true">
         <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="modalTitleId">
                     매니저 로그인 화면입니다.
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClickClose} />
               </div>
               <div className="modal-body text-center">
                  <ul className="list-unstyled">
                     <li className="mt-3">
                        <input onChange={(e) => setId(e.target.value)} value={id} placeholder="아이디를 입력해주세요"></input>
                     </li>
                     <li className="mt-3">
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="비밀번호를 입력해주세요"></input>
                     </li>
                  </ul>
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
