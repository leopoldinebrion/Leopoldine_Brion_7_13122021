const express = require('express');

const postController = require('../controllers/post');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/:id', auth, multer, postController.createPost);

module.exports = router;