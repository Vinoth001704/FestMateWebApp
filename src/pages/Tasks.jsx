import React, { useEffect, useState } from 'react';
import { get, patch, remove } from '../utils/api';
import './styles/Tasks.css';

/*
  Backend status values (capitalized):
    "Pending" | "In Progress" | "Completed"

  Endpoints used:
    GET    /api/tasks/counts          → { tasks: { all, pending, inProgress, completed }, registrationStats }
    GET    /api/tasks                 → { tasks: [...] }   (supports ?event_id=&status=)
    PATCH  /api/tasks/:id/status      → { message, task }  body: { status }
    DELETE /api/tasks/:id             → { message }

  Task shape from API:
    _id, event_id, event_name, event_creator: { name, id },
    coordinators: [{ name, id, department }],
    title, description, assigned_to: { _id, name, email },
    due_date, status, created_by: { _id, name, email },
    registration_stats: { total, pending, approved, rejected },
    createdAt, updatedAt
*/

const STATUS_VALUES = ['Pending', 'In Progress', 'Completed'];
const STATUS_CSS = { Pending: 'pending', 'In Progress': 'in-progress', Completed: 'completed' };

const Tasks = ({ title = 'Tasks' }) => {
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');          // 'all' | 'Pending' | 'In Progress' | 'Completed'
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    document.title = title;
  }, [title]);

  /* ── Fetch counts ── */
  const fetchCounts = async () => {
    try {
      const data = await get('/api/tasks/counts');
      if (data?.tasks) setCounts(data.tasks);
    } catch {
      // non-critical
    }
  };

  /* ── Fetch tasks ── */
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter !== 'all' ? `?status=${encodeURIComponent(filter)}` : '';
      const data = await get(`/api/tasks${params}`);
      setTasks(data.tasks || []);
    } catch (err) {
      const code = err.response?.status;
      if (code === 401) setError('Unauthorized — please log in again');
      else if (code === 403) setError('Forbidden — access denied');
      else if (code === 404) setError('Tasks endpoint not found on server');
      else setError(err.response?.data?.message || err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  /* ── Update task status ── */
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await patch(`/api/tasks/${taskId}/status`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      fetchCounts();
    } catch {
      // silent
    }
  };

  /* ── Delete task ── */
  const handleDelete = async (taskId) => {
    try {
      await remove(`/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      fetchCounts();
    } catch {
      // silent
    }
  };

  /* ── Format date ── */
  const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  /* ── Resolve assigned_to display name ── */
  const assigneeName = (assigned) => {
    if (!assigned) return null;
    if (typeof assigned === 'string') return assigned;
    return assigned.name || assigned.email || null;
  };

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="tasks-header">
        <div className="tasks-header-left">
          <h2 className="tasks-title">
            <span className="material-symbols-rounded">checklist</span>
            {title}
          </h2>
          <p className="tasks-subtitle">{counts.all} total tasks</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="tasks-stats">
        <div className={`task-stat-card ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          <span className="material-symbols-rounded task-stat-icon all">list</span>
          <div className="task-stat-info">
            <span className="task-stat-count">{counts.all}</span>
            <span className="task-stat-label">All</span>
          </div>
        </div>
        <div className={`task-stat-card ${filter === 'Pending' ? 'active' : ''}`} onClick={() => setFilter('Pending')}>
          <span className="material-symbols-rounded task-stat-icon pending">schedule</span>
          <div className="task-stat-info">
            <span className="task-stat-count">{counts.pending}</span>
            <span className="task-stat-label">Pending</span>
          </div>
        </div>
        <div className={`task-stat-card ${filter === 'In Progress' ? 'active' : ''}`} onClick={() => setFilter('In Progress')}>
          <span className="material-symbols-rounded task-stat-icon in-progress">sync</span>
          <div className="task-stat-info">
            <span className="task-stat-count">{counts.inProgress}</span>
            <span className="task-stat-label">In Progress</span>
          </div>
        </div>
        <div className={`task-stat-card ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>
          <span className="material-symbols-rounded task-stat-icon completed">check_circle</span>
          <div className="task-stat-info">
            <span className="task-stat-count">{counts.completed}</span>
            <span className="task-stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="tasks-filters">
        {['all', ...STATUS_VALUES].map((f) => (
          <button
            key={f}
            className={`tasks-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f}
            <span className="filter-count">
              {f === 'all' ? counts.all : f === 'Pending' ? counts.pending : f === 'In Progress' ? counts.inProgress : counts.completed}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="tasks-loading">
          <span className="material-symbols-rounded spin">progress_activity</span>
          <p>Loading tasks…</p>
        </div>
      ) : error ? (
        <div className="tasks-error">
          <span className="material-symbols-rounded">error</span>
          <p>{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="tasks-empty">
          <span className="material-symbols-rounded">inbox</span>
          <p>No tasks found</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => {
            const isExpanded = expandedId === task._id;
            const statusClass = STATUS_CSS[task.status] || '';
            const stats = task.registration_stats;
            return (
              <div
                key={task._id}
                className={`task-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setExpandedId(isExpanded ? null : task._id)}
              >
                <div className="task-card-top">
                  <div className="task-card-left">
                    <span className={`task-status-dot ${statusClass}`} />
                    <div className="task-card-info">
                      <h4 className="task-card-title">{task.title || 'Untitled Task'}</h4>
                      <p className="task-card-meta">
                        {task.event_name && (
                          <span className="task-meta-event">
                            <span className="material-symbols-rounded">event</span>
                            {task.event_name}
                          </span>
                        )}
                        {assigneeName(task.assigned_to) && (
                          <span className="task-meta-assignee">
                            <span className="material-symbols-rounded">person</span>
                            {assigneeName(task.assigned_to)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="task-card-right">
                    <span className={`task-status-badge ${statusClass}`}>
                      {task.status}
                    </span>
                    {task.due_date && (
                      <span className="task-due-date">
                        <span className="material-symbols-rounded">calendar_today</span>
                        {fmtDate(task.due_date)}
                      </span>
                    )}
                    <span className="material-symbols-rounded task-expand-icon">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="task-card-details">
                    {task.description && (
                      <div className="task-detail-row">
                        <span className="task-detail-label">Description</span>
                        <p className="task-detail-value">{task.description}</p>
                      </div>
                    )}

                    {/* Event creator */}
                    {task.event_creator?.name && (
                      <div className="task-detail-row">
                        <span className="task-detail-label">Event Creator</span>
                        <span className="task-detail-value">{task.event_creator.name}</span>
                      </div>
                    )}

                    {/* Created by */}
                    {task.created_by?.name && (
                      <div className="task-detail-row">
                        <span className="task-detail-label">Created By</span>
                        <span className="task-detail-value">{task.created_by.name}</span>
                      </div>
                    )}

                    {/* Coordinators */}
                    {task.coordinators?.length > 0 && (
                      <div className="task-detail-row">
                        <span className="task-detail-label">Coordinators</span>
                        <div className="task-coordinators">
                          {task.coordinators.map((c, i) => (
                            <span key={i} className="task-coordinator-chip">
                              {c.name}{c.department ? ` (${c.department})` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Registration stats */}
                    {stats && (
                      <div className="task-detail-row">
                        <span className="task-detail-label">Registrations</span>
                        <div className="task-reg-stats">
                          <span className="task-reg-chip total">Total: {stats.total}</span>
                          <span className="task-reg-chip pending">Pending: {stats.pending}</span>
                          <span className="task-reg-chip approved">Approved: {stats.approved}</span>
                          <span className="task-reg-chip rejected">Rejected: {stats.rejected}</span>
                        </div>
                      </div>
                    )}

                    {task.createdAt && (
                      <div className="task-detail-row">
                        <span className="task-detail-label">Created</span>
                        <span className="task-detail-value">{fmtDate(task.createdAt)}</span>
                      </div>
                    )}

                    <div className="task-detail-actions">
                      {task.status !== 'Completed' && (
                        <button
                          className="task-action-btn complete"
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(task._id, 'Completed'); }}
                        >
                          <span className="material-symbols-rounded">check_circle</span>
                          Mark Complete
                        </button>
                      )}
                      {task.status === 'Pending' && (
                        <button
                          className="task-action-btn progress"
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(task._id, 'In Progress'); }}
                        >
                          <span className="material-symbols-rounded">play_arrow</span>
                          Start
                        </button>
                      )}
                      {task.status === 'Completed' && (
                        <button
                          className="task-action-btn reopen"
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(task._id, 'Pending'); }}
                        >
                          <span className="material-symbols-rounded">restart_alt</span>
                          Reopen
                        </button>
                      )}
                      <button
                        className="task-action-btn delete"
                        onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}
                      >
                        <span className="material-symbols-rounded">delete</span>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tasks;
