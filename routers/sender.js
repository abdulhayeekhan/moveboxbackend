const express = require('express')
const router = express.Router();

// Create a sender (POST)
router.post('/add', (req, res) => {
    const {firstName,lastName,NIC,userId,dateOfBirth,NTN,contactNo,email,gender,companyName,countryId,cityId,areaId,address,refrenceId,isActive} = req.body;
    const query = 'INSERT INTO sender (firstName,lastName,NIC,userId,dateOfBirth,NTN,contactNo,email,gender,companyName,countryId,cityId,areaId,address,refrenceId,isActive) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(query, [firstName,lastName,NIC,userId,dateOfBirth,NTN,contactNo,email,gender,companyName,countryId,cityId,areaId,address,refrenceId,isActive], (err, result) => {
      if (err) return res.status(500).send(err);

      res.status(200).json({
        message: 'user saved successfully',
        data: {  id: result.insertId,firstName,lastName,NIC,userId,dateOfBirth,NTN,contactNo,email,gender,companyName,countryId,cityId,areaId,address,refrenceId,isActive},
      });
    });
  });
  
  // Update a sender (PUT)
  router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sender = req.body;
    const query = 'UPDATE sender SET ? WHERE id = ?';
  
    db.query(query, [sender, id], (err) => {
      if (err) return res.status(500).send(err);
      res.send({ id, ...sender });
    });
  });

  
  
  // Delete a sender (DELETE)
  router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM sender WHERE id = ?';
  
    db.query(query, [id], (err) => {
      if (err) return res.status(500).send(err);
      res.status(204).send();
    });
  });
  
  // Get a single sender (GET)
  router.get('/getSingle/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM sender WHERE id = ?';
  
    db.query(query, [id], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(404).send('Sender not found');
      res.send(results[0]);
    });
  });
  
  // Get all senders (GET)
  router.get('/getAll', (req, res) => {
    const query = 'SELECT * FROM sender';
  
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
  });

module.exports = router