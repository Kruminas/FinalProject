const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const axios = require('axios');

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { sfAccountName, sfContactName, sfContactEmail } = req.body;
    const accessToken = process.env.SALESFORCE_ACCESS_TOKEN;
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
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
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;