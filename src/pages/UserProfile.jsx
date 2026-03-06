import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getRegistrationCountForUser } from '../utils/registrations';
import './styles/Porfile.css';
import female from '../assets/Female.jpg';
import male from '../assets/Male.jpg';

const UserProfile = ({ title }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regCount, setRegCount] = useState(0);

  useEffect(() => {
    document.title = title || 'User Profile';
  }, [title]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/api/user/profile/${id}`);
        if (mounted) setProfile(data.user || data);
      } catch (err) {
        console.error('UserProfile fetch error:', err);
        if (mounted) setError(err?.response?.data?.message || err?.message || 'Failed to load user profile');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();
    return () => { mounted = false; };
  }, [id]);

  // Fetch registration count for this user
  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      if (!profile) return;
      const uid = profile._id || profile.id || profile.user_id || profile.userId;
      if (!uid) return;
      try {
        const count = await getRegistrationCountForUser(uid);
        if (mounted) setRegCount(count);
      } catch (err) {
        console.error('Error fetching registration count', err);
      }
    };
    fetchCount();
    return () => { mounted = false; };
  }, [profile]);

  const avatarSrc =
    profile?.avatar ||
    (profile?.gender === 'Male' ? male : profile?.gender === 'Female' ? female : male);

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-view" id="profile">
          <div className="profile-container">
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>Loading user profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-view" id="profile">
          <div className="profile-container">
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
              <p className="error">{error}</p>
              <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginTop: 12 }}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-view" id="profile">
        <div className="profile-container">
          <aside className="profile-left">
            <div className="avatar-wrap">
              <img src={avatarSrc} alt={profile?.name || 'avatar'} />
            </div>
            <h3 className="name">{profile?.name ?? profile?.fullName ?? '—'}</h3>
            {profile?.username && <p className="handle">@{profile.username}</p>}
            {profile?.role && <p className="role">{profile.role.toUpperCase()}</p>}
            <div className="meta">
              <div><strong>{profile?.eventsCount ?? 0}</strong><span>Events</span></div>
              <div><strong>{regCount ?? 0}</strong><span>Registrations</span></div>
            </div>
            <div className="left-actions">
              <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
            </div>
          </aside>

          <main className="profile-right">
            <div className="card">
              <h4>About</h4>
              <p className="bio">{profile?.bio || 'No bio yet.'}</p>
              <div className="details">
                <div><strong>Email</strong><div>{profile?.email || '—'}</div></div>
                <div><strong>Location</strong><div>{profile?.location || '—'}</div></div>
                <div><strong>Context</strong><div>{profile?.context || '—'}</div></div>
                <div><strong>Role</strong><div>{profile?.role || '—'}</div></div>
                <div><strong>Joined</strong><div>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</div></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
