import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/TrendingEvents.css'
import EventCard from './EventCard'
import Loader from './Loader'
import { useAuth } from '../utils/AuthProvider'

const TrendingEvents = ({ searchQuery = '', categoryFilter = 'all' }) => {
  const trackRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  /* ---- Fetch trending events ---- */
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
          // Sort by registrations count (descending) to show trending
          const sorted = [...data.events].sort(
            (a, b) =>
              (b.registrations_count || b.registrations || 0) -
              (a.registrations_count || a.registrations || 0)
          )
          setEvents(sorted)
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Failed to load trending events', err)
      } finally {
        setLoading(false)
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
      tag: ev.tag || 'Trending',
      authorRole: ev.authorRole || '',
    }
  }

  /* ---- Filter events by search & category ---- */
  const filteredEvents = useMemo(() => {
    let result = events

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((ev) => {
        const name = (ev.event_Name || ev.name || '').toLowerCase()
        const desc = (ev.event_description || ev.text || '').toLowerCase()
        const org = (ev.created_by || '').toLowerCase()
        const tag = (ev.tag || ev.event || '').toLowerCase()
        return name.includes(q) || desc.includes(q) || org.includes(q) || tag.includes(q)
      })
    }

    if (categoryFilter && categoryFilter !== 'all') {
      const cat = categoryFilter.toLowerCase()
      result = result.filter((ev) => {
        const tag = (ev.tag || ev.event || ev.category || '').toLowerCase()
        const name = (ev.event_Name || ev.name || '').toLowerCase()
        return tag.includes(cat) || name.includes(cat)
      })
    }

    return result
  }, [events, searchQuery, categoryFilter])

  return (
    <section className="tre">
      <div className="tre-header">
        <h2 className="tre-heading">
          <span className="tre-icon material-symbols-rounded">local_fire_department</span>
          Trending Events
        </h2>
      </div>

      <div className="tre-slider">
        <button
          className="tre-arrow tre-arrow--prev"
          onClick={() => scroll(-1)}
          aria-label="Previous"
        >
          ‹
        </button>

        <div className="tre-track" ref={trackRef}>
          {loading && <Loader text="Loading trending events..." size="sm" />}
          {!loading && filteredEvents.length === 0 && (
            <p className="tre-empty">No trending events found.</p>
          )}
          {filteredEvents.map((ev, i) => {
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
          className="tre-arrow tre-arrow--next"
          onClick={() => scroll(1)}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  )
}

export default TrendingEvents
