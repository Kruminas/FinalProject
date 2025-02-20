import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = '/api';

export default function TemplatePage() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/templates/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load template');
        const data = await res.json();
        setTemplate(data.template);
        setTitle(data.template.title || '');
        setDescription(data.template.description || '');
        setQuestions(data.template.questions || []);
      } catch (err) {
        alert(err.message);
        navigate('/');
      }
    })();
  }, [id, token, navigate]);

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', type: 'text', options: [] }]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleQuestionTypeChange = (index, newType) => {
    const updated = [...questions];
    updated[index].type = newType;
    if (['multiple-choice', 'checkbox'].includes(newType) && !updated[index].options) {
      updated[index].options = [''];
    }
    setQuestions(updated);
  };

  const addOption = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIdx, optIdx) => {
    const updated = [...questions];
    updated[qIdx].options.splice(optIdx, 1);
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, optIdx, newValue) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = newValue;
    setQuestions(updated);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, questions })
      });
      if (!res.ok) throw new Error('Failed to update template');
      alert('Template updated');
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
      <h2>Edit Template</h2>
      <div className="mb-3">
        <label>Title</label>
        <input
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Description</label>
        <input
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <h4>Questions</h4>
      {questions.map((q, idx) => (
        <div key={idx} className="border p-2 mb-2">
          <div className="mb-2">
            <label>Question Text</label>
            <input
              className="form-control"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>Type</label>
            <select
              className="form-select"
              value={q.type}
              onChange={(e) => handleQuestionTypeChange(idx, e.target.value)}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>
          {['multiple-choice', 'checkbox'].includes(q.type) && (
            <div className="mb-2">
              <h6>Options</h6>
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="d-flex mb-2">
                  <input
                    className="form-control me-2"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeOption(idx, optIdx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={() => addOption(idx)}>
                Add Option
              </button>
            </div>
          )}
          <button
            type="button"
            className="btn btn-outline-danger mt-2"
            onClick={() => removeQuestion(idx)}
          >
            Remove Question
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary mb-3" onClick={addQuestion}>
        Add Question
      </button>
      <br />
      <button className="btn btn-primary" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}