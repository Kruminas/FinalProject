import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [liked, setLiked] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Could not load profile');
        const data = await res.json();
        setUser(data.user);
        setTemplates(data.templates);
        setForms(data.forms);
        setLiked(data.liked);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  return (
    <Container className="mt-4">
      <h2>User Profile</h2>
      {user && (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <Tabs defaultActiveKey="templates" id="user-profile-tabs" className="mb-3">
        <Tab eventKey="templates" title="My Templates">
          {templates.length === 0 ? (
            <p>No templates created yet.</p>
          ) : (
            templates.map((tpl) => (
              <div key={tpl._id} className="mb-3">
                <h4>{tpl.title}</h4>
                <p>{tpl.description}</p>
              </div>
            ))
          )}
        </Tab>
        <Tab eventKey="forms" title="My Filled Forms">
          {forms.length === 0 ? (
            <p>No forms filled yet.</p>
          ) : (
            forms.map((frm) => (
              <div key={frm._id} className="mb-3">
                <h4>Template: {frm.template?.title}</h4>
                <p>Submitted on: {new Date(frm.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </Tab>
        <Tab eventKey="liked" title="Liked Templates">
          {liked.length === 0 ? (
            <p>No liked templates.</p>
          ) : (
            liked.map((l) => (
              <div key={l._id} className="mb-3">
                <h4>{l.title}</h4>
                <p>{l.description}</p>
              </div>
            ))
          )}
        </Tab>
      </Tabs>
    </Container>
  );
} 