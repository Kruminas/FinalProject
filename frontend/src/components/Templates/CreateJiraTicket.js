import React, { useState } from 'react';

export default function CreateJiraTicket() {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [ticketUrl, setTicketUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/jira/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          description,
          priority,
          link: window.location.href,
          reporterEmail: 'someuser@example.com',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTicketUrl(data.url);
        setError('');
      } else {
        setError(data.error || 'Failed to create a ticket');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create Jira Ticket</h1>

      {ticketUrl && (
        <p>
          Ticket created! You can view it here:{' '}
          <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
            {ticketUrl}
          </a>
        </p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Summary</label>
          <input
            type="text"
            className="form-control"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
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
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Ticket
        </button>
      </form>
    </div>
  );
}
