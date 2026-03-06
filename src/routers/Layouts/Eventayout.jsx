import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthProvider';

const navBar = {
  display: 'flex',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
};

const link = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',
};

const activeLink = {
  ...link,
  color: 'var(--color-primary)',
  background: 'var(--color-primary-100)',
};

export const EventLayout = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const { pathname } = useLocation();
  const base = pathname.startsWith('/admin') ? '/admin' : pathname.startsWith('/coordinator') ? '/coordinator' : '/student';

  return (
    <>
      {isAdmin && (
        <div style={navBar}>
          <NavLink
            to={`${base}/events/myevents`}
            style={({ isActive }) => isActive ? activeLink : link}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>person</span>
            My Events
          </NavLink>
          <NavLink
            to={`${base}/events/create`}
            style={({ isActive }) => isActive ? activeLink : link}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>event</span>
            Create Event
          </NavLink>
        </div>
      )}
      <Outlet />
    </>
  );
};
