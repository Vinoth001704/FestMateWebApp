import React, { useEffect, useState } from 'react'
import './styles/Events.css'
import UpComingEvent from '../component/UpComingEvent'
import TrendingEvents from '../component/TrendingEvents'
import EventSearch from '../component/EventSearch'
import EventNavbar from '../component/EventNavbar'

const Events = ({ title }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

   const showEventNav = location.pathname.startsWith('/student/events');
  const eventLinks = [{ to: 'registered', label: 'My Registered Events' }];
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <>
       {showEventNav && <EventNavbar basePath="/student/events" links={eventLinks} />}
       <div className='events-container'>
          <EventSearch onSearch={setSearchQuery} onFilter={setCategoryFilter} />
          <TrendingEvents searchQuery={searchQuery} categoryFilter={categoryFilter} />
          <UpComingEvent searchQuery={searchQuery} categoryFilter={categoryFilter} />
       </div>
     </>
  )
}

export default Events