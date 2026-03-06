import React from 'react'
import { NavLink } from 'react-router-dom'

function Aside({ sidebarRef }) {
  return (
   <>
    <aside className="dashboard-sidebar" id="dashboardSidebar" ref={sidebarRef}>
        <div className="dashboard-brand">
          <button className="dashboard-sidebar-toggle">
            <span className="material-symbols-rounded">menu</span>
          </button>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'logo active' : 'logo'}>FestMate</NavLink>
        </div>
        <nav className="dashboard-nav">
          <div className="dashboard-nav-section">
            <NavLink to="/admin" end className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="overview">
              <span className="nav-icon material-symbols-rounded">dashboard</span>
              <span className="nav-label">Overview</span>
            </NavLink>
            <NavLink to="/admin/events" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="events">
              <span className="nav-icon material-symbols-rounded">event</span>
              <span className="nav-label">Events</span>
            </NavLink>
   {/* <NavLink to="/admin/projects" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="projects">
              <span className="nav-icon material-symbols-rounded">folder</span>
              <span className="nav-label">Projects</span>
            </NavLink>          */}
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="users">
              <span className="nav-icon material-symbols-rounded">people</span>
              <span className="nav-label">Users</span>
            </NavLink>
            <NavLink to="/admin/approvals" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="approvals">
              <span className="nav-icon material-symbols-rounded">how_to_reg</span>
              <span className="nav-label">Approvals</span>
            </NavLink>
            <NavLink to="/admin/reports" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="reports">
              <span className="nav-icon material-symbols-rounded">bar_chart</span>
              <span className="nav-label">Reports</span>
            </NavLink>
            <NavLink to="/admin/calendar" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="calendar">
              <span className="nav-icon material-symbols-rounded">calendar_month</span>
              <span className="nav-label">Calendar</span>
            </NavLink>
            <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="settings">
              <span className="nav-icon material-symbols-rounded">settings</span>
              <span className="nav-label">Settings</span>
            </NavLink>
          </div>
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'btn btn-secondary sidebar-back-button active' : 'btn btn-secondary sidebar-back-button'}>
            <span className="material-symbols-rounded">home</span>
            <span className="btn-label">Back to Site</span>
          </NavLink>
        </div>
      </aside>
   </>
  )
}

export default Aside