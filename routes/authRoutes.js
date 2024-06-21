const express = require('express');
const {register , login , getProfile} = require('../controllers/authcontroller');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register' , register);
router.post('/login' , login);

router.get('/profile' , authenticateToken , getProfile);

module.exports = router;
