const mysql = require('mysql2/promise');
const redisClient = require('../config/redisClient');
require('dotenv').config();

const dbPool = mysql.createPool({ 
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    timezone: 'Z' // This forces all connections to use UTC
});

exports.getProfile = async (req, res) => {
    const userProfile = { ...req.user };
    userProfile.password = undefined; 
    res.status(200).json({
        status: 'success',
        data: {
            user: userProfile
        }
    });
};

exports.editProfile = async (req, res) => {
    const { firstName, lastName, email, city, password } = req.body;
    const updateFields = {};

    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (city) updateFields.city = city;
    if (password) {
        updateFields.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ status: 'fail', message: 'No fields to update provided.' });
    }
    try {
        await dbPool.query('UPDATE User SET ? WHERE id = ?', [updateFields, req.user.id]);
        res.status(200).json({ status: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: 'fail', message: 'This email is already in use by another account.' });
        }
        res.status(500).json({ status: 'error', message: 'Failed to update profile.', error: err.message });
    }
};

exports.getCities = async (req, res) => {
    try {
        const [sources] = await dbPool.query('SELECT DISTINCT source FROM Ticket');
        const [destinations] = await dbPool.query('SELECT DISTINCT destination FROM Ticket');
        const sourceCities = sources.map(s => s.source);
        const destCities = destinations.map(d => d.destination);
        const allCities = [...new Set([...sourceCities, ...destCities])].sort();
        res.status(200).json({ status: 'success', data: { cities: allCities } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch cities.', error: err.message });
    }
};

exports.getTickets = async (req, res) => {
    const queryParams = req.query;
    const cacheKey = `tickets:${JSON.stringify(queryParams)}`;
    try {
        const cachedResults = await redisClient.get(cacheKey);
        // if (cachedResults) {
        //     return res.status(200).json({ status: 'success', source: 'cache', data: JSON.parse(cachedResults) });
        // }
        let sql = 'SELECT T.*, C.name as company_name, CL.name as class_name FROM Ticket T JOIN Company C ON T.company_id = C.id JOIN Class CL ON T.class_id = CL.id WHERE T.remaining_cap > 0';
        const params = [];
        if (queryParams.source) { sql += ' AND T.source = ?'; params.push(queryParams.source); }
        if (queryParams.destination) { sql += ' AND T.destination = ?'; params.push(queryParams.destination); }
        if (queryParams.departure_date) { sql += ' AND T.departure_date = ?'; params.push(queryParams.departure_date); }
        if (queryParams.vehicle_type) { sql += ' AND T.vehicle_type = ?'; params.push(queryParams.vehicle_type); }
        const [tickets] = await dbPool.query(sql, params);
        // await redisClient.setEx(cacheKey, 300, JSON.stringify(tickets));
        res.status(200).json({ status: 'success', source: 'database', data: { tickets } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch tickets.', error: err.message });
    }
};

exports.getTicketDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [ticketRows] = await dbPool.query('SELECT * FROM Ticket WHERE id = ?', [id]);
        const ticket = ticketRows[0];
        if (!ticket) return res.status(404).json({ status: 'fail', message: 'Ticket not found.' });
        let detailsQuery = '';
        if (ticket.vehicle_type === 'train') detailsQuery = 'SELECT * FROM TrainDetails WHERE ticket_id = ?';
        else if (ticket.vehicle_type === 'flight') detailsQuery = 'SELECT * FROM FlightDetails WHERE ticket_id = ?';
        else if (ticket.vehicle_type === 'bus') detailsQuery = 'SELECT * FROM BusDetails WHERE ticket_id = ?';
        const [detailsRows] = await dbPool.query(detailsQuery, [id]);
        ticket.details = detailsRows[0] || null;
        res.status(200).json({ status: 'success', data: { ticket } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch ticket details.', error: err.message });
    }
};

exports.reserveTicket = async (req, res) => {
    const { ticket_id } = req.body;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [ticketRows] = await connection.query('SELECT remaining_cap FROM Ticket WHERE id = ? FOR UPDATE', [ticket_id]);
        if (!ticketRows[0] || ticketRows[0].remaining_cap <= 0) {
            await connection.rollback();
            return res.status(400).json({ status: 'fail', message: 'Ticket is no longer available.' });
        }
        await connection.query('UPDATE Ticket SET remaining_cap = remaining_cap - 1 WHERE id = ?', [ticket_id]);
        await connection.query('INSERT INTO Reservation (user_id, ticket_id) VALUES (?, ?)', [req.user.id, ticket_id]);
        await connection.commit();
        res.status(201).json({ status: 'success', message: 'Ticket reserved successfully for 10 minutes.' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ status: 'error', message: 'Failed to reserve ticket.', error: err.message });
    } finally {
        connection.release();
    }
};

exports.getReservations = async (req, res) => {
    try {
        await dbPool.query("UPDATE Reservation R JOIN Ticket T ON R.ticket_id = T.id SET R.status = 'canceled', T.remaining_cap = T.remaining_cap + 1 WHERE R.status = 'reserved' AND R.expire_time < NOW()");
        const [reservations] = await dbPool.query('SELECT * FROM Reservation WHERE user_id = ? ORDER BY reserve_time DESC', [req.user.id]);
        res.status(200).json({ status: 'success', data: { reservations } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch reservations.', error: err.message });
    }
};

exports.makePayment = async (req, res) => {
    const { reservation_id, method } = req.body;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [resRows] = await connection.query('SELECT * FROM Reservation WHERE id = ? AND user_id = ? FOR UPDATE', [reservation_id, req.user.id]);
        const reservation = resRows[0];
        if (!reservation || reservation.status !== 'reserved' || new Date(reservation.expire_time) < new Date()) {
            await connection.rollback();
            return res.status(400).json({ status: 'fail', message: 'Reservation is invalid or has expired.' });
        }
        const [ticketRows] = await connection.query('SELECT price FROM Ticket WHERE id = ?', [reservation.ticket_id]);
        const ticketPrice = ticketRows[0].price;
        const [userRows] = await connection.query('SELECT balance FROM User WHERE id = ? FOR UPDATE', [req.user.id]);
        if (userRows[0].balance < ticketPrice) {
            await connection.rollback();
            return res.status(400).json({ status: 'fail', message: 'Insufficient balance.' });
        }
        await connection.query('UPDATE User SET balance = balance - ? WHERE id = ?', [ticketPrice, req.user.id]);
        await connection.query("UPDATE Reservation SET status = 'paid' WHERE id = ?", [reservation_id]);
        await connection.query('INSERT INTO Payment (reservation_id, price, method) VALUES (?, ?, ?)', [reservation_id, ticketPrice, method]);
        await connection.commit();
        res.status(200).json({ status: 'success', message: 'Payment successful.' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ status: 'error', message: 'Payment failed.', error: err.message });
    } finally {
        connection.release();
    }
};

const calculatePenalty = (departureDateTime) => {
    const hoursUntilDeparture = (new Date(departureDateTime) - new Date()) / (1000 * 60 * 60);
    if (hoursUntilDeparture < 3) return 0.9;
    if (hoursUntilDeparture < 12) return 0.5;
    if (hoursUntilDeparture < 24) return 0.3;
    return 0.1;
};

exports.cancelTicket = async (req, res) => {
    const { reservation_id } = req.body;
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const [resRows] = await connection.query("SELECT * FROM Reservation WHERE id = ? AND user_id = ? AND status = 'paid' FOR UPDATE", [reservation_id, req.user.id]);
        const reservation = resRows[0];
        if (!reservation) {
            await connection.rollback();
            return res.status(404).json({ status: 'fail', message: 'Paid reservation not found to cancel.' });
        }
        const [ticketRows] = await connection.query('SELECT price, departure_date, departure_time FROM Ticket WHERE id = ?', [reservation.ticket_id]);
        const ticket = ticketRows[0];
        const departureDateTime = new Date(`${ticket.departure_date.toISOString().split('T')[0]}T${ticket.departure_time}`);
        const penaltyRate = calculatePenalty(departureDateTime);
        const refundAmount = ticket.price * (1 - penaltyRate);
        await connection.query('UPDATE Ticket SET remaining_cap = remaining_cap + 1 WHERE id = ?', [reservation.ticket_id]);
        await connection.query("UPDATE Reservation SET status = 'canceled' WHERE id = ?", [reservation_id]);
        await connection.query("UPDATE Payment SET status = 'returned' WHERE reservation_id = ?", [reservation_id]);
        await connection.query('UPDATE User SET balance = balance + ? WHERE id = ?', [refundAmount, req.user.id]);
        await connection.commit();
        res.status(200).json({ status: 'success', message: 'Ticket canceled successfully.', data: { refundAmount } });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ status: 'error', message: 'Failed to cancel ticket.', error: err.message });
    } finally {
        connection.release();
    }
};

exports.getBuys = async (req, res) => {
    try {
        const sql = `
            SELECT 
                r.id as reservation_id,
                t.source,
                t.destination,
                t.departure_date,
                t.departure_time,
                p.price,
                p.payment_time
            FROM Payment p
            JOIN Reservation r ON p.reservation_id = r.id
            JOIN Ticket t ON r.ticket_id = t.id
            WHERE r.user_id = ? AND p.status = 'successful'
            ORDER BY p.payment_time DESC
        `;
        
        const [buys] = await dbPool.query(sql, [req.user.id]);
        
        res.status(200).json({ status: 'success', data: { buys } });

    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch purchase history.', error: err.message });
    }
};

exports.createReport = async (req, res) => {
    const { reservation_id, category, description } = req.body;
    const user_id = req.user.id;
    if (!reservation_id || !category || !description) {
        return res.status(400).json({ status: 'fail', message: 'Please provide all required fields for the report.' });
    }
    try {
        const newReport = { user_id, reservation_id, category, description };
        await dbPool.query('INSERT INTO Report SET ?', newReport);
        res.status(201).json({ status: 'success', message: 'Report submitted successfully.' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to submit report.', error: err.message });
    }
};
