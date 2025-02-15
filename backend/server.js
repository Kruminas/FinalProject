// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'https://finalproject-sjxn.onrender.com' }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const authRoutes = require('./routes/authRoutes');
const templateRoutes = require('./routes/templateRoutes');
const formRoutes = require('./routes/formRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/admin', adminRoutes);

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
