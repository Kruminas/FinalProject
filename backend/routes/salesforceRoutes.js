const express = require('express');
const router = express.Router();
const axios = require('axios');

// Hardcode your known instance URL
// (This is okay for a quick test but not for production)
const INSTANCE_URL = 'https://intern5-dev-ed.develop.my.salesforce.com';

// Also, you’ll need a valid access token. Hardcoded tokens expire quickly, 
// but this might help you test the endpoint for now:
const ACCESS_TOKEN = '00DWU00000JYaxP!AQEAQLmi3FKOMl2zSqB_rpwvVMClZmWrdLbiHFgsWiIH1mYjFAoOzLOJSPqNBuWxxK6nkIWnjH3elrsJuVjEn64opkxFRH2U'; // The token you got from Postman/cURL

router.post('/create', async (req, res) => {
  try {
    const { sfAccountName } = req.body; // instead of accountName
    const response = await axios.post(
      `${INSTANCE_URL}/services/data/v57.0/sobjects/Account`,
      { Name: sfAccountName },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const accountId = response.data.id;
    res.json({ accountId, success: true });
  } catch (error) {
    console.error('Salesforce integration error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
