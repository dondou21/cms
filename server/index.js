const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins since it's a local desktop web wrapper
app.use(helmet());
app.use(morgan('dev'));

const { authenticate } = require('./middleware/auth');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', authenticate, require('./routes/users'));

// Protected Routes
app.use('/api/members', authenticate, require('./routes/members'));
app.use('/api/departments', authenticate, require('./routes/departments'));
app.use('/api/givings', authenticate, require('./routes/givings'));
app.use('/api/attendance', authenticate, require('./routes/attendance'));
app.use('/api/events', authenticate, require('./routes/events'));
app.use('/api/reports', authenticate, require('./routes/reports'));
app.use('/api/service-reports', authenticate, require('./routes/serviceReports'));
app.use('/api/service-orders', authenticate, require('./routes/serviceOrders'));
app.use('/api/finance', authenticate, require('./routes/finance'));

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
