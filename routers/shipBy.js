const express = require('express');
const router  = express.Router();
const db = require('../confige/index');

router.get('/getAll',(req,res) =>{
    const sql = "SELECT * FROM shipbytype ORDER BY sortOrder ASC";
    db.query(sql , (err,results) =>{
        if(err){
            console.log('Sorry shipment BY type not fetch');
            return res.status(500).send('Error fetching shipByType');
        }
        res.json(results)
    })    
});

router.get('/getAllActive',(req,res) =>{
    const sql = "SELECT * FROM shipbytype ORDER BY sortOrder ASC";
    db.query(sql , (err,results) =>{
        if(err){
            console.log('Sorry shipment BY type not fetch');
            return res.status(500).send('Error fetching shipByType');
        }
        res.json(results)
    })    
});

module.exports = router