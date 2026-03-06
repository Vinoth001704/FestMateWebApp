import React from 'react'
import { NavLink } from 'react-router-dom'

function CoordinatorAsider({ sidebarRef }) {
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
            <NavLink to="/coordinator" end className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="overview">
              <span className="nav-icon material-symbols-rounded">dashboard</span>
              <span className="nav-label">Overview</span>
            </NavLink>
            <NavLink to="/coordinator/events" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="events">
              <span className="nav-icon material-symbols-rounded">event</span>
              <span className="nav-label">Events</span>
            </NavLink>
            <NavLink to="/coordinator/tasks" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="tasks">
              <span className="nav-icon material-symbols-rounded">checklist</span>
              <span className="nav-label">Tasks</span>
            </NavLink>
            <NavLink to="/coordinator/calendar" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="calendar">
              <span className="nav-icon material-symbols-rounded">calendar_month</span>
              <span className="nav-label">Calendar</span>
            </NavLink>
            <NavLink to="/coordinator/settings" className={({ isActive }) => isActive ? 'dashboard-nav-item active' : 'dashboard-nav-item'} data-view="settings">
              <span className="nav-icon material-symbols-rounded">settings</span>
              <span className="nav-label">Settings</span>
            </NavLink>
          </div>
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/coordinator" end className={({ isActive }) => isActive ? 'btn btn-secondary sidebar-back-button active' : 'btn btn-secondary sidebar-back-button'}>
            <span className="material-symbols-rounded">home</span>
            <span className="btn-label">Back to Site</span>
          </NavLink>
        </div>
      </aside>
   </>
  )
}

export default CoordinatorAsider;