import React, { useEffect, useState } from 'react';

export default function TicketOverview({ reporterEmail }) {
  const [ticketData, setTicketData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch(
          `/api/jira/my-issues?reporterEmail=${encodeURIComponent(reporterEmail)}`
        );
        const result = await response.json();
        if (result.issues) {
          setTicketData(result.issues);
        } else {
          setErrorMessage(JSON.stringify(result.error));
        }
      } catch (error) {
        setErrorMessage(error.toString());
      }
    }
    loadTickets();
  }, [reporterEmail]);

  return (
    <div className="container mt-4">
      <h2>My Help Tickets</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {ticketData.length === 0 ? (
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
            {ticketData.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.key}</td>
                <td>{ticket.fields.summary}</td>
                <td>{ticket.fields.status && ticket.fields.status.name}</td>
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
  );
}