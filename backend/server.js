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
app.use(cors({
  origin: 'https://finalproject-sjxn.onrender.com' // replace with your frontend URL if different
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://dominykaskruminas:vaperdude@dominykas.dwggl.mongodb.net/?retryWrites=true&w=majority&appName=dominykas',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// ================================
//         SERVE REACT BUILD
// ================================
const path = require("path");
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/forms', formRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
