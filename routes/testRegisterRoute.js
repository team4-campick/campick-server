const express = require('express');
const router = express.Router();
const registerTestController = require('../controller/registerTestController');

router.post('/register', registerTestController.registerUser);

module.exports = router;
