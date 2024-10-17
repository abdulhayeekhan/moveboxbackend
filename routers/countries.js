const express = require('express');
const router = express.Router();
const db = require('../confige/index')


  // 1. Create a new country (POST)
  router.post('/addCountry', (req, res) => {
    const { name, code, ship_from, ship_to, status } = req.body;
    const sql = 'INSERT INTO country (name, code, ship_from, ship_to, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, code, ship_from, ship_to, status], (err, result) => {
      if (err) {
        console.error('Error inserting country:', err);
        return res.status(500).send('Error inserting country');
      }
      res.send('Country created successfully');
    });
  });
  
  // 2. Get all countries (GET)
  router.get('/getAllCountires', (req, res) => {
    const sql = 'SELECT * FROM country ORDER BY name ASC';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching countries:', err);
        return res.status(500).send('Error fetching countries');
      }
      res.json(results);
    });
  });
  
  // 3. Get a single country by ID (GET)
  router.get('/getCountryID/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM country WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching country:', err);
        return res.status(500).send('Error fetching country');
      }
      if (results.length === 0) {
        return res.status(404).send('Country not found');
      }
      res.json(results[0]);
    });
  });
  
  // 4. Update a country by ID (PUT)
  router.put('/updateCountry/:id', (req, res) => {
    const { id } = req.params;
    const { name, code, ship_from, ship_to, status } = req.body;
    const sql = 'UPDATE country SET name = ?, code = ?, ship_from = ?, ship_to = ?, status = ? WHERE id = ?';
    db.query(sql, [name, code, ship_from, ship_to, status, id], (err, result) => {
      if (err) {
        console.error('Error updating country:', err);
        return res.status(500).send('Error updating country');
      }
      res.send('Country updated successfully');
    });
  });
  
  // 5. Delete a country by ID (DELETE)
  router.delete('/deleteCountry/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM country WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting country:', err);
        return res.status(500).send('Error deleting country');
      }
      res.send('Country deleted successfully');
    });
  });

module.exports = router;