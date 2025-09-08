// import CloseIcon from '@mui/icons-material/Close'
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
      <div className="overlay">
         <div className="popup">
            <button onClick={onClickClose} className="close-btn">
               {/* <CloseIcon /> */}
            </button>
            <div className="popup-content">
               <p className="popup-message">{modal.placeholder}</p>
               <p onClick={onClickClose} style={{ cursor: 'pointer' }} className="popup-message">
                  {'확인>'}
               </p>
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
      <div className="overlay">
         <div className="popup">
            <button onClick={onClickClose} className="close-btn">
               {/* <CloseIcon /> */}
            </button>
            <div className="popup-content">
               <p className="popup-message">{modal.placeholder}</p>
               <p onClick={onClickConfirm} style={{ cursor: 'pointer' }} className="popup-message">
                  {'확인>'}
               </p>
               <p onClick={onClickClose} style={{ cursor: 'pointer' }} className="popup-message">
                  {'취소>'}
               </p>
            </div>
         </div>
      </div>
   )
}

export const ModalPrompt = () => {
   const dispatch = useDispatch()
   const modal = useSelector((state) => state.modal)
   const [input, setInput] = useState('')

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
               {/* <CloseIcon /> */}
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
               {/* <CloseIcon /> */}
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
