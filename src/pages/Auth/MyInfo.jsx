import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '@assets/css/MyInfo.css'

const Myinfo = () => {
   const navigate = useNavigate()
   const [userName, setUserName] = useState('')
   const [planName, setPlanName] = useState('사용 중인 요금제가 없습니다.')

   useEffect(() => {
      const storedName = localStorage.getItem('userName')
      if (storedName) {
         setUserName(storedName)
      }

      // 필요하면 요금제 이름도 localStorage에서 가져오기
      const storedPlan = localStorage.getItem('userPlan')
      if (storedPlan) {
         setPlanName(storedPlan)
      }
   }, [])

   return (
      <div className="container content_box py-5">
         <div className="row justify-content-center">
            <div className="col-md-10">
               <div className="row g-4">
                  {/* 왼쪽 텍스트 영역 */}
                  <div className="col-12 col-md-8">
                     <div className="col-12 mb-4">
                        <div className="text">
                           <h2>내 정보 관리</h2>
                           <p>이름: {userName}</p>
                        </div>
                        <button onClick={() => navigate('mysettings')}>개인정보 수정하기</button>
                     </div>

                     <div className="col-12 mb-4">
                        <div className="text">
                           <h2>내 요금제</h2>
                           <p>{planName}</p>
                        </div>
                        <button onClick={() => navigate('plansettings')}>요금제 관리</button>
                     </div>

                     <div className="col-12 mb-4">
                        <div className="text">
                           <h2>요금 청구서</h2>
                           <p>날짜와 금액</p>
                        </div>
                        <button onClick={() => navigate('billing')}>바로가기</button>
                     </div>

                     <div className="col-12 mb-4">
                        <div className="text">
                           <h2>고객센터</h2>
                           <p>문의하기</p>
                        </div>
                        <button onClick={() => navigate('')}>옵챗링크</button>
                     </div>
                  </div>

                  {/* 오른쪽 이미지 영역 */}
                  <div className="col-12 col-md-4 d-none d-md-flex align-items-start justify-content-center">
                     <img src="/src/assets/images/myInfo.png" alt="세팅 이미지" className="img-fluid responsive-settings" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Myinfo
