import { ModalAlertComponent, ModalConfirmComponent, ModalPromptComponent } from './modals/MordalNormal'
import { ModalManagerLoginComponent } from './modals/ModalManager'

/*
모달 사용법✨✨

import { useSelector } from 'react-redux'
import { ModalComponent } from "../?../Modal.jsx"
import { showModalThunk } from "../?../modalSlice.js"


//예시 #1 값을 입력받아야 할 때, confirm 과 prompt
const component = () => {
   const modal = useSelector((state) => state.modal)
   
   const useModal = async () => {
         const result = await dispatch(showModalThunk({type : 'type', placeholder: '문장 입력'}))

         console.log(result.payload) //값을 입력받았어요
   }
      
   
   return (
      <>
      modal.type ==='type' && <ModalComponent />
      </>
   )
}

//예시 #2 알림만
const component = () => { //이름은 상관 없습니다
   const modal = useSelector((state) => state.modal)
   
   const useModalAlert = () => { //이름은 상관 없습니다
         dispatch(showModalThunk({type : 'alert', placeholder: '할 말을 적으세요'}))
   }
      
   return (
      <>
      <div>
         ...
         ...
         ...
      </div>
      modal.type ==='alert' && <ModalAlert />
      </>
   )
}
*/

//modals 파일의 컴포넌트를 끌어다 놓습니다
//새 모달 창을 만들어야 한다면 modals 파일에 생성하여 작성 한 뒤, 이곳에서 모아주면 됩니다

//알림, 확인 버튼이 존재합니다
export const ModalAlert = () => {
   return <ModalAlertComponent />
}

//수락, 확인과 취소 버튼이 존재합니다
export const ModalConfirm = () => {
   return <ModalConfirmComponent />
}

//입력, 데이터 값의 입력 창과, 확인과 취소 버튼이 존재합니다
export const ModalPrompt = () => {
   return <ModalPromptComponent />
}

//매니저 관련 모달 컴포넌트 입니다
export const ModalManagerLogin = () => {
   return <ModalManagerLoginComponent />
}
