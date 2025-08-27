const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dbPool = require('../config/db');
require('dotenv').config();

exports.protect = async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'You are not logged in. Please log in to get access.' });
    }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const [rows] = await dbPool.query('SELECT * FROM User WHERE id = ?', [decoded.id]);
        const currentUser = rows[0];
        
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in again.' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action.' });
        }
        next();
    };
};
