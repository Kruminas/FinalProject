// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-light px-3">
      <Link to="/" className="navbar-brand">FormsApp</Link>
      <form onSubmit={handleSearch} className="d-flex ms-2 me-auto">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search templates..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
      <div className="navbar-nav">
        {!token ? (
          <>
            <Link to="/login" className="nav-item nav-link">Login</Link>
            <Link to="/register" className="nav-item nav-link">Register</Link>
          </>
        ) : (
          <>
            <Link to="/forms" className="nav-item nav-link">All Forms (Admin)</Link>
            <Link to="/admin/users" className="nav-item nav-link">Manage Users (Admin)</Link>
            <button className="btn btn-link nav-item nav-link" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
