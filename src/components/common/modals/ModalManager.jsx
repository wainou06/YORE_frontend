import '../../../assets/css/modal.css'

import { closeModal, getInput, showModalThunk } from '@/features/modal/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { registerAdmin } from '@/features/admin/adminSlice'
import { useState, useId, useEffect } from 'react'
import { getUserDetailThunk } from '@/features/analytics/analyticsSlice'

export const ModalManagerLoginComponent = () => {
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

export const ModalAdminUserDetailComponent = () => {
   const dispatch = useDispatch()
   const modal = useSelector((state) => state.modal)
   const userDetail = useSelector((state) => state.analytics.userDetail)

   useEffect(() => {
      dispatch(getUserDetailThunk(modal.placeholder))
   }, [dispatch])

   const onClickConfirm = () => {
      dispatch(getInput(null))
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
                     유저 상세보기입니다.
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClickClose} />
               </div>
               <div className="modal-body">
                  <ul className="list-unstyled">
                     <li className="mt-3">번호: {userDetail?.userDetail?.id}</li>
                     <li className="mt-3">이름: {userDetail?.userDetail?.name}</li>
                     <li className="mt-3">이메일: {userDetail?.userDetail?.email}</li>
                     <li className="mt-3">전화번호: {userDetail?.userDetail?.phone}</li>
                     <li className="mt-3">생일: {userDetail?.userDetail?.birth ? <>{userDetail?.userDetail?.birth}</> : <>아직 정하지 않았어요</>}</li>
                     <li className="mt-3">포인트: {userDetail?.userDetail?.point}</li>
                     <li className="mt-3">역할: {userDetail?.userDetail?.access}</li>
                     <li className="mt-3">생성일: {new Date(userDetail?.userDetail?.createdAt).toLocaleDateString()}</li>
                  </ul>
               </div>
               <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={onClickConfirm}>
                     확인
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}
