import React, { useEffect, useState } from 'react';
import { get, patch } from '../utils/api';
import './styles/Approvals.css';

/*
  Flow:
    1. GET  /api/registerEvent/get/            → all registration rows
    2. GET  /api/event/single/:event_id        → event details per unique event_id

  Registration shape:
    _id, event_id, student_name, college_name, email, phone,
    year, department, participate_department,
    events_selected: [{ category, event_name, mode, team_members }],
    additional_notes, consent, created_by, status, createdAt

  Event shape (from /api/event/single/:id → { event: {...} }):
    event_Name, event, venue, event_schedule, Department[],
    event_description, participant_mode, event_banner_url, ...
*/

const ENDPOINTS = {
  'Pending Approvals': '/api/requestedEvents/toVerify',
  Approved: '/api/requestedEvents/approved',
  Rejected: '/api/requestedEvents/toVerify',
};

/* ── helper: pull the raw event_id string from a row ── */
const extractEventId = (r) => {
  if (!r.event_id) return null;
  if (typeof r.event_id === 'object') return r.event_id._id || r.event_id.event_id || null;
  return r.event_id;
};

const Approvals = ({ title = 'Pending Approvals' }) => {
  const [rows, setRows] = useState([]);
  const [eventMap, setEventMap] = useState({});   // { eventId: { event_Name, venue, event_schedule, ... } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 10;

  const isPending = title === 'Pending Approvals';
  const isRejected = title === 'Rejected';

  /* ── set document title ── */
  useEffect(() => {
    document.title = title;
  }, [title]);

  /* ── Step 1: fetch registrations ── */
  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = ENDPOINTS[title] || ENDPOINTS['Pending Approvals'];
        const data = await get(endpoint);

        // normalise — backend may return array or { key: [] }
        let list = Array.isArray(data)
          ? data
          : data.requestedEvents || data.requests || data.events || data.data || [];

        // "Rejected" has no own endpoint → filter client-side
        if (isRejected) {
          list = list.filter((r) => (r.status || '').toLowerCase() === 'rejected');
        }

        if (active) setRows(list);
      } catch (err) {
        if (!active) return;
        const code = err.response?.status;
        if (code === 401) setError('Unauthorized — please log in again');
        else if (code === 403) setError('Forbidden — admin access required');
        else if (code === 404) setError('Endpoint not found on server');
        else setError(err.response?.data?.message || err.message || 'Failed to load');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [title, isRejected]);

  /* ── Step 2: after rows arrive, fetch event details for each unique event_id ── */
  useEffect(() => {
    if (rows.length === 0) return;
    let active = true;

    // collect unique event IDs we haven't fetched yet
    const ids = [...new Set(rows.map(extractEventId).filter(Boolean))];
    const missing = ids.filter((id) => !eventMap[id]);
    if (missing.length === 0) return;

    (async () => {
      const results = {};

      await Promise.allSettled(
        missing.map(async (eid) => {
          try {
            const data = await get(`/api/event/single/${eid}`);
            const evt = data?.event || data;
            results[eid] = evt; // cache the full event object
          } catch {
            results[eid] = null;
          }
        }),
      );

      if (active) setEventMap((prev) => ({ ...prev, ...results }));
    })();

    return () => {
      active = false;
    };
  }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── actions ── */
  const handleApprove = async (id) => {
    if (!window.confirm('Approve this request?')) return;
    try {
      await patch(`/api/requestedEvents/approve/${id}`);
      setRows((prev) => prev.filter((r) => (r._id || r.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this request?')) return;
    try {
      await patch(`/api/requestedEvents/reject/${id}`);
      setRows((prev) => prev.filter((r) => (r._id || r.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  /* ── helpers ── */
  const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const fmtDateTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fmtEvents = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '—';
    return arr.map((e) => e.event_name).filter(Boolean).join(', ');
  };

  const getEvent = (r) => eventMap[extractEventId(r)] || null;

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  /* ── render ── */
  return (
    <div className="dashboard-content">
      <div className="dashboard-view active" id="approvals">
        <h2 className="approvals-title">{title}</h2>

        {loading && (
          <div className="approvals-loading">
            <span className="material-symbols-rounded spin">progress_activity</span>
            Loading…
          </div>
        )}

        {error && <div className="approvals-error">{error}</div>}

        {!loading && !error && rows.length === 0 && (
          <div className="approvals-empty">
            <span className="material-symbols-rounded">inbox</span>
            <p>No {title.toLowerCase()} found.</p>
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <>
          <div className="approvals-table-wrap">
            <table className="approvals-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Student</th>
                  <th>College</th>
                  <th>Dept / Year</th>
                  <th>Events Selected</th>
                  <th>Registered On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));
                  const paginatedRows = rows.slice(
                    (currentPage - 1) * ROWS_PER_PAGE,
                    currentPage * ROWS_PER_PAGE
                  );
                  return paginatedRows.map((r, i) => {
                  const idx = (currentPage - 1) * ROWS_PER_PAGE + i;
                  const id = r._id || r.id;
                  const status = r.status || (isPending ? 'Pending' : title);
                  const isExpanded = expandedId === id;
                  const evt = getEvent(r);

                  return (
                    <React.Fragment key={id ?? i}>
                      {/* ── Main row ── */}
                      <tr
                        className={isExpanded ? 'approvals-row--expanded' : ''}
                        onClick={() => toggleExpand(id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{idx + 1}</td>
                        <td className="approvals-event-name">
                          {evt?.event_Name || '…'}
                        </td>
                        <td className="approvals-student-name">
                          {r.student_name || '—'}
                        </td>
                        <td>{r.college_name || '—'}</td>
                        <td>
                          {r.department || '—'} / {r.year || '—'}
                        </td>
                        <td className="approvals-events-cell">
                          {fmtEvents(r.events_selected)}
                        </td>
                        <td>{fmtDate(r.createdAt)}</td>
                        <td>
                          <span
                            className={`approvals-status approvals-status--${status.toLowerCase()}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td
                          className="approvals-actions-cell"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isPending ? (
                            <>
                              <button
                                className="approvals-btn approvals-btn--approve"
                                onClick={() => handleApprove(id)}
                              >
                                <span className="material-symbols-rounded">
                                  check_circle
                                </span>
                                Approve
                              </button>
                              <button
                                className="approvals-btn approvals-btn--reject"
                                onClick={() => handleReject(id)}
                              >
                                <span className="material-symbols-rounded">
                                  cancel
                                </span>
                                Reject
                              </button>
                            </>
                          ) : (
                            <button
                              className="approvals-btn approvals-btn--view"
                              onClick={() =>
                                (window.location.href = `/admin/events/api/${extractEventId(r) || id}`)
                              }
                            >
                              <span className="material-symbols-rounded">
                                visibility
                              </span>
                              View
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* ── Expanded detail row ── */}
                      {isExpanded && (
                        <tr className="approvals-detail-row">
                          <td colSpan="9">
                            <div className="approvals-detail">
                              {/* Event info fetched from /api/event/single/:id */}
                              {evt && (
                                <div className="approvals-detail__section">
                                  <span className="approvals-detail__label">
                                    Event Details
                                  </span>
                                  <div className="approvals-detail__grid">
                                    <div className="approvals-detail__item">
                                      <span className="approvals-detail__label">
                                        Event
                                      </span>
                                      <span className="approvals-detail__value">
                                        {evt.event_Name || '—'}
                                      </span>
                                    </div>
                                    <div className="approvals-detail__item">
                                      <span className="approvals-detail__label">
                                        Type
                                      </span>
                                      <span className="approvals-detail__value">
                                        {evt.event || '—'}
                                      </span>
                                    </div>
                                    <div className="approvals-detail__item">
                                      <span className="approvals-detail__label">
                                        Venue
                                      </span>
                                      <span className="approvals-detail__value">
                                        {evt.venue || '—'}
                                      </span>
                                    </div>
                                    <div className="approvals-detail__item">
                                      <span className="approvals-detail__label">
                                        Schedule
                                      </span>
                                      <span className="approvals-detail__value">
                                        {fmtDateTime(evt.event_schedule)}
                                      </span>
                                    </div>
                                    <div className="approvals-detail__item">
                                      <span className="approvals-detail__label">
                                        Mode
                                      </span>
                                      <span className="approvals-detail__value">
                                        {evt.participant_mode || '—'}
                                      </span>
                                    </div>
                                    {Array.isArray(evt.Department) &&
                                      evt.Department.length > 0 && (
                                        <div className="approvals-detail__item">
                                          <span className="approvals-detail__label">
                                            Departments
                                          </span>
                                          <span className="approvals-detail__value">
                                            {evt.Department.join(', ')}
                                          </span>
                                        </div>
                                      )}
                                    {evt.event_description && (
                                      <div className="approvals-detail__item approvals-detail__item--full">
                                        <span className="approvals-detail__label">
                                          Description
                                        </span>
                                        <span className="approvals-detail__value">
                                          {evt.event_description}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Student / registration info */}
                              <div className="approvals-detail__section">
                                <span className="approvals-detail__label">
                                  Student Details
                                </span>
                                <div className="approvals-detail__grid">
                                  <div className="approvals-detail__item">
                                    <span className="approvals-detail__label">
                                      Email
                                    </span>
                                    <span className="approvals-detail__value">
                                      {r.email || '—'}
                                    </span>
                                  </div>
                                  <div className="approvals-detail__item">
                                    <span className="approvals-detail__label">
                                      Phone
                                    </span>
                                    <span className="approvals-detail__value">
                                      {r.phone || '—'}
                                    </span>
                                  </div>
                                  <div className="approvals-detail__item">
                                    <span className="approvals-detail__label">
                                      Participating Dept
                                    </span>
                                    <span className="approvals-detail__value">
                                      {r.participate_department || '—'}
                                    </span>
                                  </div>
                                  {r.additional_notes && (
                                    <div className="approvals-detail__item approvals-detail__item--full">
                                      <span className="approvals-detail__label">
                                        Notes
                                      </span>
                                      <span className="approvals-detail__value">
                                        {r.additional_notes}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Events breakdown */}
                              {Array.isArray(r.events_selected) &&
                                r.events_selected.length > 0 && (
                                  <div className="approvals-detail__events">
                                    <span className="approvals-detail__label">
                                      Events Breakdown
                                    </span>
                                    <div className="approvals-detail__tags">
                                      {r.events_selected.map((ev, idx) => (
                                        <span
                                          key={idx}
                                          className="approvals-detail__tag"
                                        >
                                          <strong>{ev.event_name}</strong>
                                          {ev.category && (
                                            <span className="approvals-detail__cat">
                                              {ev.category}
                                            </span>
                                          )}
                                          {ev.mode && (
                                            <span className="approvals-detail__mode">
                                              {ev.mode}
                                            </span>
                                          )}
                                          {ev.team_members?.length > 0 && (
                                            <span className="approvals-detail__team">
                                              Team: {ev.team_members.join(', ')}
                                            </span>
                                          )}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })})()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(() => {
            const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));
            if (totalPages <= 1) return null;
            return (
              <div className="approvals-pagination">
                <button
                  className="approvals-pagination__btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <span className="material-symbols-rounded">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`approvals-pagination__btn ${page === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="approvals-pagination__btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <span className="material-symbols-rounded">chevron_right</span>
                </button>
              </div>
            );
          })()}
          </>
        )}
      </div>
    </div>
  );
};

export default Approvals;
