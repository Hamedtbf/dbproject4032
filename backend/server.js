const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const authRouter = require('./routes/authRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8080', // The origin of your Angular app
  credentials: true, // This allows cookies to be sent
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// --- 4. Mount Routers ---
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test DB connection
        const dbPool = mysql.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
        await dbPool.query('SELECT 1');
        console.log('✅ MySQL Database connected successfully.');

        require('./config/redisClient');
        console.log('✅ Redis connection initiated.');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
