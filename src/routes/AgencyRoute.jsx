import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import Layout from '@components/common/Layout'

const AgencyRoute = () => {
   const { user } = useSelector((state) => state.auth)
   const navigate = useNavigate()

   useEffect(() => {
      if (!user || user.access !== 'agency') {
         navigate('/', { replace: true })
      }
   }, [user, navigate])

   if (!user || user.access !== 'agency') return null

   return (
      <Layout>
         <Outlet />
      </Layout>
   )
}

export default AgencyRoute
