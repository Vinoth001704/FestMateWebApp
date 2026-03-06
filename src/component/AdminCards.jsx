import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { remove } from '../utils/api'
import './styles/AdminCards.css'

export default function AdminCards({
  id,
  event_Name,
  event_description = 'Event description goes here.',
  tag = 'Event',
}) {
  const navigate = useNavigate()

  const stringToColor = (str) => {
    // Strong cool-range HSL (180° - 280°) deterministic from string
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const absHash = Math.abs(hash)
    // Map into 180-280 degrees (teal -> blue -> purple)
    const hue = 180 + (absHash % 101)
    const hue2 = 180 + ((absHash + 40) % 101)
    const sat = 60 + (absHash % 21)
    const light = 40 + ((absHash >> 4) % 21)

    const hslToHex = (h, s, l) => {
      s /= 100
      l /= 100
      const a = s * Math.min(l, 1 - l)
      const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    }

    return [hslToHex(hue, sat, light), hslToHex(hue2, sat, light)]
  }

  const readableTextColor = (hex) => {
    if (!hex) return '#fff'
    const c = hex.replace('#', '')
    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 128 ? '#111' : '#fff'
  }

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/events/${id}/edit`)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await remove(`/api/event/delete/${id}`)
      alert('Event deleted successfully')
      window.location.reload() // Refresh to update the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event')
    }
  }

  return (
    <NavLink to={`/events/${id}`} className="card swiper-slide">
      <div className="card-image">
        {(() => {
          const [cA, cB] = stringToColor(event_Name || tag || 'Event')
          const textColor = readableTextColor(cA)
          return (
            <div
              className="card-banner-fallback"
              style={{ '--c1': cA, '--c2': cB, '--text-color': textColor }}
            >
              <div className="card-banner-text">{event_Name || tag}</div>
            </div>
          )
        })()}
      </div>
      <div className="card-content">
        <h3 className="card-title">{event_Name}</h3>
        <p className="card-text">
          {event_description
            ? event_description.split(/\s+/).slice(0, 13).join(' ') +
              (event_description.split(/\s+/).length > 13 ? '...' : '')
            : 'Event description goes here.'}
        </p>
        <div className="card-actions">
          <button className="card-btn card-btn-edit" onClick={handleEdit}>
            Edit
          </button>
          <button className="card-btn card-btn-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </NavLink>
  )
}
