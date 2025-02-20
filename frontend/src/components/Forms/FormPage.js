import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

const API_URL = '/api';

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
        if (!res.ok) throw new Error('Failed to fetch form');
        const data = await res.json();
        setFormData(data.form);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, [id, token]);

  if (!formData) {
    return <Container className="mt-4">Loading form...</Container>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          {/* <Card.Title>Form ID: {formData._id}</Card.Title> */}
          <Card.Subtitle className="mb-2 text-muted">
            User: {formData.author?.email || '(unknown)'}
          </Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">
            Template: {formData.template?.title || '(no title)'}
          </Card.Subtitle>
          <Card.Text as="div">
            <h6>Answers:</h6>
            {formData.answers.map((ans, idx) => (
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
    </Container>
  );
}