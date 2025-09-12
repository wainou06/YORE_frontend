import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ModalManagerLogin } from './Modal'
import { useDispatch } from 'react-redux'
import { showModalThunk } from '@/features/modal/modalSlice'
import { loginAdmin } from '@/features/admin/adminSlice'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const modal = useSelector((state) => state.modal)

   const onClickAdmin = async () => {
      try {
         const modalResult = await dispatch(showModalThunk({ type: 'managerLogin', placeholder: '매니저 로그인 화면입니다!' }))

         if (!modalResult.payload) {
            return
         }

         const result = await dispatch(loginAdmin(modalResult.payload)).unwrap()
         if (result && result.token) {
            // 기존 user token이 있으면 삭제 (admin 로그인 시 user 세션 강제 종료)
            localStorage.removeItem('token')
            const adminToken = 'admin_' + result.token
            if (modalResult.payload.rememberMe) {
               localStorage.setItem('adminToken', adminToken)
            } else {
               sessionStorage.setItem('adminToken', adminToken)
            }
            navigate('/admin')
         }
      } catch (error) {
         dispatch(showModalThunk({ type: 'alert', placeholder: error || '관리자 로그인에 실패했습니다.' }))
      }
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
         {modal.type === 'managerLogin' && <ModalManagerLogin />}
      </footer>
   )
}

export default Footer
