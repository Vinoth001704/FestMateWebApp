import React, { useState, useEffect } from 'react';
import registerQuestions from './eventRegisterQuestions.json';
import './styles/EventRegisterWizard.css'
import { get, post } from '../utils/api'

export default function EventRegisterWizard({ eventId, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [eventCategories, setEventCategories] = useState({});
  const [eventDocFlags, setEventDocFlags] = useState({});
  const [eventDepartments, setEventDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return setLoading(false);
    setLoading(true);
    get(`/api/event/single/${eventId}`)
      .then(data => {
        const evt = data.event || {};
        setEventDepartments(evt.Department || evt.departments || []);
        setEventCategories(evt.event_categories || {});
        setEventDocFlags(evt.event_categories_doc_flags || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId]);

  const selectedEvents = formData['events_by_category'] || [];
  const docEvents = selectedEvents.filter(ev => eventDocFlags[ev]);
  const extendedFormData = { ...formData, has_doc_events: docEvents.length > 0 };

  const visibleQuestions = registerQuestions.filter(q => {
    if (!q.showIf) return true;
    return Object.entries(q.showIf).every(([key, val]) => extendedFormData[key] === val);
  });

  const currentQ = visibleQuestions[step - 1];
  if (!currentQ) return null;

  // dynamic options
  let options = currentQ.options;
  if (currentQ.options_from === 'event_departments') {
    options = eventDepartments.length ? eventDepartments : ['No departments available'];
  }

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleNext = () => setStep(s => Math.min(s + 1, visibleQuestions.length));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async e => {
    e && e.preventDefault();
    const payload = transformFormData({ ...formData, event_id: eventId }, eventCategories, eventDocFlags);
    try {
      await post('/api/registerEvent/new/', payload);
      alert('Registration submitted successfully!');
      if (onClose) onClose(true);
    } catch (err) {
      alert('Error submitting registration: ' + (err.response?.data?.message || err.message || ''));
    }
  };

  // render input
  let inputField = null;
  switch (currentQ.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'number':
      inputField = (
        <input
          type={currentQ.type}
          className="form-control mb-2"
          placeholder={currentQ.placeholder}
          value={formData[currentQ.field] || ''}
          onChange={e => handleChange(currentQ.field, e.target.value)}
        />
      );
      break;
    case 'textarea':
      inputField = (
        <textarea
          className="form-control mb-2"
          placeholder={currentQ.placeholder}
          value={formData[currentQ.field] || ''}
          onChange={e => handleChange(currentQ.field, e.target.value)}
        />
      );
      break;
    case 'select':
      inputField = (
        <select
          className="form-select mb-2"
          value={formData[currentQ.field] || ''}
          onChange={e => handleChange(currentQ.field, e.target.value)}
        >
          <option value="">Select...</option>
          {options && options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );
      break;
    case 'multi-select-events-by-category':
      inputField = (
        <div className="mb-2">
          {Object.entries(eventCategories).map(([category, events]) => (
            <div key={category} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600 }}>{category}</div>
              <div className="d-flex flex-wrap gap-2">
                {events.map((ev, i) => {
                  const selected = (formData[currentQ.field] || []).includes(ev);
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`btn rounded-pill px-3 py-1 ${selected ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                      style={{ marginBottom: 6 }}
                      onClick={() => {
                        const prev = formData[currentQ.field] || [];
                        handleChange(
                          currentQ.field,
                          selected ? prev.filter(o => o !== ev) : [...prev, ev]
                        );
                      }}
                    >
                      {ev}
                      {selected && <span style={{ marginLeft: 8, fontWeight: 'bold' }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
      break;
    case 'boolean':
      inputField = (
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id={currentQ.field} checked={!!formData[currentQ.field]} onChange={e => handleChange(currentQ.field, e.target.checked)} />
          <label className="form-check-label" htmlFor={currentQ.field}>{currentQ.options?.[0]}</label>
        </div>
      );
      break;
    case 'review':
      inputField = <pre className="bg-dark text-light p-3 rounded">{JSON.stringify(formData, null, 2)}</pre>;
      break;
    case 'submit':
      inputField = <button type="button" className="btn btn-success rounded-pill" onClick={handleSubmit}>Submit</button>;
      break;
    default:
      inputField = <div>Unsupported field type: {currentQ.type}</div>;
  }

  return (
    <div className="register-wizard">
      <div className="register-wizard-panel">
        <div className="register-wizard-header">
          <h4 className="register-wizard-title">{currentQ.label}</h4>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => onClose && onClose(false)}>Close</button>
        </div>

        {currentQ.description && <div className="register-wizard-description">{currentQ.description}</div>}

        {loading ? <div>Loading event info...</div> : (
          <form onSubmit={e => e.preventDefault()}>
            {inputField}

            <div className="register-wizard-actions">
                {step < visibleQuestions.length ? (
                  <button type="button" className="btn btn-accent" onClick={handleNext} disabled={(currentQ.type !== 'review' && !formData[currentQ.field])}>Next</button>
                ) : (
                  <button type="button" className="btn btn-success" onClick={handleSubmit}>Submit</button>
                )}
                <button type="button" className="btn btn-outline-light" onClick={handleBack} disabled={step === 1}>Back</button>
              <div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function transformFormData(formData, eventCategories, eventDocFlags) {
  const getCategory = (eventName) => {
    for (const [cat, events] of Object.entries(eventCategories || {})) {
      if (events.includes(eventName)) return cat;
    }
    return 'Other';
  };

  const eventsByCategory = formData.events_by_category || [];
  const events_selected = [];

  eventsByCategory.forEach(ev => {
    const cat = getCategory(ev);
    if (cat === 'Technical') {
      const mode = formData.performer_type || 'Solo';
      const team_size = mode === 'Team' ? Number(formData.team_size) || 1 : undefined;
      const team_members = mode === 'Team' ? formData.team_member_names || [] : undefined;
      const title = formData.event_titles?.[ev] || '';

      events_selected.push({
        category: cat,
        event_name: ev,
        ...(title && { title }),
        mode,
        ...(team_size && { team_size }),
        ...(team_members && { team_members })
      });
    } else {
      events_selected.push({ category: cat, event_name: ev });
    }
  });

  return {
    event_id: formData.event_id || '',
    student_name: formData.participant_name || '',
    college_name: formData.college_name || '',
    email: formData.email || '',
    phone: formData.phone || '',
    year: formData.year || '',
    department: formData.department || '',
    participate_department: formData.participate_department || '',
    events_selected,
    additional_notes: formData.additional_notes || '',
    consent: !!formData.consent
  };
}
