import { getToken } from './authService';
const API_URL = '/api';

export async function fetchTemplates() {
  const res = await fetch(`${API_URL}/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function createTemplate(templateData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(templateData)
  });
  if (!res.ok) throw new Error('Failed to create template');
  return res.json();
}
