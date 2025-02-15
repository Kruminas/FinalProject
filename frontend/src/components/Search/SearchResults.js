/* src/components/Search/SearchResults.js */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q') || '';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/templates/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.templates || []);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  if (loading) {
    return <div className="container mt-4">Searching...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Search Results for: {q}</h2>
      {results.length === 0 ? (
        <p>No matching templates found.</p>
      ) : (
        results.map((tpl) => (
          <div key={tpl._id} className="border p-2 mb-2">
            <h4>{tpl.title}</h4>
            <p>{tpl.description}</p>
            <Link to={`/templates/${tpl._id}/fill`} className="btn btn-primary btn-sm">
              Fill Out
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
