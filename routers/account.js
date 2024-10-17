const express = require('express');
const nodemailer = require('nodemailer'); // For sending emails
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router()

const db = require('../confige/index')

// JWT secret key
const JWT_SECRET = 'your_jwt_secret_key';


// Function to send OTP
const sendOtp = (email, otp) => {
    // Example using nodemailer (for email)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'boxbabajee@gmail.com',
            pass: 'advqbsnalkiciqax'
        }
    });

    const mailOptions = {
        from: 'boxbabajee@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    // You can also use Twilio for SMS
    // const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
    // twilioClient.messages.create({
    //     body: `Your OTP code is ${otp}`,
    //     from: 'TWILIO_PHONE_NUMBER',
    //     to: 'RECIPIENT_PHONE_NUMBER'
    // });
};


// Sign Up API
router.post('/signup', async(req, res) => {
    const { senderId, email, contactNo, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification code
    const expiration = new Date(Date.now() + 10 * 60000);

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, emailData) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        
        if (emailData.length > 0) {
            return res.status(409).json({ message: 'Email already exists' }); // Conflict status
        }

        const query = 'INSERT INTO users (senderId, email, contactNo, password, verificationCode, contactVerify, emailVerify,otp_expiration,isActive) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?)';
        db.query(query, [senderId, email, contactNo, hashedPassword, verificationCode, 0, 0,'',1], (err, results) => {
            // if (err) {
            //     console.error(err);
            //     return res.status(500).json({ error: 'Database query failed' });
            // }
            // res.status(201).json({ message: 'User created successfully', userId: results.insertId });

            const query2 = 'UPDATE users SET verificationCode = ?, otp_expiration = ? WHERE email = ?';
            db.query(query2, [verificationCode, expiration, email], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database query failed' });
                }
                sendOtp(email, verificationCode); // Send the OTP via email/SMS
                res.json({ message: 'OTP sent successfully' });
            });
        });
    });
});



// Sign In API
router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        if (user.emailVerify === 0) {
            return res.status(403).json({ message: 'Your email is not verified' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Sign in successful', token , data:user });
    });
});

// Update User API
router.put('/update', (req, res) => {
    const { id, email, contactNo } = req.body;

    const query = 'UPDATE users SET email = ?, contactNo = ? WHERE id = ?';
    db.query(query, [email, contactNo, id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'User updated successfully' });
    });
});


router.post('/updatepassword', async(req, res) => {
    const { email, password } = req.body;

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        // If no user found with the email
        if (results.length === 0) {
            return res.status(404).json({ error: 'Email not found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(query, [hashedPassword,email], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.json({ message: 'password updated successfully' });
        });
    });
});

// Get User Info API
router.get('/user/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT id, email, contactNo, isActive FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    });
});



// JWT secret key
//const JWT_SECRET = 'your_jwt_secret_key';



// Generate and send OTP
router.post('/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiration = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    const query = 'UPDATE users SET verificationCode = ?, otp_expiration = ? WHERE email = ?';
    db.query(query, [otp, expiration, email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        sendOtp(email, otp); // Send the OTP via email/SMS
        res.json({ message: 'OTP sent successfully' });
    });
});

// Verify OTP
router.post('/verifyOtp', (req, res) => {
    const { email, otp } = req.body;

    const query = 'SELECT verificationCode, otp_expiration FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const isOtpValid = user.verificationCode === otp && new Date() < new Date(user.otp_expiration);

        if (!isOtpValid) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // Optionally mark email as verified
        const updateQuery = 'UPDATE users SET emailVerify = 1 WHERE email = ?';
        db.query(updateQuery, [email], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update user verification status' });
            }
            res.json({ message: 'OTP verified successfully' });
        });
    });
});


module.exports = router