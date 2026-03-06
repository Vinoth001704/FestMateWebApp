import React, { useEffect, useState, useMemo } from 'react'
import './styles/EventCard.css'

export default function EventCard({
  id,
  banner,
  title = 'Event Title',
  description = '',
  createdBy = 'Organizer',
  tag = 'Event',
  authorRole = '',
  onReadMore,
}) {
  const [userData, setUserData] = useState(null)

  /* ---- Fetch author profile ---- */
  useEffect(() => {
    if (!createdBy) return
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/profile/${createdBy}`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) setUserData(data.user)
      } catch (err) {
        console.error('Failed to load user profile', err)
      }
    }
    load()
    return () => { cancelled = true }
  }, [createdBy])

  /* ---- Deterministic gradient from title ---- */
  const [colorA, colorB, textColor] = useMemo(() => {
    const str = title || tag || 'Event'
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    const abs = Math.abs(hash)
    const hue1 = 180 + (abs % 101)
    const hue2 = 180 + ((abs + 40) % 101)
    const sat = 60 + (abs % 21)
    const light = 40 + ((abs >> 4) % 21)

    const toHex = (h, s, l) => {
      s /= 100; l /= 100
      const a = s * Math.min(l, 1 - l)
      const f = (n) => {
        const k = (n + h / 30) % 12
        const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))
        return Math.round(255 * c).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    }

    const cA = toHex(hue1, sat, light)
    const cB = toHex(hue2, sat, light)
    const r = parseInt(cA.slice(1, 3), 16)
    const g = parseInt(cA.slice(3, 5), 16)
    const b = parseInt(cA.slice(5, 7), 16)
    const txt = (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? '#111' : '#fff'
    return [cA, cB, txt]
  }, [title, tag])

  /* ---- Truncate description ---- */
  const shortDesc = useMemo(() => {
    if (!description) return 'Event description goes here.'
    const words = description.split(/\s+/)
    return words.length > 13
      ? words.slice(0, 13).join(' ') + '...'
      : description
  }, [description])

  const handleClick = (e) => {
    e.preventDefault()
    if (typeof onReadMore === 'function') onReadMore(id)
  }

  const authorName = userData?.name || userData?.username || createdBy
  const role = userData?.role || userData?.user_role || authorRole

  return (
    <a href={`/events/${id}`} className="uce-card" onClick={handleClick}>
      {/* Banner */}
      <div
        className="uce-card__banner"
        style={{ '--c1': colorA, '--c2': colorB }}
      >
        <span className="uce-card__banner-text" style={{ color: textColor }}>
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="uce-card__body">
        <h3 className="uce-card__title">{title}</h3>
        <p className="uce-card__desc">{shortDesc}</p>

        {/* Footer */}
        <div className="uce-card__footer">
          <div className="uce-card__author">
            <img
              className="uce-card__avatar"
              src={
                userData?.profile_image ||
                userData?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff&size=40`
              }
              alt={authorName}
            />
            <div className="uce-card__author-info">
              <span className="uce-card__author-name">{authorName}</span>
              {role && <span className="uce-card__author-role">{role}</span>}
            </div>
          </div>
          <span className="uce-card__btn">Read More</span>
        </div>
      </div>
    </a>
  )
}
