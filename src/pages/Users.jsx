import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { get, remove as del } from '../utils/api';
import './styles/Users.css';

/*
  Backend: GET /api/user/listofUser  → all users
           DELETE /api/user/:id       → delete a user

  Router title props:
    "All Users"     → /admin/users         → show all
    "Students"      → /admin/users/students     → filter role=Student
    "Coordinators"  → /admin/users/coordinators → filter role=Coordinator
*/

const ROLE_BADGE_BG = {
  Admin: '#e0f7f4',
  Coordinator: '#e8eafd',
  Student: '#fef3cd',
};
const ROLE_BADGE_TEXT = {
  Admin: '#0d9488',
  Coordinator: '#6366f1',
  Student: '#d97706',
};
const TITLE_TO_ROLE = {
  Students: 'Student',
  Coordinators: 'Coordinator',
};

const Users = ({ title = 'All Users' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleFilter = TITLE_TO_ROLE[title] || null;
  const { pathname } = useLocation();
  const basePath = pathname.startsWith('/admin') ? '/admin' : pathname.startsWith('/coordinator') ? '/coordinator' : '/student';

  useEffect(() => { document.title = title; }, [title]);

  /* ── fetch users ── */
  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await get('/api/user/listofUser');
        const all = Array.isArray(data) ? data : data.users || [];
        if (active) {
          setUsers(
            roleFilter
              ? all.filter((u) => (u.role || u.user_role) === roleFilter)
              : all,
          );
        }
      } catch (err) {
        if (!active) return;
        const code = err.response?.status;
        if (code === 401) setError('Unauthorized — please log in again');
        else if (code === 403) setError('Forbidden — admin access required');
        else setError(err.response?.data?.message || err.message || 'Failed to load users');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [roleFilter]);

  /* ── delete user ── */
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await del(`/api/user/${userId}`);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete user');
    }
  };

  /* ── render ── */
  return (
    <div className="dashboard-content">
      <div className="dashboard-view active" id="users">
        {loading && (
          <div className="users-loading">
            <span className="material-symbols-rounded spin">progress_activity</span>
            Loading users…
          </div>
        )}

        {error && <div className="users-error">{error}</div>}

        {!loading && !error && (
          <div className="users-card-grid">
            {users.length === 0 && (
              <div className="users-empty">No users found.</div>
            )}

            {users.map((u) => {
              const role = u.role || u.user_role || 'User';
              const name = u.name || u.username || 'Unknown';
              const avatar =
                u.profile_image ||
                u.avatar ||
                `https://i.pravatar.cc/120?u=${u.email || u._id || u.id}`;
              const designation = u.designation || u.title || u.bio || '';

              return (
                <div className="user-card" key={u._id || u.id || u.username}>
                  <div className="user-card__top">
                    <div className="user-card__avatar-ring">
                      <img src={avatar} alt={name} className="user-card__avatar" />
                    </div>
                    <h4 className="user-card__name">{name}</h4>
                    {designation && (
                      <p className="user-card__designation">{designation}</p>
                    )}
                    <span
                      className="user-card__badge"
                      style={{
                        background: ROLE_BADGE_BG[role] || '#f0f0f0',
                        color: ROLE_BADGE_TEXT[role] || '#555',
                      }}
                    >
                      {role}
                    </span>
                  </div>

                  <div className="user-card__actions">
                    <Link to={`${basePath}/user/${u._id || u.id}`} className="user-card__action">
                      <span className="material-symbols-rounded">person</span>
                      Profile
                    </Link>
                   
                    <button
                      className="user-card__action user-card__action--delete"
                      onClick={() => handleDelete(u._id || u.id)}
                    >
                      <span className="material-symbols-rounded">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
