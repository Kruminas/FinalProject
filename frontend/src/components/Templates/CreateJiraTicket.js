import React, { useState } from 'react';

export default function CreateJiraTicket() {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/jira/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          description,
          link: window.location.href
        })
      });
      const data = await res.json();
      if (data.success) {
        setTicketUrl(data.url);
        setError('');
      } else {
        setError(JSON.stringify(data.error));
      }
    } catch (err) {
      setError(err.toString());
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Jira Ticket</h1>
      {ticketUrl && (
        <p>
          Created: <a href={ticketUrl}>{ticketUrl}</a>
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Summary</label>
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
}