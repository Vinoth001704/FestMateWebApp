import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useLocation, Link } from 'react-router-dom'
import './styles/EventDetails.css'
import EventRegisterWizard from './EventRegisterWizard'
import Male from '../assets/Male.jpg'
import Female from '../assets/Female.jpg'
import { get } from '../utils/api'

const EventDetailsPage = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
 const [isImageOpen, setIsImageOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const { pathname } = useLocation();
  const basePath = pathname.startsWith('/admin') ? '/admin' : pathname.startsWith('/coordinator') ? '/coordinator' : '/student';
  const creatorId = eventData?.creator_by || eventData?.created_by;

  useEffect(() => {
    document.title = eventData?.event_Name?`Event Details - ${eventData.event_Name}` : 'Event Details';
  }, [eventData]);
    // console.log(eventData);

  useEffect(() => {
    if (!id) {
      setError('Missing event id in URL.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadEvent = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await get(`/api/event/single/${id}`, { signal: controller.signal });
        setEventData(data.event);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.response?.data?.message || err.message || 'Failed to load event details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
    return () => controller.abort();
  }, [id]);

  console.log(eventData?.created_by);
  // Fetch creator profile when eventData is loaded and has a creator id
  useEffect(() => {
    const creatorId = eventData?.creator_by || eventData?.created_by;
    if (!creatorId) return;

    const controller = new AbortController();
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError('');
        const data = await get(`/api/user/profile/${creatorId}`, { signal: controller.signal });
        setCreatorProfile(data?.user || data || null);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') setProfileError(err.message || 'Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
    return () => controller.abort();
  }, [eventData]);
  if (isLoading) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-view" id="event-details">
          <div className="empty-state">
            <div className="empty-state-icon">
              <span className="material-symbols-rounded">hourglass_empty</span>
            </div>
            <h3 className="empty-state-title">Loading...</h3>
            <p className="empty-state-description">Fetching event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-view" id="event-details">
          <div className="empty-state">
            <div className="empty-state-icon">
              <span className="material-symbols-rounded">error</span>
            </div>
            <h3 className="empty-state-title">Error</h3>
            <p className="empty-state-description">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-view" id="event-details">
          <div className="empty-state">
            <div className="empty-state-icon">
              <span className="material-symbols-rounded">event_busy</span>
            </div>
            <h3 className="empty-state-title">No Event Found</h3>
            <p className="empty-state-description">The requested event could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-content">
        <div className="dashboard-view" id="event-details">  
         <div className="event-page">  
          {/* User Header */}
          <Link to={creatorId ? `${basePath}/user/${creatorId}` : '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="user-header pb-2" style={{ cursor: 'pointer' }}>
              <div className="user-avatar">
                <img
                  src={creatorProfile?.avatar || (creatorProfile?.gender === 'Female' ? Female : Male)}
                  alt={creatorProfile?.name || 'avatar'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <div className="user-info">
                <h3>{creatorProfile?.name || eventData?.creator_name || 'Loading...'} </h3>
                <span>{creatorProfile?.role || eventData?.creator_role || ''}</span>
              </div>
            </div>
          </Link>
    
          {/* Event Card */}
          <div className="event-card">
            {/* Left – Image & Actions */}
            <div className="event-left">
              <img
                src={'https://images.unsplash.com/photo-1770885653473-ca48b4d69173?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                alt="event"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsImageOpen(true)}
              />
              <div className="event-buttons">
                <button className="btn btn-primary" onClick={() => setIsRegisterOpen(true)}>Register Now</button>
                <button className="btn btn-outline-warning">Feedback</button>
              </div>
            </div>
    
            {/* Fullscreen Image Modal */}
            {isImageOpen && (
              <div
                className="fullscreen-modal"
                style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}
                onClick={() => setIsImageOpen(false)}
              >
                <img
                  src={'https://images.unsplash.com/photo-1770885653473-ca48b4d69173?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                  alt="event"
                  style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '8px' }}
                  onClick={e => e.stopPropagation()}
                />
                <button
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 30,
                    fontSize: 32,
                    color: '#fff',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsImageOpen(false)}
                >
                  &times;
                </button>
              </div>
            )}
    
            {/* Right – Details */}
            <div className="event-details">
              <h2>{eventData?.event_Name || 'Event Title'}</h2>
              <p>{eventData?.event || 'Event Name'} | {eventData?.participant_mode || 'participants des'}</p>
              <p>{eventData?.event_description || sampleEvent.description}</p>
    
              {/* Departments */}
              <div className="departments">
                <strong>Departments:</strong>
                {eventData?.Department?.map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
    
    {/* Event Categories Section */}
    <div className="categories">
      <strong>Event Categories:</strong>
    
      {/* Show available categories summary */}
      <div className="tag-list" style={{ marginTop: '10px' }}>
        {eventData?.event_categories?.Technical && (
          <span className="tag">Technical Events</span>
        )}
        {eventData?.event_categories?.["Non-Technical"] && (
          <span className="tag">Non-Technical Events</span>
        )}
      </div>
    
      {/* Technical Events */}
      {eventData?.event_categories?.Technical && (
        <div className="category-group">
          <strong>Technical:</strong>
          <div className="tag-list">
            {eventData.event_categories.Technical.map((item, i) => (
              <span className="tag" key={`tech-${i}`}>{item}</span>
            ))}
          </div>
        </div>
      )}
    
      {/* Non-Technical Events */}
      {eventData?.event_categories?.["Non-Technical"] && (
        <div className="category-group">
          <strong>Non-Technical:</strong>
          <div className="tag-list">
            {eventData.event_categories["Non-Technical"].map((item, i) => (
              <span className="tag" key={`nontech-${i}`}>{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
    
    
              {/* Schedule, Location, Organizer */}
              <div className="schedule-location">
                <strong>Data & Time:</strong>
                <p>{new Date(eventData?.event_schedule).toLocaleString()}</p>
                <strong>Location:</strong>
                <p>
                  {eventData?.event_location?.latitude && eventData?.event_location?.longitude ? (
                    <>
                      Lat: {eventData.event_location.latitude}, Lon: {eventData.event_location.longitude} &nbsp;
                      <a
                        href={`https://www.google.com/maps?q=${eventData.event_location.latitude},${eventData.event_location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1976d2" }}
                      >
                        View on Google Maps
                      </a>
                    </>
                  ) : (
                    sampleEvent.location
                  )}
                </p>
               {/* Coordinator Details */}
          { eventData?.coordinator_details && (
            <div className="coordinator-details">
              <strong>Organized by:</strong> 
              <ul>
                {Object.entries(eventData.coordinator_details).map(([dept, info]) => (
                  <li key={dept}>
                    {dept}: {info.name} ({info.id})
                  </li>
                ))}
              </ul>
            </div>
          )}
              </div>
            </div>
          </div>
    
          {/* Registration Modal */}
          {isRegisterOpen && (
            <div
              className="fullscreen-modal"
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
              }}
              onClick={() => setIsRegisterOpen(false)}
            >
              <div onClick={e => e.stopPropagation()}>
                <EventRegisterWizard eventId={eventData?._id || id} onClose={() => setIsRegisterOpen(false)} />
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="comments-section">
            <h4>0 Comments</h4>
            <div className="comment-input">
              <div className="comment-avatar"></div>
              <input type="text" placeholder="Add a comment..." />
            </div>
    
            {eventData?.comments?.map((c, i) => (
              <div key={i} className="comment">
                <div className="comment-avatar"></div>
                <div className="comment-body">
                  <strong>{c.user}</strong>
                  <p>{c.text}</p>
                  <div>
                    {c.likes}
                    <button>Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
    
      
        </div>
        </div>
      </div>  
    </>
  )
}

export default EventDetailsPage;