// src/services/formService.js
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api';

// Admin only - view all submitted forms
export async function fetchAllForms() {
  const token = getToken();
  const res = await fetch(`${API_URL}/forms`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch forms (admin only)');
  }
  return res.json(); // { forms: [...] }
}

// Submit answers (logged-in user)
export async function submitForm({ templateId, answers }) {
  const token = getToken();
  const res = await fetch(`${API_URL}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ templateId, answers }),
  });
  if (!res.ok) {
    throw new Error('Form submission failed');
  }
  return res.json();
}
