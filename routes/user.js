const express = require('express');
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.post("/signup", userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', auth, userCtrl.getUserProfil);
router.get("/", auth, userCtrl.getAllUsers);
router.put('/:id', auth, userCtrl.updateUserProfil);

module.exports = router;