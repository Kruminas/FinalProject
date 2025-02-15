/* src/components/Forms/FormList.js */
import React, { useEffect, useState } from 'react';
import { Container, Card } from 'react-bootstrap';

const API_URL = '/api';

export default function FormList() {
  const [forms, setForms] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/forms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch forms (admin only)');
        const data = await res.json();
        setForms(data.forms || []);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, [token]);

  return (
    <Container className="mt-4">
      <h2>All Submitted Forms (Admin Only)</h2>
      {forms.length === 0 ? (
        <p>No forms found.</p>
      ) : (
        forms.map((f) => (
          <Card key={f._id} className="mb-3">
            <Card.Body>
              <Card.Title>Form ID: {f._id}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                User: {f.author?.email || '(unknown)'}
              </Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">
                Template: {f.template?.title || '(no title)'}
              </Card.Subtitle>
              <Card.Text as="div">
                <h6>Answers:</h6>
                {f.answers.map((ans, idx) => (
                  <div key={idx} className="border rounded p-2 mb-2">
                    <strong>Question ID:</strong> {ans.questionId}
                    <br />
                    <strong>Answer:</strong>{' '}
                    {Array.isArray(ans.answer) ? ans.answer.join(', ') : ans.answer}
                  </div>
                ))}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}
