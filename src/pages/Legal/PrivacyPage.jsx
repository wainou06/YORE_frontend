import { Container, Row, Col } from 'react-bootstrap'

const PrivacyPage = () => {
   return (
      <Container className="py-5">
         <Row>
            <Col>
               <h1 className="mb-4">개인정보 처리방침</h1>

               <section className="mb-5">
                  <h2 className="h4 mb-3">1. 개인정보의 수집 및 이용 목적</h2>
                  <p className="mb-4">YORE(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                  <ol className="list-unstyled">
                     <li className="mb-2">1. 회원 가입 및 관리</li>
                     <li className="mb-2">2. 서비스 제공</li>
                     <li className="mb-2">3. 마케팅 및 광고에의 활용 (선택)</li>
                  </ol>
               </section>

               <section className="mb-5">
                  <h2 className="h4 mb-3">2. 수집하는 개인정보 항목</h2>
                  <p className="mb-3">회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
                  <h3 className="h5 mb-3">필수항목</h3>
                  <ul className="list-unstyled mb-4">
                     <li className="mb-2">- 이름</li>
                     <li className="mb-2">- 생년월일</li>
                     <li className="mb-2">- 휴대전화번호</li>
                     <li className="mb-2">- 이메일 주소</li>
                  </ul>
                  <h3 className="h5 mb-3">선택항목</h3>
                  <ul className="list-unstyled">
                     <li className="mb-2">- 직업</li>
                     <li className="mb-2">- 관심 분야</li>
                  </ul>
               </section>

               <section className="mb-5">
                  <h2 className="h4 mb-3">3. 개인정보의 보유 및 이용기간</h2>
                  <p className="mb-3">회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
                  <ul className="list-unstyled">
                     <li className="mb-2">- 계약 또는 청약철회 등에 관한 기록: 5년</li>
                     <li className="mb-2">- 대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                     <li className="mb-2">- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                  </ul>
               </section>

               <section className="mb-5">
                  <h2 className="h4 mb-3">4. 개인정보의 파기절차 및 방법</h2>
                  <p className="mb-3">회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                  <ol className="list-unstyled">
                     <li className="mb-2">1. 파기절차: 불필요한 개인정보는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 파기</li>
                     <li className="mb-2">
                        2. 파기방법
                        <ul className="list-unstyled mt-2 ms-3">
                           <li>- 전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
                           <li>- 인쇄물: 파쇄 또는 소각</li>
                        </ul>
                     </li>
                  </ol>
               </section>

               <section className="mb-5">
                  <h2 className="h4 mb-3">5. 개인정보 보호책임자</h2>
                  <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                  <div className="ms-3">
                     <p className="mb-1">▶ 개인정보 보호책임자</p>
                     <p className="mb-1">성명: 홍길동</p>
                     <p className="mb-1">직책: 개인정보 보호책임자</p>
                     <p className="mb-1">연락처: privacy@yore.com</p>
                  </div>
               </section>
            </Col>
         </Row>
      </Container>
   )
}

export default PrivacyPage
