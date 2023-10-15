var express = require('express');
var router = express.Router();
const controller = require("../controller/admin");
const requireAuth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.post('/login',validate.login, controller.login );

router.get('/getUsers',requireAuth.authMiddleware , controller.getUsers );

router.post('/addUser',requireAuth.authMiddleware ,validate.addUser , controller.addUser );

router.patch('/updateUser',requireAuth.authMiddleware ,validate.user_id , controller.updateUser );

router.delete('/deleteUser/:user_id',requireAuth.authMiddleware , controller.deleteUser );

router.get('/getSites',requireAuth.authMiddleware , controller.getSites );

router.post('/addSite',requireAuth.authMiddleware , controller.addSite );

router.patch('/updateSite',requireAuth.authMiddleware ,validate.site_id , controller.updateSite );

router.delete('/deleteSite/:site_id',requireAuth.authMiddleware , controller.deleteSite );

router.get('/getJobs',requireAuth.authMiddleware , controller.getJobs );

router.post('/addJob',requireAuth.authMiddleware ,validate.addJob, controller.addJob );

router.patch('/updateJob',requireAuth.authMiddleware ,validate.job_id , controller.updateJob );

router.delete('/deleteJob/:job_id',requireAuth.authMiddleware , controller.deleteJob );

module.exports = router;
