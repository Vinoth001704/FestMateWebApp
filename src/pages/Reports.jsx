import React, { useEffect } from 'react'

export const Reports = ({title}) => {
     useEffect(() => { document.title = title;
    }, [title]);
  return (
    <>
      <div class="dashboard-view" id="reports">
            <div class="empty-state">
              <div class="empty-state-icon">
                <span class="material-symbols-rounded">bar_chart</span>
              </div>
              <h3 class="empty-state-title">Reports</h3>
              <p class="empty-state-description">Generate detailed reports and analytics. View project performance, team productivity, and time tracking data.</p>
            </div>
          </div>
    </>
  )
}
