import React, { useState, useEffect } from 'react';

export default function TicketCreator() {
  const [ticketSummary, setTicketSummary] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [createdTicketUrl, setCreatedTicketUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ticketList, setTicketList] = useState([]);

  const reporterEmail = localStorage.getItem('userEmail') || 'esu@example.com';

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setCreatedTicketUrl('');

    try {
      const response = await fetch('/api/jira/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: ticketSummary,
          description: ticketDescription,
          link: window.location.href,
          priority: ticketPriority,
        }),
      });
      const result = await response.json();

      if (result.success) {
        setCreatedTicketUrl(result.url);
        refreshTicketList();
      } else {
        setErrorMessage(JSON.stringify(result.error));
      }
    } catch (error) {
      setErrorMessage(error.toString());
    }
  };

  const refreshTicketList = async () => {
    try {
      const response = await fetch(
        `/api/jira/my-issues?reporterEmail=${encodeURIComponent(reporterEmail)}`
      );
      const result = await response.json();

      if (result.issues) {
        setTicketList(result.issues);
      } else {
        setErrorMessage(JSON.stringify(result.error));
      }
    } catch (error) {
      setErrorMessage(error.toString());
    }
  };

  useEffect(() => {
    refreshTicketList();
  }, [reporterEmail]);

  return (
    <div
      style={{
        backgroundImage:
          'url(https://wallpapers.com/images/hd/atlassian-4dixoy21826q0dz1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        className="container mt-4"
        style={{
          maxWidth: 600,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <h2>Create Jira Ticket</h2>

        {createdTicketUrl && (
          <div className="alert alert-success">
            Ticket created!{' '}
            <a href={createdTicketUrl} target="_blank" rel="noopener noreferrer">
              {createdTicketUrl}
            </a>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form onSubmit={onFormSubmit} className="card card-body mb-4">
          <div className="mb-3">
            <label className="form-label">Summary</label>
            <input
              type="text"
              className="form-control"
              value={ticketSummary}
              onChange={(e) => setTicketSummary(e.target.value)}
              placeholder="Enter a brief summary"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Provide a detailed description"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={ticketPriority}
              onChange={(e) => setTicketPriority(e.target.value)}
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
        {ticketList.length === 0 ? (
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
              {ticketList.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.key}</td>
                  <td>{ticket.fields.summary}</td>
                  <td>
                    {ticket.fields.status && ticket.fields.status.name}
                  </td>
                  <td>
                    <a
                      href={`https://${process.env.REACT_APP_JIRA_DOMAIN ||
                        'dominykaskruminas.atlassian.net'}/browse/${ticket.key}`}
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
    </div>
  );
}
