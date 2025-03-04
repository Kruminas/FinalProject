const express = require('express');
const axios = require('axios');

const router = express.Router();

// Read environment variables
const {
  JIRA_DOMAIN,
  JIRA_USER_EMAIL,
  JIRA_API_TOKEN,
  JIRA_PROJECT_KEY
} = process.env;

// Basic auth header for Jira
const jiraAuthHeader = {
  Authorization: `Basic ${Buffer.from(
    `${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`
  ).toString('base64')}`,
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

// POST /api/jira/ticket
router.post('/ticket', async (req, res) => {
  try {
    // These fields come from the client (React) when a user wants to create a ticket
    const { summary, description, priority, link, reporterEmail } = req.body;

    // (Optional) If you need to create a new Jira user first:
    // 1. Check if the user exists
    // 2. If not, create them
    //    await createJiraUserIfNeeded(reporterEmail);

    // Construct the payload for creating an issue
    const issueData = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary,
        description: `${description}\n\nLink to original page: ${link}`,
        issuetype: { name: 'Task' }, // or "Bug", "Story", etc.
        priority: { name: priority } // "High", "Medium", "Low", etc.
        // If you want to set the reporter explicitly:
        // reporter: { emailAddress: reporterEmail },
      }
    };

    const response = await axios.post(
      `https://${JIRA_DOMAIN}/rest/api/3/issue`,
      issueData,
      { headers: jiraAuthHeader }
    );

    // Jira returns the created issue data with a key like "HELP-123"
    const { key } = response.data;
    const issueUrl = `https://${JIRA_DOMAIN}/browse/${key}`;
    res.status(200).json({
      success: true,
      key,
      url: issueUrl
    });
  } catch (error) {
    console.error('Error creating Jira issue:', error?.response?.data || error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/jira/my-issues?email=<reporterEmail>&startAt=0&maxResults=10
router.get('/my-issues', async (req, res) => {
    const { email, startAt = 0, maxResults = 10 } = req.query;
  
    // JQL to find issues reported by a specific user, e.g. reporter = userEmail
    // You can also filter statuses, etc.
    const jql = `reporter = "${email}" ORDER BY created DESC`;
  
    try {
      const searchUrl = `https://${JIRA_DOMAIN}/rest/api/3/search?jql=${encodeURIComponent(
        jql
      )}&startAt=${startAt}&maxResults=${maxResults}`;
  
      const response = await axios.get(searchUrl, { headers: jiraAuthHeader });
  
      res.status(200).json({
        issues: response.data.issues,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching Jira issues:', error?.response?.data || error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

module.exports = router;
