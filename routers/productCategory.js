const express = require('express')
const router = express.Router();

const db = require('../confige/index')

// Create a new product category
router.post('/addData', (req, res) => {
    const { name, details, user_id, isActive } = req.body;
    const query = 'INSERT INTO productcategory (name, details, user_id, isActive) VALUES (?, ?, ?, ?)';
    db.query(query, [name, details, user_id, isActive], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, name, details, user_id, isActive });
    });
});

// Get all product categories
router.get('/getAll', (req, res) => {
    db.query('SELECT * FROM productcategory ORDER BY name ASC', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get a product category by ID
router.get('/getSingle/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM productcategory WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.status(404).send('Category not found');
        res.json(results[0]);
    });
});

// Update a product category
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, details, user_id, isActive } = req.body;
    const query = 'UPDATE productcategory SET name = ?, details = ?, user_id = ?, isActive = ? WHERE id = ?';
    db.query(query, [name, details, user_id, isActive, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).send('Category not found');
        res.send('Category updated successfully');
    });
});

// Delete a product category
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productcategory WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).send('Category not found');
        res.send('Category deleted successfully');
    });
});


module.exports = router