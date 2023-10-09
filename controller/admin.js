var express = require('express');
var path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const middleware = require("../middleware/auth");

const Admin = require("../model/admin");
const User = require("../model/user");

var app = express();
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


exports.login = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const userExist = await Admin.findOne({
            email: data.email
        });

        if(!userExist){
            return res.status(400).json({ code:400 ,error: 'Wrong Email' });
        }

        const isPasswordValid = await bcrypt.compare(data.password, userExist.password);

        if (!isPasswordValid) {
            return res.status(400).json({ code:400 ,error: 'Wrong Password' });
            }
        const payload = {
            _id:userExist._id,
            email:userExist.email,
            name: userExist.name
        };
        const token = jwt.sign(payload, 'gms@123!gms');
        return res.status(200).json({
            token,
            data: userExist,
        })

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
        const offset = data.offset ? parseInt(data.offset) : 0;

        const users = await User.find().limit(limit).skip(offset);
        return res.status(200).json({
            data: users,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        data.decoded_password = data.password;

        const user = await User.create(data);
        return res.status(200).json({
            data: user,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};