const mysql = require('mysql2/promise');
require('dotenv').config();

const dbPool = mysql.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });

exports.adminGetReservations = async (req, res) => {
    try {
        const [reservations] = await dbPool.query('SELECT * FROM Reservation ORDER BY reserve_time DESC');
        res.status(200).json({ status: 'success', data: { reservations } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch reservations.', error: err.message });
    }
};

exports.adminUpdateReservation = async (req, res) => {
    const { reservation_id } = req.params;
    const { status } = req.body;
    try {
        await dbPool.query('UPDATE Reservation SET status = ? WHERE id = ?', [status, reservation_id]);
        res.status(200).json({ status: 'success', message: 'Reservation status updated.' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to update reservation.', error: err.message });
    }
};

exports.adminGetReports = async (req, res) => {
    try {
        const [reports] = await dbPool.query('SELECT * FROM Report ORDER BY id DESC');
        res.status(200).json({ status: 'success', data: { reports } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch reports.', error: err.message });
    }
};

exports.adminUpdateReport = async (req, res) => {
    const { report_id } = req.params;
    const { status, response } = req.body;
    try {
        await dbPool.query('UPDATE Report SET status = ?, response = ? WHERE id = ?', [status, response, report_id]);
        res.status(200).json({ status: 'success', message: 'Report updated.' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to update report.', error: err.message });
    }
};
