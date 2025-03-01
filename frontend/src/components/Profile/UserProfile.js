import React, { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Button } from 'react-bootstrap';

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [likedTemplates, setLikedTemplates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load user data');
        const data = await res.json();
        setUserInfo(data.user);
        setTemplates(data.templates);
        setForms(data.forms);
        setLikedTemplates(data.liked);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>User Profile</h2>
        <Button variant="info" onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? 'Hide Info' : 'Show Info'}
        </Button>
      </div>

      {showInfo && userInfo && (
        <div className="mb-4">
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
        </div>
      )}

      <Tabs defaultActiveKey="templates" id="user-profile-tabs" className="mb-3">
        <Tab eventKey="templates" title="My Templates">
          {templates.length === 0 ? (
            <p>No templates created yet.</p>
          ) : (
            templates.map((template) => (
              <div key={template._id} className="mb-3">
                <h4>{template.title}</h4>
                <p>{template.description}</p>
              </div>
            ))
          )}
        </Tab>

        <Tab eventKey="forms" title="My Filled Forms">
          {forms.length === 0 ? (
            <p>No forms filled yet.</p>
          ) : (
            forms.map((form) => (
              <div key={form._id} className="mb-3">
                <h4>Form for Template: {form.template?.title}</h4>
                <p>Filled at: {new Date(form.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </Tab>

        <Tab eventKey="liked" title="Liked Templates">
          {likedTemplates.length === 0 ? (
            <p>No liked templates.</p>
          ) : (
            likedTemplates.map((tpl) => (
              <div key={tpl._id} className="mb-3">
                <h4>{tpl.title}</h4>
                <p>{tpl.description}</p>
              </div>
            ))
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}
