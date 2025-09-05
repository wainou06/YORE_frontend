import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
   return (
      <header className="bg-white shadow-sm">
         <nav className="navbar navbar-expand-lg navbar-light container py-3">
            <Link className="navbar-brand" to="/">
               <img src="/images/logo.svg" alt="YORE" height="30" />
            </Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
               <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
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
                  <li className="nav-item">
                     <a className="nav-link" href="https://open.kakao.com" target="_blank" rel="noopener noreferrer">
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
