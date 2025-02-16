import { getToken } from './authService';
const API_URL = '/api';

export async function fetchAllForms() {
  const token = getToken();
  const res = await fetch(`${API_URL}/forms`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch forms');
  return res.json();
}

export async function submitForm({ templateId, answers }) {
  const token = getToken();
  const res = await fetch(`${API_URL}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ templateId, answers })
  });
  if (!res.ok) throw new Error('Form submission failed');
  return res.json();
}
