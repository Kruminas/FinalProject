import React from 'react';
import MyJiraTickets from './MyJiraTickets';

export default function HelpPage() {
  const reporterEmail = localStorage.getItem('userEmail') || 'default@example.com';

  return (
    <div>
      <h1>Help Tickets</h1>
      <MyJiraTickets reporterEmail={reporterEmail} />
    </div>
  );
}