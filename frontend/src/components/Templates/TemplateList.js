import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = '/api';

export default function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/templates`);
      if (!res.ok) throw new Error('Failed to fetch templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (templateId) => {
    try {
      if (!token) {
        alert('You must be logged in');
        return;
      }
      const res = await fetch(`${API_URL}/templates/${templateId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete template');
      alert('Template deleted');
      fetchTemplates();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (templateId) => {
    if (!token) {
      alert('You must be logged in');
      return;
    }
    navigate(`/templates/${templateId}/edit`);
  };

  return (
    <div className="container mt-4">
      <h2>Templates</h2>
      {token && (
        <Link to="/templates/create" className="btn btn-success mb-3">
          Create Template
        </Link>
      )}
      {templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        templates.map((tpl) => (
          <div key={tpl._id} className="border p-2 mb-2">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h4>{tpl.title}</h4>
                <p>{tpl.description}</p>
              </div>
              <small className="text-muted">
                Created by {tpl.author?.email || '(unknown)'}
              </small>
            </div>
            {token ? (
              <>
                <Link
                  to={`/templates/${tpl._id}/fill`}
                  className="btn btn-primary btn-sm me-2"
                >
                  Fill Out
                </Link>
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={() => handleEdit(tpl._id)}
                >
                  Edit Template
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(tpl._id)}
                >
                  Delete
                </button>
              </>
            ) : (
              <p>(Log in for more actions)</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}