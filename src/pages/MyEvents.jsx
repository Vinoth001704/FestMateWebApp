import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'
import { get } from '../utils/api'
import AdminCards from '../component/AdminCards'
import './styles/Events.css'

const MyEvents = ({ title = 'My Events' }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true)
        const res = await get('/api/event/my')
        setEvents(res.events || res || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchMyEvents()
  }, [user])

  if (loading)
    return (
      <section>
        <h2>My Events</h2>
        <p>Loading...</p>
      </section>
    )

  if (error)
    return (
      <section>
        <h2>My Events</h2>
        <p className="error">{error}</p>
      </section>
    )

  return (
    <section>
      <h2>My Events</h2>
      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <div className="wrapper">
          <div className="card-list" style={{ gap: '20px' }}>
            {events.map((event) => (
              <AdminCards 
                key={event._id}
                id={event._id}
                event_Name={event.event_Name}
                event_description={event.event_description}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default MyEvents
