import '../../assets/css/modal.css'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, getInput, showModalThunk } from '../../features/modal/modalSlice'
import { useState, useId } from 'react'
import { registerAdmin } from '@/features/admin/adminSlice'

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

   const [email, setId] = useState('')
   const [password, setPassword] = useState('')
   const [rememberMe, setRememberMe] = useState(false)
   const idPrefix = useId()

   const onClickConfirm = () => {
      dispatch(getInput({ email, password, rememberMe }))
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
   const onClickRegister = async () => {
      try {
         await dispatch(registerAdmin({ email: 'a@a.com', password: 'admin' })).unwrap()
         dispatch(showModalThunk({ type: 'alert', placeholder: '관리자 계정이 생성되었습니다.' }))
      } catch (error) {
         dispatch(showModalThunk({ type: 'alert', placeholder: error || '관리자 계정 생성에 실패했습니다.' }))
      }
   }

   return (
      <div className="overlay modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="modalTitleId" aria-modal="true">
         <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="modalTitleId">
                     매니저 로그인 화면입니다.
                  </h5>
                  <a style={{ cursor: 'pointer' }} onClick={onClickRegister}>
                     관리자 생성
                  </a>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClickClose} />
               </div>
               <div className="modal-body text-center">
                  <ul className="list-unstyled">
                     <li className="mt-3">
                        <input id={`${idPrefix}-modalAdminEmail`} onChange={(e) => setId(e.target.value)} value={email} placeholder="이메일을 입력해주세요"></input>
                     </li>
                     <li className="mt-3">
                        <input id={`${idPrefix}-modalAdminPassword`} onKeyDown={(e) => onKeydownKey(e)} type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="비밀번호를 입력해주세요"></input>
                     </li>
                     <li className="mt-3 d-flex align-items-center justify-content-center">
                        <input type="checkbox" id={`${idPrefix}-modalAdminRememberMeCheckbox`} className="me-2" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                        <label htmlFor={`${idPrefix}-modalAdminRememberMeCheckbox`} className="mb-0" style={{ fontSize: '0.95em', cursor: 'pointer' }}>
                           로그인 유지
                        </label>
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
