/* src/components/Templates/FillForm.js */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function FillForm() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/templates/${id}`);
        if (!res.ok) throw new Error('Failed to load template');
        const data = await res.json();
        setTemplate(data.template);
        if (data.template.questions) {
          setAnswers(data.template.questions.map(() => ''));
        }
      } catch (err) {
        alert(err.message);
      }
    })();
  }, [id]);

  const handleTextChange = (qIdx, value) => {
    const updated = [...answers];
    updated[qIdx] = value;
    setAnswers(updated);
  };

  const handleRadioChange = (qIdx, option) => {
    const updated = [...answers];
    updated[qIdx] = option;
    setAnswers(updated);
  };

  const handleCheckboxChange = (qIdx, option, checked) => {
    const arr = Array.isArray(answers[qIdx]) ? answers[qIdx] : [];
    const updated = [...answers];
    if (checked) {
      updated[qIdx] = [...arr, option];
    } else {
      updated[qIdx] = arr.filter((o) => o !== option);
    }
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in');
      return;
    }
    if (!template) return;
    const finalAnswers = template.questions.map((q, idx) => ({
      questionId: q._id,
      answer: answers[idx]
    }));
    try {
      const res = await fetch(`${API_URL}/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          templateId: template._id,
          answers: finalAnswers
        })
      });
      if (!res.ok) throw new Error('Submission failed');
      alert('Form submitted');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!template) {
    return <div className="container mt-4">Loading template...</div>;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h2>{template.title}</h2>
      <p>{template.description}</p>
      <form onSubmit={handleSubmit}>
        {template.questions.map((q, qIdx) => (
          <div key={q._id} className="mb-3">
            <label className="form-label">
              {q.questionText}
            </label>
            {q.type === 'text' && (
              <input
                type="text"
                className="form-control"
                value={answers[qIdx]}
                onChange={(e) => handleTextChange(qIdx, e.target.value)}
              />
            )}
            {q.type === 'number' && (
              <input
                type="number"
                className="form-control"
                value={answers[qIdx]}
                onChange={(e) => handleTextChange(qIdx, e.target.value)}
              />
            )}
            {q.type === 'radio' && q.options && (
              <div>
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx}>
                    <input
                      type="radio"
                      name={`q-${q._id}`}
                      value={opt}
                      checked={answers[qIdx] === opt}
                      onChange={() => handleRadioChange(qIdx, opt)}
                    />
                    <label className="ms-2">{opt}</label>
                  </div>
                ))}
              </div>
            )}
            {q.type === 'multiple-choice' && q.options && (
              <select
                className="form-select"
                value={answers[qIdx]}
                onChange={(e) => handleTextChange(qIdx, e.target.value)}
              >
                <option value="">--Select an option--</option>
                {q.options.map((opt, optIdx) => (
                  <option key={optIdx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {q.type === 'checkbox' && q.options && (
              <div>
                {q.options.map((opt, optIdx) => {
                  const arr = Array.isArray(answers[qIdx]) ? answers[qIdx] : [];
                  return (
                    <div key={optIdx}>
                      <input
                        type="checkbox"
                        checked={arr.includes(opt)}
                        onChange={(e) => handleCheckboxChange(qIdx, opt, e.target.checked)}
                      />
                      <label className="ms-2">{opt}</label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
