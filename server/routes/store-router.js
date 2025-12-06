const express = require('express');
const router = express.Router();
const auth = require('../auth/index');
const UserController = require('../controllers/user-controller');

router.put("/user/:id", auth.verify, UserController.updateUser);

module.exports = router;