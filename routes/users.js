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

router.get('/myJobList',middleware.authMiddleware,  controller.myJobList );

router.post('/startDuty',middleware.authMiddleware,validate.startDuty,  controller.startDuty );

router.get('/todayDuty',middleware.authMiddleware,  controller.todayDuty );

router.post('/endDuty',middleware.authMiddleware,  controller.endDuty );

router.post('/addIncident',middleware.authMiddleware,validate.addIncident,  controller.addIncident );

router.post('/addDailyReport',middleware.authMiddleware,validate.addDailyReport,  controller.addDailyReport );

router.get('/sendEmail', controller.sendEmail );


module.exports = router;
