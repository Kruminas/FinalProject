import React, { useEffect, useState } from 'react';

export default function MyJiraTickets({ reporterEmail }) {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchIssues() {
      try {
        const response = await fetch(
          `/api/jira/my-issues?reporterEmail=${encodeURIComponent(reporterEmail)}`
        );
        const data = await response.json();
        if (data.issues) {
          setIssues(data.issues);
        } else {
          setError(JSON.stringify(data.error));
        }
      } catch (err) {
        setError(err.toString());
      }
    }
    fetchIssues();
  }, [reporterEmail]);

  return (
    <div className="container mt-4">
      <h2>My Help Tickets</h2>
      {error && <div className="alert alert-danger">{error}</div>}
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