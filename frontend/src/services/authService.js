// src/services/authService.js
const API_URL = 'http://localhost:5000/api'; // Adjust if needed

// Register new user
export async function registerUser({ username, email, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    throw new Error('Registration failed');
  }
  return res.json();
}

// Login existing user, store token in localStorage
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logoutUser() {
  localStorage.removeItem('token');
}
