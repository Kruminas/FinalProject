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
    const jiraAuth = {
      Authorization: `Basic ${Buffer.from(
        `${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`
      ).toString('base64')}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    const issueData = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  text: `${description}\n\nLink: ${link}`,
                  type: 'text'
                }
              ]
            }
          ]
        },
        issuetype: { name: 'Task' },
        priority: { name: priority }
      }
    };

    const response = await axios.post(
      `https://${JIRA_DOMAIN}/rest/api/3/issue`,
      issueData,
      { headers: jiraAuth }
    );

    const { key } = response.data;
    return res.status(200).json({
      success: true,
      key,
      url: `https://${JIRA_DOMAIN}/browse/${key}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.response?.data || error.message
    });
  }
});

module.exports = router;
