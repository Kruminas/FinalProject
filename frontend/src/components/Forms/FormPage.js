/* src/components/Forms/FormPage.js */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function FormPage() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/forms/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Not authorized or form not found');
        const data = await res.json();
        setFormData(data.form);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, [id, token]);

  if (!formData) {
    return <div className="container mt-4">Loading form...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Form: {formData._id}</h2>
      <p>Answered by: {formData.author?.email}</p>
      <p>Template: {formData.template?.title}</p>
      <h4>Answers</h4>
      {formData.answers.map((ans, idx) => (
        <div key={idx} className="border p-2 mb-2">
          <strong>Question ID:</strong> {ans.questionId}
          <br />
          <strong>Answer:</strong>{' '}
          {Array.isArray(ans.answer) ? ans.answer.join(', ') : ans.answer}
        </div>
      ))}
    </div>
  );
}
