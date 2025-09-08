import { Provider } from 'react-redux'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/app/store'
import { queryClient } from '@/app/queryClient'
import AppRoutes from '@/routes'
import '@/assets/css/global.css'
import '@/assets/css/slider.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

function App() {
   return (
      <Provider store={store}>
         <QueryClientProvider client={queryClient}>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
               <AppRoutes />
            </BrowserRouter>
         </QueryClientProvider>
      </Provider>
   )
}

export default App
