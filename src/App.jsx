import React, { useEffect, useState, useRef } from 'react'
import './App.css'
import Aside from './component/Aside'
import Dashboard from './pages/Dashboard'
import Dashboardheader from './component/Dashboardheader'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('dashboard-sidebar-collapsed') === 'true');
  const [currentView, setCurrentView] = useState('overview');
  const [themeState, setThemeState] = useState(() => localStorage.getItem('dashboard-theme') || 'light');
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

  useEffect(() => {
    const dashboardSidebar = sidebarRef.current || document.getElementById('dashboardSidebar');
    const userMenu = userMenuRef.current || document.getElementById('userMenu');
    const userMenuTrigger = userMenuTriggerRef.current || document.getElementById('user-menu-trigger');
    const themeToggle = themeToggleRef.current || document.getElementById('theme-toggle');
    const dashboardViews = (document && document.querySelectorAll('.dashboard-view')) || [];
    const dashboardNavItems = (dashboardSidebar && dashboardSidebar.querySelectorAll('.dashboard-nav-item')) || document.querySelectorAll('.dashboard-nav-item');
    const dashboardTitle = dashboardTitleRef.current || document.getElementById('dashboardTitle');
    const dashboardSidebarOverlay = sidebarOverlayRef.current || document.getElementById('dashboardSidebarOverlay');
    const searchContainer = searchContainerRef.current || document.getElementById('searchContainer');
    const searchInput = searchInputRef.current || document.getElementById('searchInput');
    const searchClose = searchCloseRef.current || document.getElementById('searchClose');
    const mobileSearchBtn = mobileSearchBtnRef.current || document.getElementById('mobileSearchBtn');

    function updateThemeToggleUI(theme) {
      if (!themeToggle) return;
      themeToggle.querySelectorAll('.theme-option').forEach((option) => {
        option.classList.toggle('active', option.getAttribute('data-theme') === theme);
      });
    }

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('dashboard-theme', theme);
      setThemeState(theme);
      updateThemeToggleUI(theme);
    }

    function initThemeToggle() {
      if (!themeToggle) return [];
      const handlers = [];
      themeToggle.querySelectorAll('.theme-option').forEach((option) => {
        const fn = (e) => { e.stopPropagation(); setTheme(option.getAttribute('data-theme')); };
        option.addEventListener('click', fn);
        handlers.push({ el: option, fn });
      });
      return handlers;
    }

    function toggleSidebar() {
      if (!dashboardSidebar) return;
      const isMobile = window.innerWidth <= 1024;
      if (isMobile) {
        const isOpen = dashboardSidebar.classList.contains('collapsed');
        const newVal = !isOpen;
        dashboardSidebar.classList.toggle('collapsed', newVal);
        dashboardSidebarOverlay?.classList.toggle('active', newVal);
        setSidebarCollapsed(newVal);
        localStorage.setItem('dashboard-sidebar-collapsed', newVal.toString());
      } else {
        const newVal = !dashboardSidebar.classList.contains('collapsed');
        dashboardSidebar.classList.toggle('collapsed', newVal);
        setSidebarCollapsed(newVal);
        localStorage.setItem('dashboard-sidebar-collapsed', newVal.toString());
      }
    }

    function closeSidebar() {
      if (window.innerWidth <= 1024 && dashboardSidebar) {
        dashboardSidebar.classList.remove('collapsed');
        dashboardSidebarOverlay?.classList.remove('active');
      }
    }

    function initNavigation() {
      const handlers = [];
      dashboardNavItems.forEach((item) => {
        const fn = (e) => { e.preventDefault(); const viewId = item.getAttribute('data-view'); if (viewId) switchView(viewId); };
        item.addEventListener('click', fn);
        handlers.push({ item, fn });
      });
      return handlers;
    }

    function switchView(viewId) {
      dashboardNavItems.forEach((item) => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewId);
      });
      dashboardViews.forEach((view) => view.classList.remove('active'));
      const targetView = document.getElementById(viewId);
      if (targetView) {
        targetView.classList.add('active');
        setCurrentView(viewId);
        updatePageTitle(viewId);
      }
      if (window.innerWidth <= 1024) closeSidebar();
    }

    function updatePageTitle(viewId) {
      const titles = { overview: 'Overview', projects: 'Projects', tasks: 'Tasks', reports: 'Reports', settings: 'Settings' };
      if (dashboardTitle) dashboardTitle.textContent = titles[viewId] || 'Dashboard';
    }

    function initUserMenu() {
      if (!userMenuTrigger || !userMenu) return [];
      const onTrigger = (e) => { e.stopPropagation(); userMenu.classList.toggle('active'); };
      const onDocClick = (e) => { if (!userMenu.contains(e.target)) userMenu.classList.remove('active'); };
      const onKeydown = (e) => { if (e.key === 'Escape' && userMenu.classList.contains('active')) userMenu.classList.remove('active'); };
      userMenuTrigger.addEventListener('click', onTrigger);
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', onKeydown);
      return [{ el: userMenuTrigger, fn: onTrigger }, { el: document, fn: onDocClick, type: 'click' }, { el: document, fn: onKeydown, type: 'keydown' }];
    }

    function initSearch() {
      const onMobile = () => { searchContainer?.classList.add('mobile-active'); searchInput?.focus(); };
      const onClose = () => { searchContainer?.classList.remove('mobile-active'); if (searchInput) searchInput.value = ''; };
      mobileSearchBtn?.addEventListener('click', onMobile);
      searchClose?.addEventListener('click', onClose);
      return [{ el: mobileSearchBtn, fn: onMobile }, { el: searchClose, fn: onClose }];
    }

    // Charts initialization with dynamic import and CDN fallback
    const charts = [];
    async function initCharts() {
      try {
        const mod = await import('chart.js');
        const Chart = mod.Chart || mod.default?.Chart || mod.default;
        const registerables = mod.registerables || [];
        if (Chart && registerables.length) Chart.register(...registerables);
        const progressCtx = progressChartRef.current || document.getElementById('progressChart');
        if (progressCtx && Chart) charts.push(new Chart(progressCtx, {
          type: 'line', data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets:[{ label:'Project Progress', data:[20,35,45,60,70,85], borderColor:'#8b5cf6', backgroundColor:'rgba(139,92,246,0.1)', borderWidth:2, fill:true, tension:0.4 }] },
          options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, max:100, ticks:{ callback: (value) => value + '%' } } } }
        }));
        const categoryCtx = categoryChartRef.current || document.getElementById('categoryChart');
        if (categoryCtx && Chart) charts.push(new Chart(categoryCtx, {
          type: 'doughnut', data: { labels:['Frontend','Backend','Mobile','DevOps'], datasets:[{ data:[35,25,20,20], backgroundColor:['#8b5cf6','#10b981','#f59e0b','#ef4444'], borderWidth:0 }] },
          options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ padding:20, usePointStyle:true } } } }
        }));
      } catch (err) {
        try {
          const Chart = window.Chart;
          if (!Chart) return;
          const progressCtx = progressChartRef.current || document.getElementById('progressChart');
          if (progressCtx) charts.push(new Chart(progressCtx, {
            type: 'line', data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets:[{ label:'Project Progress', data:[20,35,45,60,70,85], borderColor:'#8b5cf6', backgroundColor:'rgba(139,92,246,0.1)', borderWidth:2, fill:true, tension:0.4 }] },
            options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, max:100, ticks:{ callback: (value) => value + '%' } } } }
          }));
          const categoryCtx = categoryChartRef.current || document.getElementById('categoryChart');
          if (categoryCtx) charts.push(new Chart(categoryCtx, {
            type: 'doughnut', data: { labels:['Frontend','Backend','Mobile','DevOps'], datasets:[{ data:[35,25,20,20], backgroundColor:['#8b5cf6','#10b981','#f59e0b','#ef4444'], borderWidth:0 }] },
            options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ padding:20, usePointStyle:true } } } }
          }));
        } catch (err2) {
          // no Chart available
        }
      }
    }

    // Initialize UI
    updateThemeToggleUI(themeState);
    const themeHandlers = initThemeToggle();
    // attach toggles (buttons may be in header or sidebar)
    const toggles = Array.from(document.querySelectorAll('.dashboard-sidebar-toggle'));
    toggles.forEach((t) => t.addEventListener('click', toggleSidebar));
    dashboardSidebarOverlay?.addEventListener('click', closeSidebar);
    const navHandlers = initNavigation();
    const userHandlers = initUserMenu();
    const searchHandlers = initSearch();
    initCharts();

    return () => {
      // remove listeners
      toggles.forEach((t) => t.removeEventListener('click', toggleSidebar));
      dashboardSidebarOverlay?.removeEventListener('click', closeSidebar);
      navHandlers.forEach(({ item, fn }) => item.removeEventListener('click', fn));
      userHandlers.forEach((h) => {
        if (h.el === document) {
          document.removeEventListener(h.type || 'click', h.fn);
        } else h.el.removeEventListener('click', h.fn);
      });
      searchHandlers.forEach((h) => h.el?.removeEventListener('click', h.fn));
      themeHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
      charts.forEach((c) => { try { c.destroy(); } catch (e) {} });
    };
  }, [themeState]);

  return (
    <>
      <div className="dashboard-container ">
        <Aside sidebarRef={sidebarRef} />
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
            <Dashboard progressRef={progressChartRef} categoryRef={categoryChartRef} />
          </div>
        </main>
      </div>
    </>
  )
}

export default App
