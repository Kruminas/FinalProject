const express = require('express');
const router = express.Router();
const axios = require('axios');

async function getSalesforceToken() {
  const tokenUrl = 'https://itransition-2a-dev-ed.develop.my.salesforce.com/services/oauth2/token'; 

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


router.post('/createAccount', async (req, res) => {
  try {
    // Suppose you've just acquired your accessToken and instanceUrl
    const accessToken = '00DWU00000JYaxP!AQEAQPQZLG_w0uOGHiP8pAy8wXEm3Ab1f7doDqn840LonArYbGVB4dpFa3e7hg7BUPf.QCG9bSQG2KWN0d4YQYuWrlveo54O';  // example only
    const instanceUrl = 'https://intern5-dev-ed.develop.my.salesforce.com';

    const { accountName } = req.body; // e.g., "My New Account"

    // Create an Account in Salesforce
    const accountResp = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Account`,
      { Name: accountName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const accountId = accountResp.data.id;
    console.log('Created Account:', accountId);

    // Respond to the client
    res.json({ accountId, success: true });
  } catch (error) {
    console.error('Error creating Account in Salesforce:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;