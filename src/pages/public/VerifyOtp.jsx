import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthProvider';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: 'danger' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateOtp = () => {
    if (otp.length !== 6) {
      return 'Please enter a 6-digit OTP.';
    }
    if (!localStorage.getItem('activationToken')) {
      return 'No activation token found. Please register again.';
    }
    return null;
  };

  const verifyOtp = async (otp, activationToken) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/api/user/verifyData`, { otp, activationToken });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateOtp();
    if (validationError) {
      setPopup({ show: true, message: validationError, type: 'danger' });
      return;
    }

    try {
      const activationToken = localStorage.getItem('activationToken');
      const res = await verifyOtp(otp, activationToken);
      const { message } = res.data;

      if (message === 'Created Success') {
        localStorage.removeItem('activationToken');
        setPopup({ show: true, message: 'Account activated successfully! Please log in.', type: 'success' });
        navigate('/login');
      } else {
        setPopup({ show: true, message: message || 'Invalid OTP or token.', type: 'danger' });
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Verification failed. Please try again.';
      setPopup({ show: true, message, type: 'danger' });
    }
  };

  return (
    <section className="sign-in-page">
      <form onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>
        <p>An OTP has been sent to your email. Please enter it below.</p>
        <div className="form-item">
          <label>OTP</label>
          <div className="input-wrapper">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
            />
          </div>
        </div>
        <button id="submit" type="submit">Verify</button>
      </form>
      {popup.show && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
          <button onClick={() => setPopup({ ...popup, show: false })}>Close</button>
        </div>
      )}
    </section>
  );
};

export default VerifyOtp;
