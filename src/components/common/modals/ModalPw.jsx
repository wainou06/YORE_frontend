import '../../../assets/css/modal.css'
import { closeModal } from '@/features/modal/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { authAPI } from '@/api/authApi'

export const ModalForgetPassword = () => {
   const dispatch = useDispatch()
   const modal = useSelector((state) => state.modal)

   const [step, setStep] = useState(1) // 1단계: 방법 선택 / 2단계: 입력
   const [method, setMethod] = useState(null) // 'email' | 'phone'
   const [inputValue, setInputValue] = useState('')
   const [tempPassword, setTempPassword] = useState(null)

   const handleMethodSelect = (type) => {
      setMethod(type)
      setStep(2)
   }

   const handleFindPw = async () => {
      try {
         const res = await authAPI.findPassword({ method, value: inputValue })
         if (res.data.success) {
            setTempPassword(res.data.tempPassword)
         } else {
            setTempPassword(res.data.message || '해당 사용자가 존재하지 않습니다.')
         }
      } catch (err) {
         console.error(err)
         setTempPassword('서버 오류가 발생했습니다.')
      }
   }

   const handleClose = () => {
      dispatch(closeModal())
      setStep(1)
      setMethod(null)
      setInputValue('')
      setTempPassword(null)
   }

   return (
      <div className="overlay modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="modalTitleId" aria-modal="true">
         <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="modalTitleId">
                     비밀번호 찾기
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose} />
               </div>

               <div className="modal-body">
                  {/* STEP 1: 찾기 방법 선택 */}
                  {step === 1 && (
                     <div className="d-flex flex-column gap-3">
                        <button className="btn btn-outline-primary" onClick={() => handleMethodSelect('email')}>
                           이메일로 찾기
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => handleMethodSelect('phone')}>
                           휴대폰 번호로 찾기
                        </button>
                     </div>
                  )}

                  {/* STEP 2: 입력 */}
                  {step === 2 && (
                     <div>
                        {!tempPassword ? (
                           <>
                              <p>{method === 'email' ? '이메일을 입력하세요.' : '휴대폰 번호를 입력하세요.'}</p>
                              <input type={method === 'email' ? 'email' : 'text'} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="form-control mb-3" placeholder={method === 'email' ? 'example@email.com' : '010-1234-5678'} />
                              <button className="btn btn-primary w-100" onClick={handleFindPw}>
                                 확인
                              </button>
                           </>
                        ) : (
                           <div className="text-center">
                              <p>{typeof tempPassword === 'string' ? tempPassword : '임시 비밀번호를 발급받았습니다.'}</p>
                              {typeof tempPassword === 'string' && tempPassword.startsWith('해당') === false && <h5 className="text-danger">{tempPassword}</h5>}
                           </div>
                        )}
                     </div>
                  )}
               </div>

               <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                     닫기
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}
