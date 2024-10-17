const express = require('express');
const router = express.Router();
const db = require('../confige/index');

router.get('/getAllStatus' ,(req,res) =>{
    const sql = "SELECT * FROM `shipment_statue` ORDER BY sordtOrder ASC";
    db.query(sql , (err ,results) =>{
        if(err){
            console.log('Error fetching countries',err);
            return res.status(500).send('Error fetching countries',err);
        }
        res.json(results)
    })
});

module.exports = router