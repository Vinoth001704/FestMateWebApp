import React, { useState } from 'react'
import './styles/EventSearch.css'

const EventSearch = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { key: 'all', label: 'All', icon: 'apps' },
    { key: 'technical', label: 'Technical', icon: 'code' },
    { key: 'cultural', label: 'Cultural', icon: 'palette' },
    { key: 'sports', label: 'Sports', icon: 'sports_soccer' },
    { key: 'workshop', label: 'Workshop', icon: 'build' },
    { key: 'hackathon', label: 'Hackathon', icon: 'terminal' },
  ]

  const handleSearch = (e) => {
    const val = e.target.value
    setQuery(val)
    if (typeof onSearch === 'function') onSearch(val)
  }

  const handleFilter = (key) => {
    setActiveFilter(key)
    if (typeof onFilter === 'function') onFilter(key)
  }

  const clearSearch = () => {
    setQuery('')
    if (typeof onSearch === 'function') onSearch('')
  }

  return (
    <div className="event-search">
      {/* Search bar */}
      <div className="event-search__bar">
        <span className="material-symbols-rounded event-search__icon">search</span>
        <input
          type="text"
          className="event-search__input"
          placeholder="Search events by name, description, or organizer..."
          value={query}
          onChange={handleSearch}
        />
        {query && (
          <button className="event-search__clear" onClick={clearSearch}>
            <span className="material-symbols-rounded">close</span>
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="event-search__filters">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`event-search__filter ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => handleFilter(f.key)}
          >
            <span className="material-symbols-rounded">{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default EventSearch
