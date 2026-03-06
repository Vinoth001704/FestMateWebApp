import React, { useEffect, useState } from 'react';
import questions from './eventCreateQuestions.json';
import { post } from '../utils/api';
import './styles/CreateEvent.css';

const CreateEvent = ({ title = 'Create Event' }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [coordinatorDetails, setCoordinatorDetails] = useState({});
  const [newEvents, setNewEvents] = useState({});
  const [showInput, setShowInput] = useState({});
  const [newDept, setNewDept] = useState('');
  const [showDeptInput, setShowDeptInput] = useState(false);
  const [docPopupEvent, setDocPopupEvent] = useState(null);
  const [docPopupAnswer, setDocPopupAnswer] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('url');
  const [submitting, setSubmitting] = useState(false);

  const current = questions.find(q => q.step === step);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    handleChange('coordinator_details', coordinatorDetails);
  }, [coordinatorDetails]);

  /* ── helpers ── */
  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const countWords = (text) =>
    text.trim().split(/\s+/).filter(w => w.length > 0).length;

  /* ── submit ── */
  const handleSubmit = async () => {
    const payload = { ...formData };
    if (payload.event === 'Other' && payload.custom_event) {
      payload.event = payload.custom_event;
    }
    delete payload.custom_event;

    // Convert datetime-local value to full ISO string for backend
    if (payload.event_schedule) {
      payload.event_schedule = new Date(payload.event_schedule).toISOString();
    }

    // Merge banner URL into event_banner_url
    if (payload.event_banner_url) {
      payload.event_banner_url = payload.event_banner_url;
    }
    delete payload.event_banner;

    try {
      setSubmitting(true);
      console.log('Submitting payload:', JSON.stringify(payload, null, 2));
      await post('/api/event/new', payload);
      alert('Event created successfully!');
      setFormData({});
      setStep(1);
    } catch (err) {
      console.error('Create event error:', err.response?.data || err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      alert('Failed to create event: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── field renderers ── */
  const renderField = () => {
    if (!current) return null;
    const { field, label, type, placeholder, placeholders, options, categories, description } = current;

    switch (type) {
      /* ─ text ─ */
      case 'text':
        return (
          <div className="cew-field">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id={`field-${field}`}
                placeholder={placeholder}
                value={formData[field] || ''}
                onChange={e => handleChange(field, e.target.value)}
              />
              <label htmlFor={`field-${field}`}>{label}</label>
            </div>
            {description && <div className="cew-hint">{description}</div>}
          </div>
        );

      /* ─ datetime ─ */
      case 'event-datetime':
        return (
          <div className="cew-field">
            <label className="form-label">{label}</label>
            <input
              type="datetime-local"
              className="form-control"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
            />
            {description && <div className="cew-hint">{description}</div>}
          </div>
        );

      /* ─ category event selection ─ */
      case 'category-event-selection': {
        return (
          <div className="cew-field">
            <label className="form-label">{label}</label>
            {description && <div className="cew-hint">{description}</div>}

            {categories.map((cat, idx) => {
              const selected = formData[field]?.[cat.label] || [];
              const allEvents = [...new Set([...cat.events, ...selected])];
              const docFlagsKey = `${field}_doc_flags`;

              return (
                <div key={idx} className="cew-category-block">
                  <h5>{cat.label}</h5>
                  <div className="cew-pill-grid">
                    {allEvents.map((ev, i) => {
                      const isSelected = selected.includes(ev);
                      const docRequired = formData[docFlagsKey]?.[ev] || false;

                      return (
                        <div key={i} className="cew-pill-row">
                          <button
                            type="button"
                            className={`btn btn-outline-primary rounded-pill px-3 py-2 ${isSelected ? 'active' : ''}`}
                            onClick={() => {
                              const updated = isSelected
                                ? selected.filter(item => item !== ev)
                                : [...selected, ev];

                              handleChange(field, { ...formData[field], [cat.label]: updated });

                              if (!isSelected && cat.label === 'Technical') {
                                setDocPopupEvent(ev);
                                setDocPopupAnswer(null);
                              }
                              if (isSelected) {
                                setFormData(prev => {
                                  const flags = { ...(prev[docFlagsKey] || {}) };
                                  delete flags[ev];
                                  return { ...prev, [docFlagsKey]: flags };
                                });
                              }
                            }}
                          >
                            {ev}
                          </button>

                          {cat.label === 'Technical' && isSelected && formData[docFlagsKey]?.hasOwnProperty(ev) && (
                            <span className={`badge ${docRequired ? 'bg-success' : 'bg-secondary'}`}>
                              Doc: {docRequired ? 'Required' : 'Not Required'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!showInput[cat.label] ? (
                    <button className="btn btn-outline-success rounded-pill btn-sm mt-2" onClick={() => setShowInput(prev => ({ ...prev, [cat.label]: true }))}>
                      + Add
                    </button>
                  ) : (
                    <div className="input-group mt-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Add new ${cat.label} event`}
                        value={newEvents[cat.label] || ''}
                        onChange={e => setNewEvents(prev => ({ ...prev, [cat.label]: e.target.value }))}
                      />
                      <button className="btn btn-outline-primary" onClick={() => {
                        const newEvent = (newEvents[cat.label] || '').trim();
                        if (!newEvent) return;
                        handleChange(field, { ...formData[field], [cat.label]: [...new Set([...selected, newEvent])] });
                        setNewEvents(prev => ({ ...prev, [cat.label]: '' }));
                        setShowInput(prev => ({ ...prev, [cat.label]: false }));
                      }}>Add</button>
                      <button className="btn btn-outline-danger" onClick={() => setShowInput(prev => ({ ...prev, [cat.label]: false }))}>Cancel</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      /* ─ select with custom ─ */
      case 'select-with-custom': {
        const sel = formData[field] || '';
        return (
          <div className="cew-field">
            <label className="form-label">{label}</label>
            <input
              type="text"
              className="form-control"
              list={`list-${field}`}
              placeholder="Select or type..."
              value={sel}
              onChange={e => handleChange(field, e.target.value)}
            />
            <datalist id={`list-${field}`}>
              {options.map((opt, i) => <option key={i} value={opt} />)}
            </datalist>

            {sel === 'Other' && (
              <div className="form-floating mt-2">
                <input
                  type="text"
                  className="form-control"
                  id={`custom-${field}`}
                  placeholder="Custom type"
                  value={formData[`custom_${field}`] || ''}
                  onChange={e => handleChange(`custom_${field}`, e.target.value)}
                />
                <label htmlFor={`custom-${field}`}>Other event type</label>
              </div>
            )}
            {description && <div className="cew-hint">{description}</div>}
          </div>
        );
      }

      /* ─ department select ─ */
      case 'department-select': {
        const selectedDepts = formData[field] || [];
        const allDepts = [...new Set([...(options || []), ...selectedDepts])];

        const toggleDept = (dept) => {
          const updated = selectedDepts.includes(dept)
            ? selectedDepts.filter(d => d !== dept)
            : [...selectedDepts, dept];
          handleChange(field, updated);
        };

        const handleAddDept = () => {
          const trimmed = newDept.trim();
          if (!trimmed) return;
          handleChange(field, [...new Set([...selectedDepts, trimmed])]);
          setNewDept('');
          setShowDeptInput(false);
        };

        return (
          <div className="cew-field">
            <label className="form-label">{label}</label>
            <div className="cew-pill-grid">
              {allDepts.map((dept, i) => (
                <button
                  key={i}
                  className={`btn btn-outline-primary rounded-pill px-3 ${selectedDepts.includes(dept) ? 'active' : ''}`}
                  onClick={() => toggleDept(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>

            {selectedDepts.map((dept, i) => (
              <div key={i} className="cew-coord-card">
                <h6>{dept} — Coordinator Info</h6>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Coordinator Name"
                  value={coordinatorDetails[dept]?.name || ''}
                  onChange={e => setCoordinatorDetails(prev => ({ ...prev, [dept]: { ...prev[dept], name: e.target.value } }))}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Coordinator ID"
                  value={coordinatorDetails[dept]?.id || ''}
                  onChange={e => setCoordinatorDetails(prev => ({ ...prev, [dept]: { ...prev[dept], id: e.target.value } }))}
                />
              </div>
            ))}

            {!showDeptInput ? (
              <button className="btn btn-sm btn-outline-success rounded-pill mt-2" onClick={() => setShowDeptInput(true)}>+ Add</button>
            ) : (
              <div className="input-group mt-2">
                <input type="text" className="form-control" placeholder="Add new department" value={newDept} onChange={e => setNewDept(e.target.value)} />
                <button className="btn btn-outline-primary rounded-pill" onClick={handleAddDept}>Add</button>
                <button className="btn btn-outline-danger rounded-pill" onClick={() => { setNewDept(''); setShowDeptInput(false); }}>Cancel</button>
              </div>
            )}
            {description && <div className="cew-hint">{description}</div>}
          </div>
        );
      }

      /* ─ coordinates ─ */
      case 'coordinates': {
        const loc = formData[field] || {};

        const handlePaste = () => {
          const input = prompt('Paste coordinates from Google Maps (e.g., 10.987654, 78.123456):');
          if (!input) return;
          const parts = input.split(',').map(p => p.trim());
          if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
            alert("Invalid format. Use 'latitude, longitude'.");
            return;
          }
          handleChange(field, { latitude: parseFloat(parts[0]).toFixed(6), longitude: parseFloat(parts[1]).toFixed(6) });
        };

        const handleGeo = () => {
          if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
          navigator.geolocation.getCurrentPosition(
            pos => handleChange(field, { latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) }),
            () => alert('Could not retrieve location.')
          );
        };

        return (
          <div className="cew-field">
            <label className="form-label">{label}</label>
            {description && <div className="cew-hint">{description}</div>}
            <input
              type="text"
              className="form-control mb-2"
              placeholder={placeholders[0]}
              value={loc.longitude || ''}
              onChange={e => handleChange(field, { ...loc, longitude: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder={placeholders[1]}
              value={loc.latitude || ''}
              onChange={e => handleChange(field, { ...loc, latitude: e.target.value })}
            />
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-outline-primary btn-sm" type="button" onClick={handleGeo}>My Location</button>
              <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handlePaste}>Paste from Google Maps</button>
            </div>
          </div>
        );
      }

      /* ─ creator details ─ */
      case 'creator-details': {
        const creator = formData[field] || {};
        return (
          <div className="cew-field">
            <label className="form-label">{label}</label>
            {description && <div className="cew-hint">{description}</div>}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Creator Name"
              value={creator.name || ''}
              onChange={e => handleChange(field, { ...creator, name: e.target.value })}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Contact Info (Phone or Email)"
              value={creator.contact || ''}
              onChange={e => handleChange(field, { ...creator, contact: e.target.value })}
            />
          </div>
        );
      }

      /* ─ textarea ─ */
      case 'textarea': {
        const val = formData[field] || '';
        return (
          <div className="cew-field">
            <label className="form-label">{label}</label>
            {description && <div className="cew-hint">{description}</div>}
            <textarea
              className="form-control"
              rows="5"
              placeholder={placeholder}
              value={val}
              onChange={e => handleChange(field, e.target.value)}
            />
            <div className="cew-word-count">Word count: {countWords(val)} / 150</div>
          </div>
        );
      }

      /* ─ image url upload ─ */
      case 'image-url-upload': {
        const imageUrl = formData[`${field}_url`] || '';
        return (
          <div className="cew-field">
            <label className="form-label">{label}</label>
            {description && <div className="cew-hint">{description}</div>}
            <input
              type="text"
              className="form-control"
              placeholder="Paste image URL here"
              value={imageUrl}
              onChange={e => handleChange(`${field}_url`, e.target.value)}
            />
            {imageUrl && (
              <div className="cew-preview mt-3">
                <img src={imageUrl} alt="Event banner" className="img-thumbnail" style={{ maxWidth: '300px' }} />
                <p className="small text-success mt-1">Image URL saved</p>
              </div>
            )}
          </div>
        );
      }

      /* ─ review ─ */
      case 'review':
        return (
          <div className="cew-field">
            <h5>{label}</h5>
            {description && <div className="cew-hint">{description}</div>}
            <pre className="cew-review-json">{JSON.stringify(formData, null, 2)}</pre>
          </div>
        );

      default:
        return <div className="alert alert-warning">Unknown field type: {type}</div>;
    }
  };

  /* ── main render ── */
  return (
    <>
      <div className="cew-container">
        <div className="cew-wrapper">
          <h4 className="cew-step-title">Step {step} of {questions.length}</h4>

          {renderField()}

          <div className="cew-nav">
            <button
              className="btn btn-outline-light rounded-pill"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </button>

            {step < questions.length ? (
              <button className="btn btn-primary rounded-pill" onClick={handleNext}>Next</button>
            ) : (
              <button className="btn btn-success rounded-pill" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Creating...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document requirement popup */}
      {docPopupEvent && (
        <div className="cew-modal-backdrop">
          <div className="cew-modal">
            <div className="cew-modal-header">
              <h5>Document Required?</h5>
              <button className="btn-close" onClick={() => setDocPopupEvent(null)} />
            </div>
            <div className="cew-modal-body">
              <p>Do participants of <strong>{docPopupEvent}</strong> need to submit a document (PPT, Word, PDF)?</p>

              <div className="form-check mb-2">
                <input className="form-check-input" type="radio" id="doc-yes" checked={docPopupAnswer === true} onChange={() => setDocPopupAnswer(true)} />
                <label className="form-check-label" htmlFor="doc-yes">Yes, document is required</label>
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="radio" id="doc-no" checked={docPopupAnswer === false} onChange={() => setDocPopupAnswer(false)} />
                <label className="form-check-label" htmlFor="doc-no">No, document is not needed</label>
              </div>

              <button
                className="btn btn-success"
                disabled={docPopupAnswer === null}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    event_categories_doc_flags: { ...(prev.event_categories_doc_flags || {}), [docPopupEvent]: docPopupAnswer },
                  }));
                  setDocPopupEvent(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEvent;
