// src/services/templateService.js
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api';

// Fetch all templates
export async function fetchTemplates() {
  const res = await fetch(`${API_URL}/templates`);
  if (!res.ok) {
    throw new Error('Could not fetch templates');
  }
  return res.json(); // { templates: [...] }
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
