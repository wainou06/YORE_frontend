import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ModalConfirm } from './Modal'
import { useDispatch } from 'react-redux'
import { showModalThunk } from '@/features/modal/modalSlice'

const Footer = () => {
   const [showAdminModal, setShowAdminModal] = useState(false)
   const dispatch = useDispatch()
   const modal = useSelector((state) => state.modal)
   const onClickAdmin = () => {
      dispatch(showModalThunk({ type: 'confirm', placeholder: '정지 일 수를 입력해주세요' }))
   }

   return (
      <footer className="bg-light mt-auto">
         <div className="container py-4">
            <div className="row">
               <div className="col-md-4">
                  <h5 className="mb-3">YORE</h5>
                  <p className="text-muted">더 나은 통신 생활을 위한 현명한 선택</p>
               </div>
               <div className="col-md-4">
                  <h5 className="mb-3">바로가기</h5>
                  <ul className="list-unstyled">
                     <li>
                        <Link to="/plans" className="text-muted">
                           요금제
                        </Link>
                     </li>
                     <li>
                        <Link to="/carriers" className="text-muted">
                           통신사
                        </Link>
                     </li>
                     <li>
                        <a href="https://open.kakao.com" className="text-muted" target="_blank" rel="noopener noreferrer">
                           고객센터
                        </a>
                     </li>
                  </ul>
               </div>
               <div className="col-md-4">
                  <h5 className="mb-3">고객지원</h5>
                  <ul className="list-unstyled">
                     <li>
                        <Link to="/terms" className="text-muted">
                           이용약관
                        </Link>
                     </li>
                     <li>
                        <Link to="/privacy" className="text-muted">
                           개인정보처리방침
                        </Link>
                     </li>
                     <li>
                        <button className="btn btn-link text-decoration-none text-muted p-0" onClick={() => onClickAdmin()}>
                           관리자
                        </button>
                     </li>
                  </ul>
               </div>
            </div>
            <hr className="my-4" />
            <p className="text-center text-muted mb-0">© 2025 YORE. All rights reserved.</p>
         </div>
         {modal.type === 'confirm' && <ModalConfirm />}
      </footer>
   )
}

export default Footer
