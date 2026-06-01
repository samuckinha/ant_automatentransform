const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota POST que o formulário de login chamará
router.post('/login', authController.login);

module.exports = router;
