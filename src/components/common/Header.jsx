import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBars, faTimes, faChartLine } from '@fortawesome/free-solid-svg-icons'
import logo from '../../../public/images/logo.png'

const Header = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const user = useSelector((state) => state.auth.user)
   const isAgency = user?.access === 'agency'

   return (
      <header className="bg-white shadow-sm sticky-top">
         <nav className="navbar navbar-expand-lg navbar-light container py-3">
            <Link className="navbar-brand" to="/">
               <img src={logo} alt="YORE" height="30" />
               <h1>YORE</h1>
            </Link>

            <button className="navbar-toggler border-0" type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
               <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-primary" />
            </button>

            <div className={`navbar-collapse ${isMenuOpen ? 'show' : 'collapse'}`}>
               <form
                  className="form-inline mx-auto w-50"
                  onSubmit={(e) => {
                     e.preventDefault()
                     const searchInput = e.target.querySelector('input')
                     if (searchInput.value.trim()) {
                        window.location.href = `/plans?search=${encodeURIComponent(searchInput.value)}`
                     }
                  }}
               >
                  <div className="input-group w-100">
                     <input type="search" className="form-control" placeholder="요금제 검색..." />
                     <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                           <FontAwesomeIcon icon={faSearch} />
                        </button>
                     </div>
                  </div>
               </form>

               <ul className="navbar-nav ml-auto">
                  {isAgency ? (
                     <>
                        <li className="nav-item">
                           <Link to="/agency/plans/create" className="nav-link">
                              요금제 등록
                           </Link>
                        </li>
                        <li className="nav-item">
                           <Link to="/agency/plans" className="nav-link">
                              <FontAwesomeIcon icon={faChartLine} className="me-1" />
                              요금제 관리
                           </Link>
                        </li>
                     </>
                  ) : (
                     <>
                        <li className="nav-item">
                           <Link className="nav-link" to="/plans">
                              요금제
                           </Link>
                        </li>
                        <li className="nav-item">
                           <Link className="nav-link" to="/carriers">
                              통신사
                           </Link>
                        </li>
                     </>
                  )}
                  <li className="nav-item">
                     <a className="nav-link" href="https://pf.kakao.com/_tFPkn/chat" target="_blank" rel="noopener noreferrer">
                        고객센터
                     </a>
                  </li>
               </ul>
            </div>
         </nav>
      </header>
   )
}

export default Header
