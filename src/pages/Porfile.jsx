import React, { useEffect, useState } from 'react'
import Dashboardheader from '../component/Dashboardheader';
import { useAuth } from '../utils/AuthProvider';
import api from '../utils/api';
import { getRegistrationCountForUser } from '../utils/registrations';
import { useToast } from '../context/ToastProvider';
import './styles/Porfile.css';
import female from'../assets/Female.jpg';
import male from'../assets/Male.jpg';

const Profile = ({ title }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [regCount, setRegCount] = useState(0);

  useEffect(() => { document.title = title; }, [title]);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        if (auth?.user) {
          if (mounted) setProfile(auth.user);
        } else {
          const data = await api.get('/api/user/profile');
          if (mounted) setProfile(data.user || data);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (mounted) setError(err?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { mounted = false; };
  }, [auth?.user]);

  // fetch registrations count for the current profile
  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      if (!profile) return;
      const id = profile._id || profile.id || profile.user_id || profile.userId;
      if (!id) return;
      try {
        const count = await getRegistrationCountForUser(id);
        if (mounted) setRegCount(count);
      } catch (err) {
        console.error('Error fetching registration count', err);
      }
    };
    fetchCount();
    return () => { mounted = false; };
  }, [profile]);

  const startEdit = () => {
    setForm({
      name: profile?.name || profile?.fullName || '',
      email: profile?.email || '',
      username: profile?.username || '',
      gender: profile?.gender || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      avatar: profile?.avatar || '',
    });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      addToast({ message: 'Name and email are required', type: 'danger' });
      return;
    }
    try {
      setSaving(true);
      const res = await api.put('/api/user/profile', form);
      const updated = res.user || res;
      setProfile(updated);
      if (auth?.login) auth.login(updated);
      addToast({ message: 'Profile saved', type: 'success' });
      setEditing(false);
    } catch (err) {
      console.error(err);
      addToast({ message: err?.message || 'Save failed', type: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = profile?.avatar || (profile?.gender === 'Male' ? male : profile?.gender === 'Female' ? female : '/src/assets/avatar-placeholder.png');
  console.log(profile);

  return (
    <div className="dashboard-content">
      <div className="dashboard-view" id="profile">
        {/* <Dashboardheader /> */}
        <div className="profile-container">
          <aside className="profile-left">
            <div className="avatar-wrap">
              <img src={avatarSrc} alt={profile?.name || 'avatar'} />
            </div>
            <h3 className="name">{loading ? 'Loading…' : (profile?.name ?? profile?.fullName ?? '—')}</h3>
            
            {profile?.role && <p className="role">{profile.role.toUpperCase()}</p>}
            <div className="meta">
              <div><strong>{profile?.eventsCount ?? 0}</strong><span>Events</span></div>
              <div><strong>{regCount ?? 0}</strong><span>Registrations</span></div>
            </div>
            <div className="left-actions">
              <button className="btn btn-primary">Follow</button>
              <button className="btn btn-outline" onClick={startEdit}>Edit profile</button>
            </div>
          </aside>

          <main className="profile-right">
            <div className="card">
              <h4>About</h4>
              {!editing ? (
                <>
                  <p className="bio">{profile?.bio || 'No bio yet.'}</p>
                  <div className="details">
                    <div><strong>Email</strong><div>{profile?.email || '—'}</div></div>
                    <div><strong>Location</strong><div>{profile?.location || '—'}</div></div>
                    <div><strong>Context</strong><div>{profile?.context || '—'}</div></div>
                    <div><strong>Role</strong><div>{profile?.role || '—'}</div></div>
                    <div><strong>Joined</strong><div>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</div></div>
                  </div>
                </>
              ) : (
                <form className="edit-form" onSubmit={handleSave}>
                  <div className="row">
                    <label>
                      Name
                      <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    </label>
                    <label>
                      Username
                      <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
                    </label>
                  </div>

                  <div className="row">
                    <label>
                      Gender
                      <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                  </div>

                  <div className="row">
                    <label>
                      Email
                      <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    </label>
                    <label>
                      Location
                      <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                    </label>
                  </div>

                  <label>
                    Avatar URL
                    <input value={form.avatar} onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))} />
                  </label>

                  <label>
                    Bio
                    <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
                  </label>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
                  </div>
                </form>
              )}

              {error && <p className="error">{error}</p>}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;
