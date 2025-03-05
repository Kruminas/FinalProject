import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';

export default function CreateTemplate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', type: 'text', options: [] }]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', type: 'text', options: [] }]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
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

  const handleOptionChange = (qIdx, optIdx, val) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = val;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, questions })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to create template');
      }
      alert('Template was created');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h2>Create Template</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addOption(idx)}
                >
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
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
}