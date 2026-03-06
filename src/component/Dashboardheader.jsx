import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'
import female from'../assets/Female.jpg';
import male from'../assets/Male.jpg';
function Dashboardheader({
  dashboardTitleRef,
  userMenuRef,
  userMenuTriggerRef,
  themeToggleRef,
  searchContainerRef,
  searchInputRef,
  searchCloseRef,
  mobileSearchBtnRef,
}) {
  // const[user,setuser]=useAuth();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  // console.log(user);
    // console.log(dashboardTitleRef);
  const handleSignOut = (e) => {
    e.preventDefault()
    logout()
    navigate('/')
  }
  
 const avatarSrc = user?.avatar || (user?.gender === 'Male' ? male : user?.gender === 'Female' ? female : '/src/assets/avatar-placeholder.png');

  return (
    <>
  
         <header className="dashboard-header">
          {/* <!-- Header Content --> */}
          <div className="dashboard-header-content">
            <button className="dashboard-sidebar-toggle">
              <span className="material-symbols-rounded">menu</span>
            </button>
            <h1 className="dashboard-header-title" id="dashboardTitle" ref={dashboardTitleRef}>Overview</h1>
          </div>
          {/* <!-- Search Container --> */}
          <div className="search-container" id="searchContainer" ref={searchContainerRef}>
            <span className="search-icon material-symbols-rounded">search</span>
            <input type="search" className="search-input form-input" placeholder="Search projects, tasks, reports..." id="searchInput" ref={searchInputRef} />
            <button className="search-close btn" id="searchClose" ref={searchCloseRef}>
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>
          {/* <!-- Header Actions --> */}
          <div className="dashboard-header-actions">
            {/* <!-- Mobile Search Button --> */}
            <button className="mobile-search-btn btn btn-ghost" id="mobileSearchBtn" ref={mobileSearchBtnRef}>
              <span className="material-symbols-rounded">search</span>
            </button>
            {/* <!-- Notification Button --> */}
            <div className="notification-button">
              <span className="material-symbols-rounded">notifications</span>
              <div className="notification-badge">3</div>
            </div>
            {/* <!-- User Profile --> */}
            <div className="user-menu" id="userMenu" ref={userMenuRef}>
              <div className="user-menu-trigger" id="user-menu-trigger" ref={userMenuTriggerRef}>
                <div className="user-avatar-small">
                  <img src={avatarSrc} alt="User Avatar" />
                </div>
              </div>
              <div className="user-menu-dropdown">
                <NavLink to="profile" className="user-menu-item">
                  <span className="icon material-symbols-rounded">person</span>
                  <span>Profile</span>
                </NavLink>
                {/* <!-- Theme Toggle inside dropdown --> */}
                <div className="user-menu-item theme-item">
                  <span className="icon material-symbols-rounded">palette</span>
                  <div className="theme-toggle" id="theme-toggle" ref={themeToggleRef}>
                    <div className="theme-option active" data-theme="light">Light</div>
                    <div className="theme-option" data-theme="dark">Dark</div>
                  </div>
                </div>
                <a className="user-menu-item" onClick={handleSignOut}>
                  <span className="icon material-symbols-rounded">logout</span>
                  <span>Sign Out</span>
                </a>
              </div>
            </div>
          </div>
        </header>
    </>
  )
}

export default Dashboardheader