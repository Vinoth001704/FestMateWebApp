import React, { useEffect } from 'react'
import './styles/Events.css'
import UpComingEvent from '../component/UpComingEvent'
import TrendingEvents from '../component/TrendingEvents'
import EventNavbar from '../component/EventNavbar'

const Events = ({ title }) => {
  
   const showEventNav = location.pathname.startsWith('/student/events');
  const eventLinks = [{ to: 'registered', label: 'My Registered Events' }];
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <>
       {showEventNav && <EventNavbar basePath="/student/events" links={eventLinks} />}
       <div className='events-container'>
          <TrendingEvents/>
          <UpComingEvent/>
       </div>
     </>
  )
}

export default Events