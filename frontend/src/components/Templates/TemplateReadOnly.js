import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = '/api';

export default function TemplateReadOnly() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/templates/${id}`);
        if (!res.ok) throw new Error('Failed to load template');
        const data = await res.json();
        setTemplate(data.template);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  if (error) {
    return <div className="container mt-4">Error: {error}</div>;
  }
  if (!template) {
    return <div className="container mt-4">Loading template...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{template.title}</h2>
      <p>{template.description}</p>
      <h4>Questions (Read-Only)</h4>
      {template.questions.map((q, idx) => (
        <div key={idx} className="mb-3">
          <strong>{q.questionText}</strong> - <em>{q.type}</em>
          {['multiple-choice', 'checkbox'].includes(q.type) && q.options && (
            <ul>
              {q.options.map((opt, oIdx) => (
                <li key={oIdx}>{opt}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <hr />
      <h4>Comments</h4>
      {!template.comments || template.comments.length === 0 ? (
        <p>No comments.</p>
      ) : (
        template.comments.map((c, idx) => (
          <div key={idx} className="border p-2 mb-2">
            <strong>{c.author?.email || 'Unknown'}:</strong> {c.content}
          </div>
        ))
      )}
    </div>
  );
}