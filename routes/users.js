var express = require('express');
var router = express.Router();
const controller = require("../controller/users");
const middleware = require("../middleware/auth");
const validate = require("../middleware/validate");

/* GET users listing. */
router.post('/login',validate.login, controller.login );

router.post('/register',validate.register,  controller.register );

router.get('/getProfile',middleware.authMiddleware,  controller.getProfile );

router.post('/editProfile',middleware.authMiddleware,  controller.editProfile );

router.delete('/deleteProfile',middleware.authMiddleware,  controller.deleteProfile );

router.get('/getUsers', controller.getUsers );

router.post('/sendOtp',validate.sendOtp, controller.sendOtp );

router.post('/forgetPassword',validate.forgetPassword, controller.forgetPassword );

module.exports = router;
