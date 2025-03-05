require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/ticket', async (req, res) => {
  try {
    const {
      JIRA_DOMAIN,
      JIRA_USER_EMAIL,
      JIRA_API_TOKEN,
      JIRA_PROJECT_KEY
    } = process.env;

    const { summary, description, link, priority } = req.body;

    const jiraAuthHeaders = {
      Authorization: `Basic ${Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    const formattedDescription = {
      type: 'doc',
      version: 1,
      content: [
      {
      type: 'paragraph',
      content: [
      {
      type: 'text',
      text: description || ''
      }
      ]
      },
      {
      type: 'paragraph',
      content: [
      {
      type: 'text',
      text: `Link: ${link}`
      }
      ]
      }
      ]
      };

    const issuePayload = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary,
        description: formattedDescription,
        issuetype: { name: 'Task' },
        priority: { name: priority }
      }
    };

    const response = await axios.post(
      `https://${JIRA_DOMAIN}/rest/api/3/issue`,
      issuePayload,
      { headers: jiraAuthHeaders }
    );

    const { key } = response.data;
    res.status(200).json({
      success: true,
      key,
      url: `https://${JIRA_DOMAIN}/browse/${key}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error?.response?.data || error.message
    });
  }
});

router.get('/my-issues', async (req, res) => {
  try {
    const {
      JIRA_DOMAIN,
      JIRA_USER_EMAIL,
      JIRA_API_TOKEN
    } = process.env;

    const { reporterEmail, startAt = 0, maxResults = 10 } = req.query;
    if (!reporterEmail) {
      return res.status(400).json({ error: 'reporterEmail query parameter is required' });
    }

    const jqlQuery = `reporter = "${reporterEmail}" ORDER BY created DESC`;
    const searchEndpoint = `https://${JIRA_DOMAIN}/rest/api/3/search?jql=${encodeURIComponent(jqlQuery)}&startAt=${startAt}&maxResults=${maxResults}`;

    const jiraHeaders = {
      Authorization: `Basic ${Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
      Accept: 'application/json'
    };

    const response = await axios.get(searchEndpoint, { headers: jiraHeaders });
    res.status(200).json({ issues: response.data.issues });
  } catch (error) {
    res.status(500).json({
      error: error?.response?.data || error.message
    });
  }
});

module.exports = router;