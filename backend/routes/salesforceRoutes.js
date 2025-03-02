const express = require('express');
const router = express.Router();
const axios = require('axios');

async function getSalesforceToken() {
  const tokenUrl = 'https://login.salesforce.com/services/oauth2/token'; 

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', process.env.SF_CONSUMER_KEY);
  params.append('client_secret', process.env.SF_CONSUMER_SECRET);
  params.append('username', process.env.SF_USERNAME);
  params.append('password', process.env.SF_PASSWORD);

  try {
    const response = await axios.post(tokenUrl, params);
    return {
      accessToken: response.data.access_token,
      instanceUrl: response.data.instance_url
    };
  } catch (error) {
    console.error('Error obtaining Salesforce token:', error.response?.data || error.message);
    throw error;
  }
}


router.post('/create', async (req, res) => {
  try {
    // const { sfAccountName, sfContactName, sfContactEmail } = req.body;
    const tokenData = await getSalesforceToken();
    const accessToken = tokenData.accessToken;
    const instanceUrl = tokenData.instanceUrl; 
    console.log("DEBUG SALESFORCE CREDS:", {
      SF_CONSUMER_KEY: process.env.SF_CONSUMER_KEY,
      SF_CONSUMER_SECRET: process.env.SF_CONSUMER_SECRET,
      SF_USERNAME: process.env.SF_USERNAME,
      SF_PASSWORD: process.env.SF_PASSWORD ? 'HIDDEN_' + process.env.SF_PASSWORD.length + '_CHARS' : 'NOT SET',
    });

    const { sfAccountName, sfContactName, sfContactEmail } = req.body;
    console.log("DEBUG SF DATA FROM FRONTEND:", { sfAccountName, sfContactName, sfContactEmail });

    const accountResp = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Account`,
      { Name: sfAccountName }, 
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const accountId = accountResp.data.id;

    const contactResp = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Contact`,
      { 
        LastName: sfContactName,
        Email: sfContactEmail,
        AccountId: accountId 
      }, 
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json({ accountId, contactId: contactResp.data.id });
  } catch (err) {
    console.error('Salesforce integration error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;