import React, { useEffect } from 'react'
import Dashboardheader from '../component/Dashboardheader'

const Dashboard = ({ progressRef, categoryRef,title}) => {
    useEffect(() => { document.title = title;
}, [title]);
  return (
   <>
     <div className="dashboard-view" id="overview">
            {/* <!-- Stats Cards --> */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-title">Total Projects</div>
                  <div className="stat-card-icon primary">
                    <span className="material-symbols-rounded">folder</span>
                  </div>
                </div>
                <div className="stat-card-value">12</div>
                <div className="stat-card-change positive">
                  <span className="material-symbols-rounded">trending_up</span>
                  <span>+2 this week</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-title">Completed Tasks</div>
                  <div className="stat-card-icon success">
                    <span className="material-symbols-rounded">check_circle</span>
                  </div>
                </div>
                <div className="stat-card-value">48</div>
                <div className="stat-card-change positive">
                  <span className="material-symbols-rounded">trending_up</span>
                  <span>+15% from last week</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-title">Pending Tasks</div>
                  <div className="stat-card-icon warning">
                    <span className="material-symbols-rounded">schedule</span>
                  </div>
                </div>
                <div className="stat-card-value">23</div>
                <div className="stat-card-change negative">
                  <span className="material-symbols-rounded">trending_down</span>
                  <span>-3 from last week</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-title">Team Members</div>
                  <div className="stat-card-icon info">
                    <span className="material-symbols-rounded">group</span>
                  </div>
                </div>
                <div className="stat-card-value">8</div>
                <div className="stat-card-change positive">
                  <span className="material-symbols-rounded">trending_up</span>
                  <span>+1 new member</span>
                </div>
              </div>
            </div>
            {/* Charts */}
            <div className="chart-grid">
              <div className="chart-card">
                <div className="chart-card-header">
                  <h3 className="chart-card-title">Project Progress</h3>
                  <p className="chart-card-subtitle">Completion rate over time</p>
                </div>
                <div className="chart-container">
                  <canvas id="progressChart" ref={progressRef}></canvas>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-card-header">
                  <h3 className="chart-card-title">Task Distribution</h3>
                  <p className="chart-card-subtitle">Tasks by category</p>
                </div>
                <div className="chart-container">
                  <canvas id="categoryChart" ref={categoryRef}></canvas>
                </div>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="dashboard-table-container">
              <div className="dashboard-table-header">
                <h3 className="dashboard-table-title">Recent Projects</h3>
                <a href="#" className="btn btn-secondary">View All</a>
              </div>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="project-title-cell">
                        <div className="project-icon">
                          <span className="material-symbols-rounded">web</span>
                        </div>
                        <div className="project-info">
                          <div className="project-title-text">Website Redesign</div>
                          <div className="project-meta-text">Frontend • 5 tasks</div>
                        </div>
                      </div>
                    </td>
                    <td>85%</td>
                    <td><span className="status-badge success">In Progress</span></td>
                    <td>Dec 15, 2024</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="project-title-cell">
                        <div className="project-icon">
                          <span className="material-symbols-rounded">phone_android</span>
                        </div>
                        <div className="project-info">
                          <div className="project-title-text">Mobile App</div>
                          <div className="project-meta-text">Mobile • 8 tasks</div>
                        </div>
                      </div>
                    </td>
                    <td>60%</td>
                    <td><span className="status-badge warning">In Progress</span></td>
                    <td>Jan 20, 2025</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="project-title-cell">
                        <div className="project-icon">
                          <span className="material-symbols-rounded">database</span>
                        </div>
                        <div className="project-info">
                          <div className="project-title-text">Database Migration</div>
                          <div className="project-meta-text">Backend • 3 tasks</div>
                        </div>
                      </div>
                    </td>
                    <td>100%</td>
                    <td><span className="status-badge success">Completed</span></td>
                    <td>Nov 30, 2024</td>
                  </tr>
                </tbody>
              </table>
            </div>
      </div>
   </>
  )
}

export default Dashboard