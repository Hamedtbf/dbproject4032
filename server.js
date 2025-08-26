/*
 * =================================================================
 * Main Server File: server.js
 * =================================================================
 * This file initializes the server, connects to the databases,
 * and mounts the routers. All logic is in other files.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const redis = require('redis');
require('dotenv').config();

// --- 1. Import Routers ---
const authRouter = require('./routes/authRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const adminRouter = require('./routes/adminRoutes');

// --- 2. Initialize Express App ---
const app = express();

// --- 3. Global Middleware ---
app.use(cors({
    origin: 'http://localhost:4200', // Allow Angular front-end
    credentials: true
}));
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies

// --- 4. Mount Routers ---
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);

// --- 5. Server Initialization ---
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test DB connection
        const dbPool = mysql.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
        await dbPool.query('SELECT 1');
        console.log('✅ MySQL Database connected successfully.');

        // Connect to Redis
        const redisClient = redis.createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
        await redisClient.connect();
        console.log('✅ Redis connected successfully.');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
