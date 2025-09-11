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
      <div className="container py-5 content_box">
         <div className="row justify-content-center">
            <div className="col-md-10">
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
                     <h2>나의 사용량</h2>
                     <div className="my_data">
                        <p>데이터</p>
                        <p>통화량</p>
                     </div>
                  </div>
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
         </div>
      </div>
   )
}

export default Myinfo
