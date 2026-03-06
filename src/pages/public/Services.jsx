import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PublicNavbar from '../../component/PublicNavbar';
import './styles/Services.css';

export const Services = ({ title }) => {
  useEffect(() => { document.title = title || 'Services'; }, [title]);

  return (
    <>
      <PublicNavbar />
      <div className="services-page">

        {/* ── Hero ── */}
        <section className="services-hero">
          <h1>Our Services</h1>
          <p>
            Everything you need to plan, manage, and execute successful events —
            all in one powerful platform.
          </p>
        </section>

        {/* ── Core Services ── */}
        <section className="services-section">
          <h2><span>Core Services</span></h2>
          <div className="srv-grid">

            <div className="srv-card">
              <div className="srv-icon purple">
                <span className="material-symbols-rounded">calendar_month</span>
              </div>
              <h3>Event Planning & Scheduling</h3>
              <p>Create events in minutes with our step-by-step wizard. Set dates, venues, departments, categories, and participant limits — FestMate handles the rest.</p>
              <ul className="srv-list">
                <li>Multi-day & recurring events</li>
                <li>Department-wise scheduling</li>
                <li>Conflict detection</li>
              </ul>
            </div>

            <div className="srv-card">
              <div className="srv-icon pink">
                <span className="material-symbols-rounded">how_to_reg</span>
              </div>
              <h3>Registration Management</h3>
              <p>Streamlined registration flow for participants — from sign-up to confirmation, with real-time seat tracking and waitlist support.</p>
              <ul className="srv-list">
                <li>Custom registration forms</li>
                <li>Auto-confirmation emails</li>
                <li>Waitlist & capacity control</li>
              </ul>
            </div>

            <div className="srv-card">
              <div className="srv-icon teal">
                <span className="material-symbols-rounded">group_add</span>
              </div>
              <h3>Participant & Team Management</h3>
              <p>Manage individual and team registrations, track attendance, and organize participants across multiple events effortlessly.</p>
              <ul className="srv-list">
                <li>Team formation support</li>
                <li>Attendance tracking</li>
                <li>Bulk participant actions</li>
              </ul>
            </div>

            <div className="srv-card">
              <div className="srv-icon amber">
                <span className="material-symbols-rounded">admin_panel_settings</span>
              </div>
              <h3>Role-Based Access Control</h3>
              <p>Fine-grained permissions for Admins, Coordinators, and Students. Each role sees a tailored dashboard with only the tools they need.</p>
              <ul className="srv-list">
                <li>Admin, Coordinator, Student roles</li>
                <li>Custom permission levels</li>
                <li>Secure JWT authentication</li>
              </ul>
            </div>

            <div className="srv-card">
              <div className="srv-icon blue">
                <span className="material-symbols-rounded">query_stats</span>
              </div>
              <h3>Analytics & Reports</h3>
              <p>Gain deep insights into event performance with visual charts, department-wise breakdowns, and exportable reports.</p>
              <ul className="srv-list">
                <li>Real-time dashboards</li>
                <li>Participation trends</li>
                <li>Exportable PDF / CSV reports</li>
              </ul>
            </div>

            <div className="srv-card">
              <div className="srv-icon red">
                <span className="material-symbols-rounded">campaign</span>
              </div>
              <h3>Notifications & Announcements</h3>
              <p>Keep everyone informed with real-time push notifications, in-app alerts, and broadcast announcements for important updates.</p>
              <ul className="srv-list">
                <li>Real-time push alerts</li>
                <li>Event reminders</li>
                <li>Broadcast to departments</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Additional Services ── */}
        <section className="services-section">
          <h2><span>Additional Services</span></h2>
          <div className="srv-grid srv-grid--3">

            <div className="srv-card srv-card--compact">
              <div className="srv-icon-sm">
                <span className="material-symbols-rounded">approval</span>
              </div>
              <h3>Approval Workflows</h3>
              <p>Multi-step approval process for events and registrations with audit trail.</p>
            </div>

            <div className="srv-card srv-card--compact">
              <div className="srv-icon-sm">
                <span className="material-symbols-rounded">location_on</span>
              </div>
              <h3>Venue & Location</h3>
              <p>Map integration with Google Maps for easy venue discovery and navigation.</p>
            </div>

            <div className="srv-card srv-card--compact">
              <div className="srv-icon-sm">
                <span className="material-symbols-rounded">feedback</span>
              </div>
              <h3>Feedback Collection</h3>
              <p>Post-event feedback forms and ratings to measure success and improve future events.</p>
            </div>

            <div className="srv-card srv-card--compact">
              <div className="srv-icon-sm">
                <span className="material-symbols-rounded">person_search</span>
              </div>
              <h3>User Profiles</h3>
              <p>Rich user profiles with event history, registrations, and activity tracking.</p>
            </div>

            <div className="srv-card srv-card--compact">
              <div className="srv-icon-sm">
                <span className="material-symbols-rounded">dark_mode</span>
              </div>
              <h3>Theme Customization</h3>
              <p>Light and dark mode support with customizable accent colors for your dashboard.</p>
            </div>

            <div className="srv-card srv-card--compact">
              <div className="srv-icon-sm">
                <span className="material-symbols-rounded">support_agent</span>
              </div>
              <h3>24/7 Support</h3>
              <p>Dedicated support team for onboarding, troubleshooting, and best practices guidance.</p>
            </div>
          </div>
        </section>

        {/* ── Pricing Teaser ── */}
        <section className="services-section">
          <h2><span>Simple Pricing</span></h2>
          <div className="pricing-row">
            <div className="pricing-card">
              <h3>Free</h3>
              <p className="pricing-price">$0<span>/mo</span></p>
              <ul className="pricing-features">
                <li>Up to 5 events</li>
                <li>50 registrations/event</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
              <NavLink to="/register" className="pricing-btn">Get Started</NavLink>
            </div>

            <div className="pricing-card pricing-card--popular">
              <div className="popular-badge">Most Popular</div>
              <h3>Pro</h3>
              <p className="pricing-price">$29<span>/mo</span></p>
              <ul className="pricing-features">
                <li>Unlimited events</li>
                <li>Unlimited registrations</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Custom branding</li>
              </ul>
              <NavLink to="/register" className="pricing-btn pricing-btn--primary">Get Started</NavLink>
            </div>

            <div className="pricing-card">
              <h3>Enterprise</h3>
              <p className="pricing-price">Custom</p>
              <ul className="pricing-features">
                <li>Everything in Pro</li>
                <li>Dedicated server</li>
                <li>SLA guarantee</li>
                <li>On-site training</li>
                <li>API access</li>
              </ul>
              <NavLink to="/register" className="pricing-btn">Contact Us</NavLink>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="services-cta">
          <h2>Ready to transform your events?</h2>
          <p>Join FestMate today and experience seamless event management.</p>
          <div className="cta-buttons">
            <NavLink to="/register" className="btn-primary">Get Started Free</NavLink>
            <NavLink to="/about" className="btn-outline">Learn More</NavLink>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="services-footer">
          &copy; {new Date().getFullYear()} FestMate. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Services;
