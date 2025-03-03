const express = require('express');
const router = express.Router();
const axios = require('axios');

// const INSTANCE_URL = 'https://intern5-dev-ed.develop.my.salesforce.com';

// const ACCESS_TOKEN = '00DWU00000JYaxP!AQEAQLmi3FKOMl2zSqB_rpwvVMClZmWrdLbiHFgsWiIH1mYjFAoOzLOJSPqNBuWxxK6nkIWnjH3elrsJuVjEn64opkxFRH2U';

const INSTANCE_URL = process.env.INSTANCE_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

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