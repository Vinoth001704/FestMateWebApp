import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { useAuth } from '../../utils/AuthProvider';
import { useToast } from '../../context/ToastProvider';

export const Login = ({ title }) => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const emailInputRef = useRef(null);
  const { addToast } = useToast();

  const [popup, setPopup] = useState({ show: false, message: '', type: 'danger' });
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = title;
  },   [title]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const email = form.email.trim();
    const password = form.password;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = password.length > 0;

    if (!emailValid || !passwordValid) {
      const msg = 'Enter valid email and password';
      setPopup({ show: true, message: msg, type: 'danger' });
      try { addToast({ message: msg, type: 'danger' }); } catch (e) {}
      emailInputRef.current?.focus();
      return null;
    }

    return { email, password };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, payload);
      const { message, user, token } = res.data;
      if (message === 'Login Successfully' || message === 'Welcome' || message === 'Created Success') {
        login(user); 
        localStorage.setItem('token', token);

        setPopup({ show: true, message: message, type: 'success' });
        try { addToast({ message: message, type: 'success' }); } catch (e) {}

        setTimeout(() => {
          const rolePath = user.role?.toLowerCase() || 'home';
          navigate(`/${rolePath}`);
        }, 1000);
      } else {
        const msg = 'Invalid credentials';
        setPopup({ show: true, message: msg, type: 'danger' });
        try { addToast({ message: msg, type: 'danger' }); } catch (e) {}
      }
    } catch (error) {
      console.error(error);
      const apiMessage =
        error?.response?.data?.message ||
        (typeof error?.response?.data === 'string' ? error.response.data : null);
      const message = apiMessage || 'Login failed. Please try again.';
      setPopup({ show: true, message, type: 'danger' });
      try { addToast({ message, type: 'danger' }); } catch (e) {}
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className={`sign-in-page ${showPassword ? 'show-password' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <label>Email</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              value={form.email}
              onChange={handleChange}
              ref={emailInputRef}
            />
          </div>
        </div>
        <div className="form-item">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              id="eyeball"
              onClick={togglePasswordVisibility}
            >
              <div className="eye"></div>
            </button>
            <div id="beam"></div>
          </div>
        </div>
        <button id="submit" type="submit">Sign in</button>
        
        <div className="register">
          <p>Don't have an account? <NavLink to="/register">Register</NavLink></p>
        </div>
      </form>
    </section>
  );
};

export default Login;
