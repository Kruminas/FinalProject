const express = require('express');
const router = express.Router();
const axios = require('axios');



router.post('/create', async (req, res) => {
  try {
    const { sfAccountName } = req.body;
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