import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import logo from '@assets/images/logo.png'

const Footer = () => {
   const [showAdminModal, setShowAdminModal] = useState(false)
   const [adminLoginForm, setAdminLoginForm] = useState({
      username: '',
      password: '',
   })

   const handleAdminLogin = (e) => {
      e.preventDefault()
      // TODO: 관리자 로그인 처리 로직 구현
      console.log('Admin login attempt:', adminLoginForm)
      setShowAdminModal(false)
   }

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setAdminLoginForm((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   return (
      <>
         <footer className="footer">
            <div className="container py-4">
               <div className="row">
                  <div className="col-md-4 d-flex flex-column align-items-start">
                     <div className="footer-brand">
                        <img src={logo} alt="YORE" height="30" />
                        <h1>YORE</h1>
                     </div>
                     <p>더 나은 통신 생활을 위한 현명한 선택</p>
                  </div>
                  <div className="col-md-4">
                     <h5>바로가기</h5>
                     <ul className="footer-links">
                        <li>
                           <Link to="/plans">요금제</Link>
                        </li>
                        <li>
                           <Link to="/carriers">통신사</Link>
                        </li>
                        <li>
                           <a href="https://open.kakao.com" target="_blank" rel="noopener noreferrer">
                              고객센터
                           </a>
                        </li>
                     </ul>
                  </div>
                  <div className="col-md-4">
                     <h5>고객지원</h5>
                     <ul className="footer-links">
                        <li>
                           <Link to="/terms">이용약관</Link>
                        </li>
                        <li>
                           <Link to="/privacy">개인정보처리방침</Link>
                        </li>
                        <li>
                           <span role="button" onClick={() => setShowAdminModal(true)} style={{ cursor: 'pointer' }}>
                              관리자
                           </span>
                        </li>
                     </ul>
                  </div>
               </div>
               <hr className="my-4" />
               <p className="text-center text-muted mb-0">© 2025 YORE. All rights reserved.</p>
            </div>
         </footer>

         <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>관리자 로그인</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form onSubmit={handleAdminLogin}>
                  <Form.Group className="mb-3">
                     <Form.Label>아이디</Form.Label>
                     <Form.Control type="text" name="username" value={adminLoginForm.username} onChange={handleInputChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>비밀번호</Form.Label>
                     <Form.Control type="password" name="password" value={adminLoginForm.password} onChange={handleInputChange} required />
                  </Form.Group>
                  <div className="d-grid">
                     <Button variant="primary" type="submit">
                        로그인
                     </Button>
                  </div>
               </Form>
            </Modal.Body>
         </Modal>
      </>
   )
}

export default Footer
