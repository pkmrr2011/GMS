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
const Site = require("../model/site")

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

        if (!userExist) {
            return res.status(400).json({ code: 400, error: 'Wrong Email' });
        }

        const isPasswordValid = await bcrypt.compare(data.password, userExist.password);

        if (!isPasswordValid) {
            return res.status(400).json({ code: 400, error: 'Wrong Password' });
        }
        const payload = {
            _id: userExist._id,
            email: userExist.email,
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

        const whereObj ={}

        if(data.user_id){
            whereObj._id =new mongoose.Types.ObjectId(data.user_id) 
        }

        const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
        const offset = data.offset ? parseInt(data.offset) : 0;

        const users = await User.find(whereObj).limit(limit).skip(offset);
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

        if (typeof (data.certificate) == "string") {
            data.certificate = JSON.parse(data.certificate)
        }

        if (typeof (data.languages) == "string") {
            data.languages = JSON.parse(data.languages)
        }

        if (typeof (data.education) == "string") {
            data.education = JSON.parse(data.education)
        }

        const user = await User.create(data);
        return res.status(200).json({
            data: user,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }
        if (data.password) {
            data.decoded_password = data.password;
        }


        if (typeof (data.certificate) == "string") {
            data.certificate = JSON.parse(data.certificate)
        }

        if (typeof (data.languages) == "string") {
            data.languages = JSON.parse(data.languages)
        }

        if (typeof (data.education) == "string") {
            data.education = JSON.parse(data.education)
        }

        const query = { _id: new mongoose.Types.ObjectId(data.user_id) };
        const update = { $set: data };
        const user = await User.updateOne(query, update);
        return res.status(200).json({
            data: user,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const _id = req.params.user_id;

         await User.findByIdAndRemove(_id);
        return res.status(200).json({
            data: "Deleted",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.addSite = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        if (typeof (data.any_prequation) == "string") {
            data.any_prequation = JSON.parse(data.any_prequation)
        }

        const site = await Site.create(data);
        return res.status(200).json({
            data: site,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.updateSite = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }
        if (typeof (data.any_prequation) == "string") {
            data.any_prequation = JSON.parse(data.any_prequation)
        }

        const query = { _id:new mongoose.Types.ObjectId(data.site_id) };
        const update = { $set: data };
        const site = await Site.updateOne(query, update);
        return res.status(200).json({
            data: site,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.deleteSite = async (req, res) => {
    try {
        const _id = req.params.site_id;

         await Site.findByIdAndRemove(_id);
        return res.status(200).json({
            data: "Deleted",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.getSites = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const whereObj ={}

        if(data.site_id){
            whereObj._id =new mongoose.Types.ObjectId(data.site_id) 
        }

        const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
        const offset = data.offset ? parseInt(data.offset) : 0;

        const sites = await Site.find(whereObj).limit(limit).skip(offset);
        return res.status(200).json({
            data: sites,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};