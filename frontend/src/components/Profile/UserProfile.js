import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [liked, setLiked] = useState([]);
  const [sfAccountName, setSfAccountName] = useState('');
  const [sfContactName, setSfContactName] = useState('');
  const [sfContactEmail, setSfContactEmail] = useState('');
  const [showSfForm, setShowSfForm] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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

  const handleCreateSF = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/salesforce/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sfAccountName, sfContactName, sfContactEmail })
      });
      if (!res.ok) throw new Error('Failed to send info to Salesforce');
      alert('Information sent to Salesforce successfully');
      setShowSfForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>User Profile</h2>
      {user && (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <Button variant="info" onClick={() => setShowSfForm(!showSfForm)}>
        {showSfForm ? 'Hide Salesforce Form' : 'Show Salesforce Form'}
      </Button>
      {showSfForm && (
        <form onSubmit={handleCreateSF} className="mt-3">
          <div className="mb-2">
            <label>SF Account Name</label>
            <input
              className="form-control"
              value={sfAccountName}
              onChange={(e) => setSfAccountName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>SF Contact Name</label>
            <input
              className="form-control"
              value={sfContactName}
              onChange={(e) => setSfContactName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>SF Contact Email</label>
            <input
              className="form-control"
              type="email"
              value={sfContactEmail}
              onChange={(e) => setSfContactEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="primary">Send to Salesforce</Button>
        </form>
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