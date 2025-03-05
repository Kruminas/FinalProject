// frontend/src/components/Templates/CreateJiraTicket.js
import React, { useState, useEffect } from 'react';

export default function CreateJiraTicket() {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [ticketUrl, setTicketUrl] = useState('');
  const [error, setError] = useState('');
  const [issues, setIssues] = useState([]);

  // Get reporter email from auth; here we use localStorage as an example.
  const reporterEmail = localStorage.getItem('userEmail') || 'default@example.com';

  // Function to create a new Jira ticket
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setTicketUrl('');

    try {
      const res = await fetch('/api/jira/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          description,
          link: window.location.href,
          priority
        })
      });
      const data = await res.json();
      if (data.success) {
        setTicketUrl(data.url);
        // Refresh the tickets list after creation
        fetchIssues();
      } else {
        setError(JSON.stringify(data.error));
      }
    } catch (err) {
      setError(err.toString());
    }
  }

  // Function to fetch tickets for the logged-in reporter
  async function fetchIssues() {
    try {
      const res = await fetch(`/api/jira/my-issues?reporterEmail=${encodeURIComponent(reporterEmail)}`);
      const data = await res.json();
      if (data.issues) {
        setIssues(data.issues);
      } else {
        setError(JSON.stringify(data.error));
      }
    } catch (err) {
      setError(err.toString());
    }
  }

  useEffect(() => {
    fetchIssues();
  }, [reporterEmail]);

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2>Create Jira Ticket</h2>
      {ticketUrl && (
        <div className="alert alert-success">
          Ticket created! <a href={ticketUrl} target="_blank" rel="noopener noreferrer">{ticketUrl}</a>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <div className="mb-3">
          <label className="form-label">Summary</label>
          <input
            type="text"
            className="form-control"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief issue summary"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the issue"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Highest">Highest</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Lowest">Lowest</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Ticket
        </button>
      </form>

      <h3>My Tickets</h3>
      {issues.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Summary</th>
              <th>Status</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.key}</td>
                <td>{issue.fields.summary}</td>
                <td>{issue.fields.status && issue.fields.status.name}</td>
                <td>
                  <a
                    href={`https://${process.env.REACT_APP_JIRA_DOMAIN || 'dominykaskruminas.atlassian.net'}/browse/${issue.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}