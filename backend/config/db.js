const mysql = require('mysql2/promise');
require('dotenv').config();

const dbPool = mysql.createPool({ 
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    timezone: 'Z',
    charset: 'utf8mb4'

});

module.exports = dbPool;
