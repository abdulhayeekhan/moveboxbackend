const mysql = require('mysql2');

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'movebox'
// });

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
  
  // Connect to MySQL
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
});

module.exports = db