const express = require('express')
const router = express.Router()
const db = require('../confige/index')

// POST: Create a new booking
router.post('/addBooking', (req, res) => {
    const {
        senderId, 
        receiverId, 
        fromCountryId,
        fromCityId,
        fromZipCode,
        fromAddress,
        toCountryId, 
        toCityId,
        toZipCode, 
        toAddress, 
        amount, 
        discountAmount,
        totalAmount, 
        receivedAmount, 
        payableAmount,
        quantity, 
        weight, 
        bookingDate, 
        isDocument,
        bookingStatus, 
        paymentStatus, 
        shipById, 
        bookingDetail
    } = req.body;

    const bookingQuery = 'INSERT INTO booking (senderId, receiverId, fromCountryId, fromCityId, fromZipCode, fromAddress, toCountryId, toCityId, toZipCode, toAddress, amount, discountAmount, totalAmount, receivedAmount, payableAmount, quantity, weight, bookingDate, isDocument, bookingStatus, paymentStatus,shipById) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)';

    db.query(bookingQuery, [senderId, receiverId, fromCountryId, fromCityId, fromZipCode, fromAddress, toCountryId, toCityId, toZipCode, toAddress, amount, discountAmount, totalAmount, receivedAmount, payableAmount, quantity, weight, bookingDate, isDocument, bookingStatus, paymentStatus,shipById ], (err, result) => {
        if (err) throw err;

        const bookingId = result.insertId;

        const bookingDetails = bookingDetail.map(detail => [bookingId, detail.productCategoryId, detail.height, detail.width, detail.length, detail.dimensionWeight, detail.weight, detail.quantity, detail.amount, detail.discount, detail.totalAmount]);

        const detailsQuery = 'INSERT INTO bookingdetails (bookingId, productCategoryId, height, width, length, dimensionWeight, weight, quantity, amount, discount, totalAmount) VALUES ?';

        db.query(detailsQuery, [bookingDetails], (err) => {
            if (err) throw err;
            res.status(201).json({ id: bookingId, ...req.body });
        });
    });
});

// GET: Get all bookings
router.get('/getAll', (req, res) => {
    db.query('SELECT b.*,se.firstName,se.lastName,se.contactNo,se.NIC,se.NTN,c.name as fromCountryName,ci.name as fromCityName,coun.name as toCountryName,city.name as toCityName,bs.name as bookingStatus,ps.status as paymentStatus,st.name as shipBy FROM booking as b INNER JOIN country as c ON c.id = b.fromCountryId INNER JOIN country as coun ON coun.id = b.toCountryId INNER JOIN cities as ci ON ci.id = b.fromCityId INNER JOIN cities as city ON city.id = b.toCityId INNER JOIN sender as se ON se.id = b.senderId INNER JOIN shipment_statue as bs ON bs.id=b.bookingStatus INNER JOIN paymentstatus as ps ON ps.id = b.paymentStatus INNER JOIN shipbytype as st ON st.id = b.shipById ORDER BY b.id DESC', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


router.post('/getAllWithSenderId', (req, res) => {
    const { pageNo, pageSize ,senderId } = req.body; // Default to page 1 and pageSize 10
    const offset = (pageNo - 1) * pageSize;

    // Query to get the total count
    const countQuery = 'SELECT COUNT(*) as totalCount FROM booking WHERE senderId = ?';
    db.query(countQuery, [senderId], (err, countResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        const totalCount = countResults[0].totalCount;

        const query = 'SELECT b.*,se.firstName,se.lastName,se.contactNo,se.NIC,se.NTN,c.name as fromCountryName,ci.name as fromCityName,coun.name as toCountryName,city.name as toCityName,bs.name as bookingStatus,ps.status as paymentStatus,st.name as shipBy FROM booking as b INNER JOIN country as c ON c.id = b.fromCountryId INNER JOIN country as coun ON coun.id = b.toCountryId INNER JOIN cities as ci ON ci.id = b.fromCityId INNER JOIN cities as city ON city.id = b.toCityId INNER JOIN sender as se ON se.id = b.senderId INNER JOIN shipment_statue as bs ON bs.id=b.bookingStatus INNER JOIN paymentstatus as ps ON ps.id = b.paymentStatus INNER JOIN shipbytype as st ON st.id = b.shipById WHERE b.senderId=? ORDER BY b.id DESC LIMIT ? OFFSET ?'; 
        db.query(query, [senderId ,pageSize, offset], (err, data) => {
            if (err) throw err;
            res.json({
                totalCount,
                data
            });
        });
    });
});

// GET: Get a booking by ID
router.get('/singleBooking/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM booking WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.status(404).send('Booking not found');
        res.json(results[0]);
    });
});


router.get('/BookingsBySenderId/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM booking WHERE senderId = ? ORDER BY id DESC', [id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.status(404).send('Booking not found');
        res.json(results[0]);
    });
});

// PUT: Update a booking
router.put('/booking/:id', (req, res) => {
    const { id } = req.params;
    const {
        senderId, receiverId, fromCountryId, fromCityId,
        fromZipCode, fromAddress, toCountryId, toCityId,
        toZipCode, toAddress, amount, discountAmount,
        totalAmount, receivedAmount, payableAmount,
        quantity, weight, bookingDate, isDocument,
        bookingStatus, paymentStatus, shipById, bookingDetail
    } = req.body;

    const bookingQuery = 'UPDATE booking SET senderId = ?, receiverId = ?, fromCountryId = ?, fromCityId = ?, fromZipCode = ?, fromAddress = ?, toCountryId = ?, toCityId = ?, toZipCode = ?, toAddress = ?, amount = ?, discountAmount = ?, totalAmount = ?, receivedAmount = ?, payableAmount = ?, quantity = ?, weight = ?, bookingDate = ?, isDocument = ?, bookingStatus = ?, paymentStatus = ?, shipById = ? WHERE id = ?';

    db.query(bookingQuery, [senderId, receiverId, fromCountryId, fromCityId, fromZipCode, fromAddress, toCountryId, toCityId, toZipCode, toAddress, amount, discountAmount, totalAmount, receivedAmount, payableAmount, quantity, weight, bookingDate, isDocument, bookingStatus, paymentStatus, shipById, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).send('Booking not found');

        // Update booking details
        const detailsQuery = 'DELETE FROM bookingdetails WHERE bookingId = ?';
        db.query(detailsQuery, [id], (err) => {
            if (err) throw err;

            const bookingDetails = bookingDetail.map(detail => [id, detail.productCategoryId, detail.height, detail.width, detail.length, detail.dimensionWeight, detail.weight, detail.quantity, detail.amount, detail.discount, detail.totalAmount]);

            const insertDetailsQuery = 'INSERT INTO bookingdetails (bookingId, productCategoryId, height, width, length, dimensionWeight, weight, quantity, amount, discount, totalAmount) VALUES ?';
            db.query(insertDetailsQuery, [bookingDetails], (err) => {
                if (err) throw err;
                res.send('Booking updated successfully');
            });
        });
    });
});

// DELETE: Delete a booking
router.delete('/booking/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM booking WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).send('Booking not found');
        res.send('Booking deleted successfully');
    });
});

module.exports = router