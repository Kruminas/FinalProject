const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const axios = require('axios');

async function getSalesforceToken() {
  const tokenUrl = 'https://login.salesforce.com/services/oauth2/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', '3MVG9PwZx9R6_UrcKYlyiu2MkjBqKr0JGmvk0X1vQgJxhrZq_tks_em2IIROyEBB3RD0nHFdVJVOFu2Qk3b1l');
  params.append('client_secret', '98FF6C42C5689CB517D34E94A7C29C9A8D0868FD00F524D3654CB64526C90B0F');
  params.append('username', 'dominykas.kruminas@gmail.com');
  params.append('password', process.env.SF_PASSWORD);

  try {
    const response = await axios.post(tokenUrl, params);
    console.log('Salesforce token response:', response.data);
    return { accessToken: response.data.access_token, instanceUrl: response.data.instance_url };
  } catch (error) {
    console.error('Error obtaining Salesforce token:', error.response?.data || error.message);
    throw error;
  }
}

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { sfAccountName, sfContactName, sfContactEmail } = req.body;
    const tokenData = await getSalesforceToken();
    const accessToken = tokenData.accessToken;
    const instanceUrl = tokenData.instanceUrl; 

    const accountResp = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Account`,
      { Name: sfAccountName },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const accountId = accountResp.data.id;

    const contactResp = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Contact`,
      { LastName: sfContactName, Email: sfContactEmail, AccountId: accountId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json({ accountId, contactId: contactResp.data.id });
  } catch (err) {
    console.error('Salesforce integration error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;