const express = require('express');
const axios = require('axios');

const router = express.Router();

const {
  JIRA_DOMAIN,
  JIRA_USER_EMAIL,
  JIRA_API_TOKEN,
  JIRA_PROJECT_KEY
} = process.env;

const jiraAuthHeader = {
  Authorization: `Basic ${Buffer.from(
    `${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`
  ).toString('base64')}`,
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

router.post('/ticket', async (req, res) => {
  try {
    const { summary, description, priority, link, reporterEmail } = req.body;

    const issueData = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary,
        description: `${description}\n\nLink to original page: ${link}`,
        issuetype: { name: 'Task' },
        priority: { name: priority } 
,
      }
    };

    const response = await axios.post(
      `https://${process.env.JIRA_DOMAIN}/rest/api/3/issue`,
      issueData,
      { headers: jiraAuthHeader }
    );

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

router.get('/my-issues', async (req, res) => {
    const { email, startAt = 0, maxResults = 10 } = req.query;

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