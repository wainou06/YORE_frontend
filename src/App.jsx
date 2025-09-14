import { Provider, useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { store } from '@/app/store'
import AppRoutes from '@/routes'
import '@/assets/css/global.css'
import '@/assets/css/slider.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'react-toastify/dist/ReactToastify.css'
import 'slick-carousel/slick/slick-theme.css'
import { ModalAlert, ModalConfirm, ModalPrompt, ModalManagerLogin } from './components/common/Modal'

function ModalRoot() {
   const modal = useSelector((state) => state.modal)
   return (
      <>
         {modal.type === 'alert' && <ModalAlert />}
         {modal.type === 'confirm' && <ModalConfirm />}
         {modal.type === 'prompt' && <ModalPrompt />}
         {modal.type === 'rating' && <ModalRating />}
         {modal.type === 'managerLogin' && <ModalManagerLogin />}
      </>
   )
}

function App() {
   return (
      <Provider store={store}>
         <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
            <ToastContainer position="bottom-right" autoClose={3000} />
            <ModalRoot />
         </BrowserRouter>
      </Provider>
   )
}

export default App
