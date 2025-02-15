// src/services/templateService.js
import { getToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalproject-sjxn.onrender.com';

export async function fetchTemplates() {
  const res = await fetch(`${API_URL}/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

// Create new template (admin only)
export async function createTemplate(templateData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(templateData),
  });
  if (!res.ok) {
    throw new Error('Failed to create template (admin only)');
  }
  return res.json();
}
