import React from 'react'
import './styles/Loader.css'

const Loader = ({ text = 'Loading...', size = 'md' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-spinner">
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  )
}

export default Loader
