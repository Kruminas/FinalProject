import React, { useState } from 'react';

export default function CreateJiraTicket() {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [ticketUrl, setTicketUrl] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setTicketUrl('');
    setError('');

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
      } else {
        setError(JSON.stringify(data.error));
      }
    } catch (err) {
      setError(err.toString());
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2>Create Jira Ticket</h2>
      {ticketUrl && (
        <div className="alert alert-success">
          Ticket created! <a href={ticketUrl}>{ticketUrl}</a>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card card-body">
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
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}