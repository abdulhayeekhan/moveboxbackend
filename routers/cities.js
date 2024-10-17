const express = require('express');
const router = express.Router();
const db = require('../confige/index')


  // 1. Create a new city (POST)
  router.post('/add', (req, res) => {
    const { name, code, country_id, status } = req.body;
    const sql = 'INSERT INTO cities (name, code, country_id, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, code, country_id, status], (err, result) => {
      if (err) {
        console.error('Error inserting city:', err);
        return res.status(500).send('Error inserting city');
      }
      //res.json(result);
  
      res.status(200).json({
        message: 'City saved successfully',
        data: {  id: result.insertId,name, code, country_id, status },
      });
    });
  });
  
  // 2. Get all cities (GET), including country name
  router.get('/getAll', (req, res) => {
    const sql = `
      SELECT cities.*, country.name AS country_name
      FROM cities
      JOIN country ON cities.country_id = country.id
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching cities:', err);
        return res.status(500).send('Error fetching cities');
      }
      res.json(results);
    });
  });
  
  // 3. Get a single city by name (GET)
  router.get('/cities/:name', (req, res) => {
    const { name } = req.params;
    const sql = `
      SELECT cities.*, country.name AS country_name
      FROM cities
      JOIN country ON cities.country_id = country.id
      WHERE cities.name = ?
    `;
    db.query(sql, [name], (err, results) => {
      if (err) {
        console.error('Error fetching city:', err);
        return res.status(500).send('Error fetching city');
      }
      if (results.length === 0) {
        return res.status(404).send('City not found');
      }
      res.json(results[0]);
    });
  });
  
  // 4. Update a city by ID (PUT)
  router.put('/cities/:id', (req, res) => {
    const { id } = req.params;
    const { name, code, country_id, status } = req.body;
    const sql = 'UPDATE cities SET name = ?, code = ?, country_id = ?, status = ? WHERE id = ?';
    db.query(sql, [name, code, country_id, status, id], (err, result) => {
      if (err) {
        console.error('Error updating city:', err);
        return res.status(500).send('Error updating city');
      }
      res.send('City updated successfully');
    });
  });
  
  // 5. Delete a city by ID (DELETE)
  router.delete('/cities/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM cities WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting city:', err);
        return res.status(500).send('Error deleting city');
      }
      res.send('City deleted successfully');
    });
  });


module.exports = router;