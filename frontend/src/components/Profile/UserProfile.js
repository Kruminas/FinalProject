import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';

const UserProfile = () => {
  const [templates] = useState([]);
  const [forms] = useState([]);


  return (
    <Container className="mt-4">
      <h2>User Profile</h2>
      <Tabs defaultActiveKey="templates" id="user-profile-tabs" className="mb-3">
        <Tab eventKey="templates" title="My Templates">
          {templates.length === 0 ? (
            <p>No templates created yet.</p>
          ) : (
            <div>
              {templates.map((template) => (
                <div key={template.id} className="mb-3">
                  <h4>{template.title}</h4>
                  <p>{template.description}</p>
                </div>
              ))}
            </div>
          )}
        </Tab>
        <Tab eventKey="forms" title="My Filled Forms">
          {forms.length === 0 ? (
            <p>No forms filled yet.</p>
          ) : (
            <div>
              {forms.map((form) => (
                <div key={form.id} className="mb-3">
                  <h4>{form.templateTitle}</h4>
                  <p>Filled at: {form.filledAt}</p>
                </div>
              ))}
            </div>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserProfile;
