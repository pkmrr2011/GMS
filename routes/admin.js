var express = require('express');
var router = express.Router();
const controller = require("../controller/admin");
const requireAuth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.post('/login',validate.login, controller.login );

router.get('/getUsers',requireAuth.authMiddleware , controller.getUsers );

router.post('/addUser',requireAuth.authMiddleware ,validate.addUser , controller.addUser );

module.exports = router;
