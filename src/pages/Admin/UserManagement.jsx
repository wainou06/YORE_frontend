import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserStatusThunk } from '@/features/analytics/analyticsSlice'
// import Modal from '../../components/common/Modal'
import { showModalThunk } from '@/features/modal/modalSlice'
import { ModalAdminUserDetailComponent } from '@/components/common/modals/ModalManager'

const UserManagement = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { isAuthenticated } = useSelector((state) => state.admin)
   const { loading, userManagement } = useSelector((state) => state.analytics)
   const [users, setUsers] = useState([])
   const [searchTerm, setSearchTerm] = useState('')
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)
   const modal = useSelector((state) => state.modal)
   const [filter, setFilter] = useState('')

   // 관리자 권한 체크
   useEffect(() => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
         document.documentElement.setAttribute('data-theme', 'dark')
      }

      if (!isAuthenticated) {
         navigate('/')
         return
      }

      dispatch(getUserStatusThunk({ currentPage, filter }))
   }, [currentPage, dispatch, filter])

   // 사용자 목록 로드
   useEffect(() => {
      if (!loading) {
         setTotalPages(userManagement.totalPages)
         setUsers(userManagement.data)
      }
   }, [loading])

   const handleSearch = (e) => {
      e.preventDefault()
      setCurrentPage(1)
      setFilter(searchTerm)
   }

   const handleStatusChange = async (userId, newStatus) => {
      try {
         setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
      } catch (error) {
         await dispatch(showModalThunk({ type: 'alert', placeholder: '사용자 상태 변경 실패' })).unwrap()
      }
   }

   const onClickDetailModal = async (id) => {
      await dispatch(showModalThunk({ type: 'detail', placeholder: id }))
   }

   const onKeydownKey = (e) => {
      if (e.key === 'Enter') {
         handleSearch(e)
         return
      }
   }

   return (
      <>
         <>
            <div className="admin-main-content">
               <div className="container py-5">
                  <div className="page-title">
                     <h2 className="mb-4">사용자 관리</h2>
                  </div>
                  {/* 검색 */}
                  <div className="admin-color card shadow-sm mb-4">
                     <div className="card-body">
                        <form onSubmit={handleSearch}>
                           <div className="row g-2">
                              <div className="col-md-6">
                                 <input type="text" className="admin-color-second form-control" placeholder="이름, 이메일, 전화번호로 검색" value={searchTerm} onKeyDown={onKeydownKey} onChange={(e) => setSearchTerm(e.target.value)} />
                              </div>
                              <div className="col-md-2">
                                 <button type="submit" className="btn btn-primary w-100">
                                    검색
                                 </button>
                              </div>
                           </div>
                        </form>
                     </div>
                  </div>
                  {/* 사용자 목록 */}
                  <div className="admin-color card shadow-sm">
                     <div className="table-responsive">
                        <table className="admin-color-table table table-hover mb-0">
                           <thead>
                              <tr>
                                 <th>ID</th>
                                 <th>이름</th>
                                 <th>이메일</th>
                                 <th>전화번호</th>
                                 <th>가입일</th>
                                 <th>주문 수</th>
                                 <th>역할</th>
                                 <th>보기</th>
                              </tr>
                           </thead>
                           <tbody>
                              {users?.map((user) => (
                                 <tr className="admin-table-pointer" key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.createdAt}</td>
                                    <td>{user.orderCount}</td>
                                    <td>
                                       <span className={`badge bg-${user.status === 'user' ? 'success' : 'danger'}`}>{user.status === 'user' ? '사용자' : '통신사'}</span>
                                    </td>
                                    <td>
                                       <div className="dropdown">
                                          <button onClick={() => onClickDetailModal(user.id)} className="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                                             상세보기
                                          </button>
                                          <ul className="dropdown-menu">
                                             <li>
                                                <button className="dropdown-item" onClick={() => handleStatusChange(user.id, 'active')}>
                                                   계정 활성화
                                                </button>
                                             </li>
                                             <li>
                                                <button className="dropdown-item" onClick={() => handleStatusChange(user.id, 'inactive')}>
                                                   계정 휴면
                                                </button>
                                             </li>
                                             <li>
                                                <button className="dropdown-item text-danger" onClick={() => handleStatusChange(user.id, 'suspended')}>
                                                   계정 정지
                                                </button>
                                             </li>
                                          </ul>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                  {/* 페이지네이션 */}
                  <div className="d-flex justify-content-center mt-4">
                     <nav>
                        <ul className="admin-color-list pagination">
                           <li style={{ cursor: 'pointer' }} className={` page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button className="admin-color page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                                 이전
                              </button>
                           </li>
                           {[...Array(totalPages)].map((_, i) => (
                              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                 <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                 </button>
                              </li>
                           ))}
                           <li style={{ cursor: 'pointer' }} className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button className="admin-color page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                                 다음
                              </button>
                           </li>
                        </ul>
                     </nav>
                  </div>
               </div>
            </div>
         </>
         {modal.type === 'detail' && <ModalAdminUserDetailComponent />}
      </>
   )
}

export default UserManagement
