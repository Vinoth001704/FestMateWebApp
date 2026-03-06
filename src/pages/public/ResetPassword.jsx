import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './styles/Login.css'
import { useToast } from '../../context/ToastProvider'

const ResetPassword = ({ title }) => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [step, setStep] = useState(1) // 1: email, 2: OTP + new password
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    document.title = title || 'Reset Password'
  }, [title])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /* Step 1: Request OTP */
  const handleRequestOtp = async (e) => {
    e.preventDefault()
    const email = form.email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast({ message: 'Enter a valid email address', type: 'danger' })
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/forgot-password`,
        { email }
      )
      addToast({ message: res.data?.message || 'OTP sent to your email', type: 'success' })
      setStep(2)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Try again.'
      addToast({ message: msg, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  /* Step 2: Verify OTP & reset password */
  const handleResetPassword = async (e) => {
    e.preventDefault()
    const { otp, newPassword, confirmPassword } = form

    if (!otp.trim()) {
      addToast({ message: 'Enter the OTP sent to your email', type: 'danger' })
      return
    }
    if (newPassword.length < 6) {
      addToast({ message: 'Password must be at least 6 characters', type: 'danger' })
      return
    }
    if (newPassword !== confirmPassword) {
      addToast({ message: 'Passwords do not match', type: 'danger' })
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/reset-password`,
        { email: form.email, otp, newPassword }
      )
      addToast({ message: res.data?.message || 'Password reset successful!', type: 'success' })
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. Try again.'
      addToast({ message: msg, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="reset-password-page">
      <div className="reset-card">
        <div className="reset-header">
          <span className="material-symbols-rounded reset-icon">lock_reset</span>
          <h2>Reset Password</h2>
          <p className="reset-subtitle">
            {step === 1
              ? "Enter your email and we'll send you an OTP"
              : 'Enter the OTP and your new password'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="reset-steps">
          <div className={`reset-step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <small>Email</small>
          </div>
          <div className="reset-step-line"></div>
          <div className={`reset-step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <small>Reset</small>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="reset-form">
            <div className="reset-field">
              <label htmlFor="email">
                <span className="material-symbols-rounded">mail</span>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your registered email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? (
                <><span className="material-symbols-rounded spin">progress_activity</span> Sending...</>
              ) : (
                <><span className="material-symbols-rounded">send</span> Send OTP</>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="reset-form">
            <div className="reset-field">
              <label htmlFor="otp">
                <span className="material-symbols-rounded">pin</span>
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                autoComplete="one-time-code"
                maxLength={6}
                required
              />
            </div>

            <div className="reset-field">
              <label htmlFor="newPassword">
                <span className="material-symbols-rounded">lock</span>
                New Password
              </label>
              <div className="reset-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Min 6 characters"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="reset-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-rounded">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="reset-field">
              <label htmlFor="confirmPassword">
                <span className="material-symbols-rounded">lock_clock</span>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? (
                <><span className="material-symbols-rounded spin">progress_activity</span> Resetting...</>
              ) : (
                <><span className="material-symbols-rounded">lock_open</span> Reset Password</>
              )}
            </button>

            <button
              type="button"
              className="reset-back"
              onClick={() => setStep(1)}
            >
              <span className="material-symbols-rounded">arrow_back</span>
              Back to email
            </button>
          </form>
        )}

        <p className="reset-footer">
          Remember your password? <a href="/login">Sign In</a>
        </p>
      </div>
    </section>
  )
}

export default ResetPassword
