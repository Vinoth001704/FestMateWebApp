import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/UpComingEvent.css'
import EventCard from './EventCard'
import { useAuth } from '../utils/AuthProvider'

const UpComingEvent = () => {
  const trackRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [events, setEvents] = useState([])

  /* ---- Fetch events ---- */
  useEffect(() => {
    const ac = new AbortController()
    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/event/get`,
          { signal: ac.signal }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (data && Array.isArray(data.events)) {
          const sorted = [...data.events].sort(
            (a, b) => new Date(b.createdAt || b.created_at || b.date || 0) - new Date(a.createdAt || a.created_at || a.date || 0)
          )
          setEvents(sorted)
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Failed to load events', err)
      }
    }
    load()
    return () => ac.abort()
  }, [])

  /* ---- Scroll by one card ---- */
  const scroll = (dir) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.uce-card')
    if (!card) return
    const gap = parseFloat(getComputedStyle(track).gap) || 0
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  /* ---- Navigate to event detail ---- */
  const handleReadMore = (id) => {
    const role = (user?.role || 'student').toLowerCase()
    navigate(`/${role}/events/api/${id}`)
  }

  /* ---- Map API event → card props ---- */
  const toCardProps = (ev) => {
    const raw = ev.event_banner_url || ''
    const banner =
      raw.startsWith('http') || raw.startsWith('data:')
        ? raw
        : `${import.meta.env.VITE_API_URL}${raw}`

    return {
      id: ev._id || ev.id,
      banner,
      title: ev.event_Name || ev.name || 'Event Title',
      description: ev.event_description || ev.text || '',
      createdBy: ev.created_by || 'Organizer',
      tag: ev.tag || 'Event',
      authorRole: ev.authorRole || '',
    }
  }

  return (
    <section className="uce">
      <h2 className="uce-heading">Upcoming Events</h2>

      <div className="uce-slider">
        <button
          className="uce-arrow uce-arrow--prev"
          onClick={() => scroll(-1)}
          aria-label="Previous"
        >
          ‹
        </button>

        <div className="uce-track" ref={trackRef}>
          {events.length === 0 && (
            <p className="uce-empty">No upcoming events found.</p>
          )}
          {events.map((ev, i) => {
            const props = toCardProps(ev)
            return (
              <EventCard
                key={props.id || i}
                {...props}
                onReadMore={handleReadMore}
              />
            )
          })}
        </div>

        <button
          className="uce-arrow uce-arrow--next"
          onClick={() => scroll(1)}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  )
}

export default UpComingEvent
