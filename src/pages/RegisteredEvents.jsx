import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthProvider';
import './styles/RegisteredEvents.css';

const RegisteredEvents = ({ title = 'My Registered Events' }) => {
  const [requestedEvents, setRequestedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    document.title = title;
    const fetchRegisteredEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/requestedEvents/my`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch registered events');
        }

        const data = await response.json();
        const eventsWithDetails = await Promise.all(
          (data.requests || []).map(async (request) => {
            const eventResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/event/single/${request.event_id}`);
            if (!eventResponse.ok) {
              console.error(`Failed to fetch event details for ${request.event_id}`);
              return { ...request, eventDetails: null };
            }
            const eventData = await eventResponse.json();
            return { ...request, eventDetails: eventData.event };
          })
        );
        setRequestedEvents(eventsWithDetails);
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchRegisteredEvents();
    }

  }, [title, user]);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section>
      <h2>My Registered Events</h2>
      <p>View the events you have registered for.</p>
      <div className="accordion-container">
        {requestedEvents.length > 0 ? (
          <div className="accordion">
            {requestedEvents.map((request, index) => (
              <div key={request._id} className="accordion-item">
                <div className="accordion-header" onClick={() => handleAccordionClick(index)}>
                  <span>{request.eventDetails?.event_Name || 'N/A'}</span>
                  <span className={`status-badge status-${request.status?.toLowerCase()}`}>{request.status}</span>
                  <span className="accordion-icon">{activeIndex === index ? '−' : '>'}</span>
                </div>
                {activeIndex === index && (
                  <div className="accordion-content">
                    <p><strong>Description:</strong> {request.eventDetails?.event_description || 'N/A'}</p>
                    <p><strong>Start Date:</strong> {request.eventDetails ? formatDate(request.eventDetails.event_start_date) : 'N/A'}</p>
                    <p><strong>Student:</strong> {request.student_name}</p>
                    <p><strong>College:</strong> {request.college_name}</p>
                    <button className="details-button" onClick={() => handleViewDetails(request.eventDetails)}>View Full Details</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (  
          <p>You have not registered for any events yet.</p>
        )}
      </div>

      {isModalOpen && selectedEvent && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.event_Name}</h2>
              <button onClick={closeModal} className="modal-close-button">&times;</button>
            </div>
            <div className="modal-body">
              <p>{selectedEvent.event_description}</p>
              <p><strong>Date:</strong> {formatDate(selectedEvent.event_start_date)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
const eventTitle =(Event_id)=>{
    const [eventData, setEventData] = useState([]);
  fetch(`${import.meta.env.VITE_API_URL}/api/event/single/${Event_id}`).then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch event details');
    }
})  .then(data => setEventData(data.event))
    .catch(error => console.error(error));  
    const title = eventData.event_Name || 'Event Details';
    return title.length > 50 ? title.slice(0, 47) + '...' : title;

}

export default RegisteredEvents;
