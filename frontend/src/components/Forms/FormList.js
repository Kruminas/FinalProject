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
        if (!res.ok) {
          throw new Error('Only admins can view this content');
        }
        const data = await res.json();
        setForms(data.forms || []);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, [token]);

  const getQuestionText = (formItem, questionId) => {
    if (!formItem.template?.questions) return '';
    const foundQ = formItem.template.questions.find(
      (q) => String(q._id) === String(questionId)
    );
    return foundQ ? foundQ.questionText : '(Unknown question)';
  };

  return (
    <Container className="mt-4">
      <h2>All Submitted Forms (Admin Only)</h2>
      {forms.length === 0 ? (
        <p>No forms found.</p>
      ) : (
        forms.map((formItem) => (
          <Card key={formItem._id} className="mb-3">
            <Card.Body>
              <Card.Title>User: {formItem.author?.email || '(unknown)'}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Template: {formItem.template?.title || '(no title)'}
              </Card.Subtitle>
              <Card.Text as="div">
                <h6>Answers:</h6>
                {formItem.answers.map((ans, idx) => {
                  const questionText = getQuestionText(formItem, ans.questionId);
                  return (
                    <div key={idx} className="border rounded p-2 mb-2">
                      <strong>Question:</strong> {questionText}
                      <br />
                      <strong>Answer:</strong>{' '}
                      {Array.isArray(ans.answer) ? ans.answer.join(', ') : ans.answer}
                    </div>
                  );
                })}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}