import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import StudentAsider from '../../component/StudentAsider.jsx';
import './AdminLayout.css';
import Dashboardheader from '../../component/Dashboardheader.jsx';
import useAdminUI from '../useAdminUI.js';
import EventNavbar from '../../component/EventNavbar.jsx';

export const  StudentLayout = () => {
 const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('dashboard-sidebar-collapsed') === 'true');
  const [currentView, setCurrentView] = useState('overview');
  const [themeState, setThemeState] = useState(() => localStorage.getItem('dashboard-theme') || 'dark');
  const location = useLocation();
 
  // refs for key DOM nodes (passed to child components)
  const sidebarRef = useRef(null);
  const sidebarOverlayRef = useRef(null);
  const userMenuRef = useRef(null);
  const userMenuTriggerRef = useRef(null);
  const themeToggleRef = useRef(null);
  const dashboardTitleRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchCloseRef = useRef(null);
  const mobileSearchBtnRef = useRef(null);
  const progressChartRef = useRef(null);
  const categoryChartRef = useRef(null);

  // initialize dashboard UI (moved to a hook for readability)
  useAdminUI(
    {
      sidebarRef,
      sidebarOverlayRef,
      userMenuRef,
      userMenuTriggerRef,
      themeToggleRef,
      dashboardTitleRef,
      searchContainerRef,
      searchInputRef,
      searchCloseRef,
      mobileSearchBtnRef,
      progressChartRef,
      categoryChartRef,
    },
    { setSidebarCollapsed, setThemeState, setCurrentView, themeState }
  );

  return (
   <>
    <div className="dashboard-container ">
           <StudentAsider sidebarRef={sidebarRef} />
           {/* overlay for mobile sidebar */}
           <div id="dashboardSidebarOverlay" ref={sidebarOverlayRef} className="dashboard-sidebar-overlay" />
           <main className="dashboard-main">
             <Dashboardheader
               dashboardTitleRef={dashboardTitleRef}
               userMenuRef={userMenuRef}
               userMenuTriggerRef={userMenuTriggerRef}
               themeToggleRef={themeToggleRef}
               searchContainerRef={searchContainerRef}
               searchInputRef={searchInputRef}
               searchCloseRef={searchCloseRef}
               mobileSearchBtnRef={mobileSearchBtnRef}
             />
             <div className="dashboard-content">
              <Outlet />
             </div>
           </main>
         </div>

   </>
  );
};
