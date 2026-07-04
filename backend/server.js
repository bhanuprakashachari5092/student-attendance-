const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const students = require('./src/routes/students');
const attendance = require('./src/routes/attendance');
const marks = require('./src/routes/marks');

// Mount routers
app.use('/api/v1/students', students);
app.use('/api/v1/attendance', attendance);
app.use('/api/v1/marks', marks);

// Basic route
app.get('/', (req, res) => {
  res.send('Attendance API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
