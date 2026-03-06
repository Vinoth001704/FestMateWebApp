import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthProvider';
import './styles/Register.css';
import Toast from '../../component/Toast';

export const Register = ({ title }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const usernameInputRef = useRef(null);

  const [popup, setPopup] = useState({ show: false, message: '', type: 'danger' });
  const [form, setForm] = useState({ name: '', role: '', email: '', context: '', password: '', gender: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showFloating, setShowFloating] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (errorMessage) {
      setShowFloating(true);
      const timer = setTimeout(() => {
        setErrorMessage('');
        setShowFloating(false);
        usernameInputRef.current?.focus();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (popup.show) {
      const t = setTimeout(() => setPopup(p => ({ ...p, show: false })), 5000);
      return () => clearTimeout(t);
    }
  }, [popup.show]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const checkUsername = () => {
    const pattern = /^[a-zA-Z0-9_]{3,}$/;
    if (form.name === "" || !form.name.match(pattern)) {
      setUsernameValid(false);
    } else {
      setUsernameValid(true);
    }
  };

  const checkPassword = () => {
    if (form.password === "") {
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameValid && passwordValid && form.email && form.role && form.context && form.gender) {
      try {
        const payload = { ...form, role: { name: form.role } };
        console.log('Register payload:', JSON.stringify(payload, null, 2));
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, payload);
        const { message, user, token } = res.data;
        console.log(res.data);
        if (message === 'User created successfully' || message === 'Welcome') {
          login(user);
          localStorage.setItem('token', token);

          setPopup({ show: true, message: 'Registration successful! Check your email for OTP.', type: 'success' });

          setTimeout(() => {
            navigate('/verify-otp');
          }, 1000);
        } else if (message === 'OTP sent to email') {
          const activationToken = res.data.activationToken || res.data.activation_token || null;
          if (activationToken) localStorage.setItem('activationToken', activationToken);
          setPopup({ show: true, message: 'Registration successful! OTP sent to your email.', type: 'success' });
          navigate('/verify-otp');
        } else {
          setPopup({ show: true, message: 'Registration failed', type: 'danger' });
        }
      } catch (error) {
        console.error('Register error response:', error?.response?.data);
        console.error('Register error status:', error?.response?.status);
        const apiMessage =
          error?.response?.data?.message ||
          (typeof error?.response?.data === 'string' ? error.response.data : null);
        const message = apiMessage || 'Registration failed. Please try again.';
        setPopup({ show: true, message, type: 'danger' });
      }
    } else {
      setPopup({ show: true, message: 'Please fill all fields correctly', type: 'danger' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className={`sign-in-page ${showPassword ? 'show-password' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <label>Username</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              value={form.name}
              onChange={handleChange}
              onKeyUp={checkUsername}
              required
            />
          </div>
        </div>
        <div className="form-item">
          <label>Role</label>
          <div className="input-wrapper">
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
        
              <option value="coordinator">Coordinator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="form-item">
          <label>Gender</label>
          <div className="input-wrapper">
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </div>
        </div>
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
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-item">
          <label>Phone Number</label>
          <div className="input-wrapper">
            <input
              type="tel"
              id="context"
              name="context"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={form.context}
              onChange={handleChange}
              required
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
              onKeyUp={checkPassword}
              required
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
        <button id="submit" type="submit">Sign Up</button>
        
        <div className="register">
          <p>Already have an account? <NavLink to="/login">Login</NavLink></p>
        </div>
        <Toast toast={popup} />
      </form>
    </section>
  );
};

export default Register;
