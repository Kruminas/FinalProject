const express = require('express');
const router = express.Router();
const axios = require('axios');


async function getSalesforceToken() {

  const tokenUrl = 'https://intern5-dev-ed.develop.my.salesforce.com '; 

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
    const tokenData = await getSalesforceToken();
    const accessToken = tokenData.accessToken;
    const instanceUrl = tokenData.instanceUrl; 

    const { accountName } = req.body;

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
    res.json({ accountId, success: true });

  } catch (error) {
    console.error('Error creating Account in Salesforce:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;