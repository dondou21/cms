const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/givings', require('./routes/givings'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/events', require('./routes/events'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Church Management System API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // Nodemon will automatically restart and inject .env variables!
    console.log(`Server is running on port ${PORT}`);
});
