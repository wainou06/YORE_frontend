import { Container, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
   const navigate = useNavigate()

   return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
         <Row className="text-center">
            <Col xs={12}>
               <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#0d6efd' }}>404</h1>
               <h2 className="mb-4">페이지를 찾을 수 없습니다</h2>
               <p className="text-muted mb-4">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
               <div className="d-flex gap-3 justify-content-center">
                  <Button variant="primary" onClick={() => navigate('/')}>
                     홈으로 이동
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                     이전 페이지로
                  </Button>
               </div>
            </Col>
         </Row>
      </Container>
   )
}

export default NotFoundPage
