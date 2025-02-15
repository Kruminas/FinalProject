// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Route files
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const templateRoutes = require('./routes/templateRoutes');
const formRoutes = require('./routes/formRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://dominykaskruminas:vaperdude@dominykas.dwggl.mongodb.net/?retryWrites=true&w=majority&appName=dominykas',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const path = require("path");

app.use(express.static(path.join(__dirname, "../Frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/build", "index.html"));
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/forms', formRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
