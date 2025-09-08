import { Container, Row, Col } from 'react-bootstrap'

const TermsPage = () => {
   return (
      <Container className="py-5">
         <Row>
            <Col>
               <h1 className="mb-4">이용약관</h1>
               <section className="mb-5">
                  <h2 className="h4 mb-3">제1장 총칙</h2>
                  <article className="mb-4">
                     <h3 className="h5 mb-3">제1조 (목적)</h3>
                     <p>이 약관은 YORE(이하 "회사")가 제공하는 모바일 요금제 추천 및 가입 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                  </article>

                  <article className="mb-4">
                     <h3 className="h5 mb-3">제2조 (정의)</h3>
                     <ol className="list-unstyled">
                        <li className="mb-2">1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.</li>
                        <li className="mb-2">2. "이용자"란 회사의 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                        <li className="mb-2">3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 이용할 수 있는 자를 말합니다.</li>
                     </ol>
                  </article>
               </section>

               <section className="mb-5">
                  <h2 className="h4 mb-3">제2장 서비스 이용</h2>
                  <article className="mb-4">
                     <h3 className="h5 mb-3">제3조 (서비스의 제공)</h3>
                     <p>회사는 다음과 같은 서비스를 제공합니다:</p>
                     <ol className="list-unstyled">
                        <li className="mb-2">1. 모바일 요금제 추천 서비스</li>
                        <li className="mb-2">2. 통신사 요금제 가입 서비스</li>
                        <li className="mb-2">3. 부가서비스 신청 서비스</li>
                        <li className="mb-2">4. 기타 회사가 정하는 서비스</li>
                     </ol>
                  </article>

                  <article className="mb-4">
                     <h3 className="h5 mb-3">제4조 (서비스의 중단)</h3>
                     <p>회사는 다음과 같은 경우 서비스 제공을 중단할 수 있습니다:</p>
                     <ol className="list-unstyled">
                        <li className="mb-2">1. 서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
                        <li className="mb-2">2. 전기통신사업법에 규정된 기간통신사업자가 전기통신서비스를 중지했을 경우</li>
                        <li className="mb-2">3. 기타 불가항력적 사유가 있는 경우</li>
                     </ol>
                  </article>
               </section>

               <section className="mb-5">
                  <h2 className="h4 mb-3">제3장 의무 및 책임</h2>
                  <article className="mb-4">
                     <h3 className="h5 mb-3">제5조 (회사의 의무)</h3>
                     <p>회사는 서비스 제공과 관련하여 알고 있는 회원의 개인정보를 본인의 승낙 없이 제3자에게 제공하지 않습니다.</p>
                  </article>

                  <article className="mb-4">
                     <h3 className="h5 mb-3">제6조 (회원의 의무)</h3>
                     <p>회원은 서비스 이용과 관련하여 다음과 같은 행위를 하지 않아야 합니다:</p>
                     <ol className="list-unstyled">
                        <li className="mb-2">1. 다른 회원의 개인정보를 부정하게 사용하는 행위</li>
                        <li className="mb-2">2. 서비스를 이용하여 법령과 이 약관이 금지하는 행위를 하는 경우</li>
                        <li className="mb-2">3. 기타 불법적이거나 부당한 행위</li>
                     </ol>
                  </article>
               </section>
            </Col>
         </Row>
      </Container>
   )
}

export default TermsPage
