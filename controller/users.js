var express = require('express');
var path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const User = require("../model/user");
const UserAccess = require("../model/user_access");
const Job = require("../model/job");
const Duty = require("../model/daily_duty");

const middleware = require("../middleware/auth")
const utils = require("../middleware/utils")

const emailer = require("../middleware/emailer")

var app = express();
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const saveUserAccess = async (req, user) => {
    return new Promise((resolve, reject) => {
      const data = {
        email: user.email,
        ip: utils.getIP(req),
        browser: utils.getBrowserInfo(req),
        country: utils.getCountry(req),
      };
      UserAccess.create(data)
        .then((item) => {
          resolve({
            error:false,
            message:"added"
          });
        })
        .catch((err) => {
          reject({
            error:true,
            message:err.message
          });
        });
    });
  };

exports.register = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const is_email_exist = await User.findOne({
            email:data.email
        });

        console.log("is_email_exist",is_email_exist);

        if(is_email_exist){
            return res.status(400).json({ code:400 ,error: 'Email Already Exist' });
        }

        const is_user_name_exist = await User.findOne({
            user_name:data.user_name
        });

        console.log("is_user_name_exist",is_user_name_exist);

        if(is_user_name_exist){
            return res.status(400).json({ code:400 ,error: 'User Name Already Exist' });
        }


        const user =await User.create(data);
        res.status(200).json({
            data: user,
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const data = req.body

        const userExist = await User.findOne({
            email: data.email
        });

        if(!userExist){
            return res.status(400).json({ code:400 ,error: 'User doesnot exist' });
        }

        const isPasswordValid = await bcrypt.compare(data.password, userExist.password);

        if (!isPasswordValid) {
            return res.status(400).json({ code:400 ,error: 'Wrong Password' });
            }
        const payload = {
            _id:userExist._id,
            email:userExist.email,
            full_name: userExist.full_name
        };
        const token = jwt.sign(payload, 'gms@123!gms');

        const user_acccess = await saveUserAccess(req ,userExist )

        console.log("---->>>",user_acccess);

        if(user_acccess?.error){
            return res.status(400).json({ code:400 ,error: 'something went wrong' }); 
        }

        res.status(200).json({
            data: userExist,
            token
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const _id = req.user._id;

        const user = await User.findById(_id);
        res.status(200).json({
            data:user,
            
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.editProfile = async (req, res) => {
    try {
        const _id = req.user._id;
        const updatedData = {
            ...req.query,
            ...req.body
        }
        const updateQuery = {
            $set: updatedData
        };
        await User.findByIdAndUpdate(_id, updateQuery);

        res.status(200).json({
            message: "Profile updated",
        });
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const _id = req.user._id;
        await User.findByIdAndDelete(_id);

        res.status(200).json({
            message: "Profile deleted",
        });
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {

        const users = await User.find();
        res.status(200).json({
            data:users,
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.sendOtp = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }
        console.log("___",data);
        const user = await User.findOne({
            $or:[
                {user_name:data.user_name,},
                {email:data.user_name}
            ]
        });
        if(!user){
            return res.status(400).json({ code:400 ,error: 'User Not Found' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

         console.log(otp);

         user.otp = otp;

         await Promise.all([
            middleware.sendOtpOnEmail(
              {
                email: user.email,
                otp: otp,
              },
              "Forget PASSWORD OTP"
            ),
            user.save(),
          ]);


        res.status(200).json({
            data:user,
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.forgetPassword = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const user = await User.findOne({
            $or:[
                {user_name:data.user_name,},
                {email:data.user_name}
            ]
        });


        if(!user){
            return res.status(400).json({ code:400 ,error: 'User Not Found' });
        }

        
        if(user.otp != data.otp){
            return res.status(400).json({ code:400 ,error: 'Wrong Otp' });
        }
         
        user.password = data.password;

         user.otp = 0;

         await user.save();

        res.status(200).json({
            data:user,
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.myJobList = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const job_list = await Job.find({
            user_id: req.user._id
        }).populate('site_id');


        if(job_list.length == 0){
            return res.status(400).json({ code:400 ,error: 'No Job For You' });
        }

        res.status(200).json({
            data:job_list,
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.startDuty = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        data.user_id = req.user._id;
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        data.checkin_time = `${hours}:${minutes}`;

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); 
        const today_duty = await Duty.findOne({
            date: {
              $gte: startOfToday,
              $lt: endOfToday
            },
            user_id:req.user._id
          })

          if(today_duty){
            return res.status(400).json({ code:400 ,error: 'Already stated a duty' });
          }
        const duty = await Duty.create(data);
        return res.status(200).json({
            data: duty,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.todayDuty = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); 
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); 
        
        const duty = await Duty.findOne({
            date: {
              $gte: startOfToday,
              $lt: endOfToday
            },
            user_id:req.user._id
          }).populate("site_id job_id")
        return res.status(200).json({
            data: duty,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.endDuty = async (req, res) => {
    try {

        if(typeof(req.body.daily_report_images) == "string"){
            req.body.daily_report_images = JSON.parse(req.body.daily_report_images)
        }

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const checkout_time = `${hours}:${minutes}`;

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); 
        const today_duty = await Duty.findOne({
            date: {
              $gte: startOfToday,
              $lt: endOfToday
            },
            user_id:req.user._id
          })

          if(!today_duty){
            return res.status(400).json({ code:400 ,error: 'You did not checking today' });
          }

          if(!today_duty.daily_report_comment){
            return res.status(400).json({ code:400 ,error: 'You didnot upload daily report' });
          }
         await Duty.findByIdAndUpdate(today_duty._id, {
            $set: {
                checkout_time: checkout_time,
                daily_report_images: req.body.daily_report_images,
                daily_report_comment: req.body.daily_report_comment,
            }
        });
        return res.status(200).json({
            data: "check out",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.addIncident = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        if(typeof(data.incident_images)=="string"){
            data.incident_images = JSON.parse(data.incident_images)
        }

        data.is_incident = true;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        data.incident_time = `${hours}:${minutes}`;

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); 
        const today_duty = await Duty.findOne({
            date: {
              $gte: startOfToday,
              $lt: endOfToday
            },
            user_id:req.user._id
          }).populate("site_id user_id")
          console.log("today_duty---",today_duty);
          if(!today_duty){
            return res.status(400).json({ code:400 ,error: 'You did not checking today' });
          }
         await Duty.findByIdAndUpdate(today_duty._id, {
            $set: data
        });

        emailer.sendEmail(
            today_duty.site_id.owner_detail.email,
            "Guard Incident Report",
            "/incident_report.ejs",
            {
                guardName: today_duty.user_id.name,
                siteName: today_duty.site_id.site_name,
                ownerName: today_duty.site_id.owner_detail.name,
                comment: data.incident_comment,
                images: data.incident_images,
                guardContact: today_duty.user_id.email
            }
          );
        return res.status(200).json({
            data: "Added",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.addDailyReport = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        if(typeof(data.daily_report_images)=="string"){
            data.daily_report_images = JSON.parse(data.daily_report_images)
        }

        const now = new Date();
        // const hours = now.getHours().toString().padStart(2, '0');
        // const minutes = now.getMinutes().toString().padStart(2, '0');
        // data.incident_time = `${hours}:${minutes}`;

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); 
        const today_duty = await Duty.findOne({
            date: {
              $gte: startOfToday,
              $lt: endOfToday
            },
            user_id:req.user._id
          }).populate("site_id user_id")
          console.log("today_duty---",today_duty);
          if(!today_duty){
            return res.status(400).json({ code:400 ,error: 'You did not checking today' });
          }

          if(today_duty.daily_report_comment){
            return res.status(400).json({ code:400 ,error: 'You already submitted the daily report' });

          }
         await Duty.findByIdAndUpdate(today_duty._id, {
            $set: data
        });

        emailer.sendEmail(
            today_duty.site_id.owner_detail.email,
            "Guard Daily Report",
            "/daily_report.ejs",
            {
                guardName: today_duty.user_id.name,
                siteName: today_duty.site_id.site_name,
            }
          );
        return res.status(200).json({
            data: "Added",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.sendEmail = async (req, res) => {
    try {
        emailer.sendEmail(
            "pk@mailinator.com",
            "Welcome message",
            "/incident_report.ejs",
            {
                guardName: "Prince",
                siteName: "Taj Hotel",
                images: [
                    "1700780873451-prince.jpg"
                ],
                comment: "hello"
            }
          );
        return res.status(200).json({
            data:"done",
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};