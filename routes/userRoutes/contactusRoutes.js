
const express = require('express');
const router = express.Router();
const contactController = require('../../Controllers/userControl/contactusController');

// Correct usage: pass the function reference
router.post('/contactus', contactController.createContactus);

module.exports = router;
