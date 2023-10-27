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
const middleware = require("../middleware/auth")
const utils = require("../middleware/utils")

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
        const token = jwt.sign(payload, 'project');

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