import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <span className="material-symbols-rounded" style={styles.icon}>
          explore_off
        </span>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={styles.buttons}>
          <button style={styles.primaryBtn} onClick={() => navigate('/')}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>home</span>
            Go Home
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate(-1)}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>arrow_back</span>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'var(--color-bg, #f5f5f5)',
    padding: '2rem',
  },
  content: {
    textAlign: 'center',
    maxWidth: '460px',
  },
  icon: {
    fontSize: '4rem',
    color: 'var(--color-text-muted, #999)',
    marginBottom: '0.5rem',
    display: 'block',
  },
  code: {
    fontSize: '6rem',
    fontWeight: '800',
    margin: '0',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--color-text, #111)',
    margin: '0.5rem 0',
  },
  description: {
    fontSize: '1rem',
    color: 'var(--color-text-muted, #666)',
    margin: '0 0 2rem',
    lineHeight: '1.5',
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.65rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#fff',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    fontFamily: 'inherit',
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.65rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--color-text, #333)',
    background: 'var(--color-surface, #fff)',
    border: '1.5px solid var(--color-border, #ddd)',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s, background 0.2s',
    fontFamily: 'inherit',
  },
}

export default NotFound
