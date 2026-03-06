import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PublicNavbar from '../../component/PublicNavbar';
import './styles/About.css';

export const About = ({ title }) => {
  useEffect(() => { document.title = title || 'About'; }, [title]);

  return (
    <>
      <PublicNavbar />
      <div className="about-page">

        {/* ── Hero ── */}
        <section className="about-hero">
          <h1>About FestMate</h1>
          <p>
            FestMate is an all-in-one event management platform built for colleges and
            communities. We make it effortless to create, discover, register, and manage
            events — so organizers can focus on what matters and participants never miss out.
          </p>
        </section>

        {/* ── Stats ── */}
        <section className="about-section">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Events Created</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Registrations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Colleges</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="about-section">
          <h2><span>Key Features</span></h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon purple">
                <span className="material-symbols-rounded">event</span>
              </div>
              <h3>Event Creation</h3>
              <p>Create events in minutes with a step-by-step wizard — set schedules, categories, departments, and more.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon pink">
                <span className="material-symbols-rounded">how_to_reg</span>
              </div>
              <h3>Easy Registration</h3>
              <p>Students can browse and register for events instantly with a guided registration flow.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon teal">
                <span className="material-symbols-rounded">dashboard</span>
              </div>
              <h3>Role-Based Dashboards</h3>
              <p>Separate dashboards for Admins, Coordinators, and Students — each tailored to their workflow.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon amber">
                <span className="material-symbols-rounded">notifications</span>
              </div>
              <h3>Real-Time Notifications</h3>
              <p>Stay updated with instant alerts for approvals, event updates, and registration confirmations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">
                <span className="material-symbols-rounded">bar_chart</span>
              </div>
              <h3>Reports & Analytics</h3>
              <p>Generate detailed reports on event participation, departments, and user activity.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon red">
                <span className="material-symbols-rounded">verified_user</span>
              </div>
              <h3>Approval Workflow</h3>
              <p>Admins can review, approve, or reject events and user requests with a streamlined process.</p>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="about-section">
          <h2><span>How It Works</span></h2>
          <div className="steps-grid">
            <div className="step-card">
              <h3>Sign Up</h3>
              <p>Create your account and verify your email to get started.</p>
            </div>
            <div className="step-card">
              <h3>Explore Events</h3>
              <p>Browse upcoming events, filter by department or category.</p>
            </div>
            <div className="step-card">
              <h3>Register</h3>
              <p>Pick your event and complete the quick registration form.</p>
            </div>
            <div className="step-card">
              <h3>Participate</h3>
              <p>Attend the event, connect with peers, and have fun!</p>
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section className="about-section">
          <h2><span>Our Services</span></h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <span className="material-symbols-rounded">calendar_month</span>
              </div>
              <h3>Event Planning & Scheduling</h3>
              <p>End-to-end event planning tools — set dates, venues, departments, and let FestMate handle the logistics.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span className="material-symbols-rounded">group_add</span>
              </div>
              <h3>Participant Management</h3>
              <p>Manage registrations, attendance, and team formations with real-time tracking and instant confirmations.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span className="material-symbols-rounded">query_stats</span>
              </div>
              <h3>Analytics & Insights</h3>
              <p>Gain deep insights into event performance, participation trends, and department-wise engagement metrics.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span className="material-symbols-rounded">admin_panel_settings</span>
              </div>
              <h3>Role-Based Access Control</h3>
              <p>Fine-grained permissions for Admins, Coordinators, and Students — everyone sees exactly what they need.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span className="material-symbols-rounded">campaign</span>
              </div>
              <h3>Announcements & Notifications</h3>
              <p>Broadcast updates, send reminders, and keep every participant informed in real time.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <span className="material-symbols-rounded">support_agent</span>
              </div>
              <h3>Dedicated Support</h3>
              <p>Our support team is always ready to help — from onboarding to troubleshooting, we've got you covered.</p>
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="about-section">
          <h2><span>Built With</span></h2>
          <div className="tech-badges">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">Express</span>
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">JWT Auth</span>
            <span className="tech-badge">Chart.js</span>
            <span className="tech-badge">CSS3</span>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="about-cta">
          <h2>Ready to get started?</h2>
          <p>Join thousands of students and organizers already using FestMate.</p>
          <div className="cta-buttons">
            <NavLink to="/register" className="btn-primary">Create Account</NavLink>
            <NavLink to="/login" className="btn-outline">Sign In</NavLink>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="about-footer">
          &copy; {new Date().getFullYear()} FestMate. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default About;
