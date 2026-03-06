import React from 'react';
import { NavLink } from 'react-router-dom';

const buildLinkPath = (basePath, to) => {
  if (!to) return basePath;
  return `${basePath}/${to}`;
};

function EventNavbar({ basePath, links }) {
  if (!links || links.length === 0) return null;

  return (
    <nav className="event-navbar" aria-label="Event navigation">
      {links.map((link) => (
        <NavLink
          key={`${basePath}-${link.to || 'index'}`}
          to={buildLinkPath(basePath, link.to)}
          end={link.end}
          className={({ isActive }) =>
            isActive ? 'event-navbar-link active' : 'event-navbar-link'
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default EventNavbar;
