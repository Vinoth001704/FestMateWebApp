import React, { useEffect } from 'react';

const Notifications = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <div className="dashboard-content">
        <div className="dashboard-view" id="notifications">
          <div className="empty-state">
            <div className="empty-state-icon">
              <span className="material-symbols-rounded">notifications</span>
            </div>
            <h3 className="empty-state-title">Notifications</h3>
            <p className="empty-state-description">
              View system alerts, event updates, and important messages all in one place.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
