import { useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { deleteNotification } from '@features/notification/notificationSlice'
import { faBell } from '@fortawesome/free-solid-svg-icons'

const NotificationDropdown = ({ show, onClose, notifications, unreadCount, onToggle }) => {
   const bellRef = useRef(null)
   const dispatch = useDispatch()

   // 외부 클릭 시 드롭다운 닫기
   useEffect(() => {
      if (!show) return
      const handleClick = (e) => {
         if (bellRef.current && !bellRef.current.contains(e.target)) {
            onClose()
         }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
   }, [show, onClose])

   const handleDelete = (id) => {
      dispatch(deleteNotification(id))
   }

   return (
      <div ref={bellRef} className="position-relative ms-2">
         <button type="button" className="btn btn-link p-0 border-0 shadow-none" style={{ boxShadow: 'none' }} title="알림" onClick={onToggle}>
            <FontAwesomeIcon icon={faBell} size="lg" />
            {unreadCount > 0 && (
               <span style={{ position: 'absolute', top: -6, right: -6 }} className="badge bg-danger rounded-pill">
                  {unreadCount}
               </span>
            )}
         </button>
         {/* 알림 드롭다운 */}
         {show && (
            <div className="card shadow position-absolute end-0 mt-2" style={{ minWidth: 280, zIndex: 1000 }}>
               <div className="card-body p-2">
                  <div className="fw-bold mb-2">알림</div>
                  {notifications.length === 0 && <div className="text-muted small">알림이 없습니다.</div>}
                  {notifications.slice(0, 7).map((n) => (
                     <div key={n.id} className={`d-flex align-items-start mb-2 ${!n.isRead ? 'bg-light' : ''}`} style={{ borderRadius: 6, padding: '6px 8px' }}>
                        <span className="me-2 mt-1">
                           <FontAwesomeIcon icon={faBell} size="sm" className={n.isRead ? 'text-secondary' : 'text-primary'} />
                        </span>
                        <div style={{ flex: 1 }}>
                           <div className="small fw-semibold text-truncate" title={n.title}>
                              {n.title}
                           </div>
                           <div className="small text-muted text-truncate" title={n.message}>
                              {n.message}
                           </div>
                           <div className="small text-secondary mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <button type="button" className="btn btn-link btn-sm p-0 ms-2 text-danger" title="알림 삭제" onClick={() => handleDelete(n.id)} style={{ lineHeight: 1 }}>
                           <FontAwesomeIcon icon={faTimes} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   )
}
export default NotificationDropdown
