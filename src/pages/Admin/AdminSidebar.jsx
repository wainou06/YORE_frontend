import { faHome, faUsers, faCreditCard, faShoppingCart, faHandshake, faQuestionCircle, faMoon, faSearch, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const AdminSidebar = () => {
   const [darkMode, setDarkMode] = useState(false)
   const [currentPage, setCurrentPage] = useState(0)

   return (
      <div className="admin-sidebar">
         <div className="sidebar-content">
            <div className="sidebar-header">
               <Link onClick={() => currentPage(0)} to="/admin" className="logo">
                  YORE
               </Link>
            </div>
            <nav className="sidebar-menu">
               {currentPage === 0 ? (
                  <Link to="/admin" className="menu-item active">
                     <FontAwesomeIcon icon={faHome} />
                     <span>홈</span>
                  </Link>
               ) : (
                  <Link onClick={() => setCurrentPage(0)} to="/admin" className="menu-item">
                     <FontAwesomeIcon icon={faHome} />
                     <span>홈</span>
                  </Link>
               )}
               {currentPage === 1 ? (
                  <Link to="/admin/users" className="menu-item active">
                     <FontAwesomeIcon icon={faUsers} />
                     <span>사용자</span>
                  </Link>
               ) : (
                  <Link onClick={() => setCurrentPage(1)} to="/admin/users" className="menu-item">
                     <FontAwesomeIcon icon={faUsers} />
                     <span>사용자</span>
                  </Link>
               )}
               {currentPage === 2 ? (
                  <Link to="/admin/plans" className="menu-item active">
                     <FontAwesomeIcon icon={faCreditCard} />
                     <span>요금제</span>
                  </Link>
               ) : (
                  <Link onClick={() => setCurrentPage(2)} to="/admin/plans" className="menu-item">
                     <FontAwesomeIcon icon={faCreditCard} />
                     <span>요금제</span>
                  </Link>
               )}
               {currentPage === 3 ? (
                  <Link to="/admin/orders" className="menu-item active">
                     <FontAwesomeIcon icon={faShoppingCart} />
                     <span>결제</span>
                  </Link>
               ) : (
                  <Link onClick={() => setCurrentPage(3)} to="/admin/orders" className="menu-item">
                     <FontAwesomeIcon icon={faShoppingCart} />
                     <span>결제</span>
                  </Link>
               )}
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
                  <span>다크 모드</span>
               </div>
               <Link to="/" className="menu-item">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span>로그아웃</span>
               </Link>
            </div>
         </div>
      </div>
   )
}
