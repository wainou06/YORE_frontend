import { ModalAlertComponent, ModalConfirmComponent, ModalPromptComponent } from './modals/MordalNormal'
import { ModalManagerLoginComponent } from './modals/ModalManager'

/*
모달 사용법✨✨
import { ModalComponent } from "../?../Modal.jsx"
import { showModalThunk } from "../?../modalSlice.js"

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
*/

export const ModalAlert = () => {
   return <ModalAlertComponent />
}

export const ModalConfirm = () => {
   return <ModalConfirmComponent />
}

export const ModalPrompt = () => {
   return <ModalPromptComponent />
}

export const ModalManagerLogin = () => {
   return <ModalManagerLoginComponent />
}
