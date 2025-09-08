import { faHome, faUsers, faCreditCard, faShoppingCart, faHandshake, faQuestionCircle, faMoon, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const AdminSidebar = () => {
   const [darkMode, setDarkMode] = useState(false)

   return (
      <div className="admin-sidebar">
         <div className="sidebar-content">
            <div className="sidebar-header">
               <Link to="/admin" className="logo">
                  YORE
               </Link>
            </div>
            <nav className="sidebar-menu">
               <Link to="/admin" className="menu-item active">
                  <FontAwesomeIcon icon={faHome} />
                  <span>홈</span>
               </Link>
               <Link to="/admin/users" className="menu-item">
                  <FontAwesomeIcon icon={faUsers} />
                  <span>사용자</span>
               </Link>
               <Link to="/admin/plans" className="menu-item">
                  <FontAwesomeIcon icon={faCreditCard} />
                  <span>요금제</span>
               </Link>
               <Link to="/admin/orders" className="menu-item">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>결제</span>
               </Link>
            </nav>
            <div className="sidebar-footer">
               <div
                  className="menu-item"
                  onClick={() => {
                     const newDarkMode = !darkMode
                     setDarkMode(newDarkMode)
                     document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light')
                     localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
                  }}
                  style={{ cursor: 'pointer' }}
               >
                  <FontAwesomeIcon icon={faMoon} />
                  <span>다크 모드 {darkMode ? '끄기' : '켜기'}</span>
               </div>
            </div>
         </div>
      </div>
   )
}
