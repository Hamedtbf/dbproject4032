const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redisClient = require('../config/redisClient');
require('dotenv').config();

const dbPool = mysql.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    };
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({ status: 'success', token, data: { user } });
};

exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, city, balance } = req.body;
    if (!firstName || !lastName || !email || !password || !city || balance === undefined) {
        return res.status(400).json({ status: 'fail', message: 'Please provide all required fields.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = { firstName, lastName, email, password: hashedPassword, city, balance };
        const [result] = await dbPool.query('INSERT INTO User SET ?', newUser);
        const insertedUser = { id: result.insertId, ...newUser, role: 'customer' };
        createSendToken(insertedUser, 201, res);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: 'fail', message: 'Email already exists.' });
        }
        res.status(500).json({ status: 'error', message: 'Could not sign up user.', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: 'fail', message: 'Please provide email and password.' });
    }
    try {
        const [rows] = await dbPool.query('SELECT * FROM User WHERE email = ?', [email]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });
        }
        const otp = generateOTP();
        const otpTTL = parseInt(process.env.OTP_TTL_SECONDS);
        await redisClient.setEx(`otp:${user.id}`, otpTTL, otp);
        console.log(`OTP for user ${user.email} is: ${otp} (valid for ${otpTTL / 60} minutes)`);
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'An error occurred during login.', error: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const [rows] = await dbPool.query('SELECT id, role FROM User WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found.' });
        }
        const storedOtp = await redisClient.get(`otp:${user.id}`);
        if (storedOtp === otp) {
            await redisClient.del(`otp:${user.id}`);
            res.status(200).json({ status: 'success', message: 'OTP verified.', data: { role: user.role } });
        } else {
            res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP.' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'An error occurred during OTP verification.', error: err.message });
    }
};