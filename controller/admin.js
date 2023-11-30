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
const Site = require("../model/site");
const Job = require("../model/job");
const Announcement = require("../model/announcement");
const Duty = require('../model/daily_duty');

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

// exports.updateSite = async (req, res) => {
//     try {
//         const data = {
//             ...req.query,
//             ...req.body
//         }
//         if (typeof (data.any_prequation) == "string") {
//             data.any_prequation = JSON.parse(data.any_prequation)
//         }

//         const query = { _id:new mongoose.Types.ObjectId(data.site_id) };
//         const update = { $set: data };
//         const site = await Site.updateOne(query, update);
//         return res.status(200).json({
//             data: site,
//         });

//     } catch (error) {
//         console.error(error.message);
//         return res.status(400).json({ error: error.message });
//     }
// };

exports.updateSite = async (req, res) => {
    try {
        let data = { ...req.body };
        
        if (typeof data.any_prequation === "string") {
            data.any_prequation = JSON.parse(data.any_prequation);
        }

        if (!data.site_id) {
            return res.status(400).json({ error: 'site_id is required.' });
        }

        const query = { _id: new mongoose.Types.ObjectId(data.site_id) };
        delete data.site_id; // Remove site_id from data as it's not part of the update data

        const update = { $set: data };
        const site = await Site.updateOne(query, update);

        if (site.nModified === 0) {
            return res.status(404).json({ error: 'No site found to update.' });
        }

        return res.status(200).json({
            success: true,
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

exports.addJob = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const query = { _id:new mongoose.Types.ObjectId(data.user_id) };
        const update = { $set: {
            status:"active"
        } };
         await User.updateOne(query, update); 

        const job = await Job.create(data);
        return res.status(200).json({
            data: job,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const query = { _id:new mongoose.Types.ObjectId(data.job_id) };
        const update = { $set: data };
        const job = await Job.updateOne(query, update);
        return res.status(200).json({
            data: job,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const _id = req.params.job_id;

         await Job.findByIdAndRemove(_id);
        return res.status(200).json({
            data: "Deleted",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.getJobs = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const whereObj ={}

        if(data.job_id){
            whereObj._id =new mongoose.Types.ObjectId(data.job_id) 
        }

        const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
        const offset = data.offset ? parseInt(data.offset) : 0;

        const jobs = await Job.find(whereObj).limit(limit).skip(offset);
        return res.status(200).json({
            data: jobs,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.addAnnouncement = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const Announcement = await Announcement.create(data);
        return res.status(200).json({
            data: Announcement,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        let data = { ...req.body };
        

        if (!data.announcement_id) {
            return res.status(400).json({ error: 'announcement_id is required.' });
        }

        const query = { _id: new mongoose.Types.ObjectId(data.announcement_id) };
        delete data.announcement_id; // Remove site_id from data as it's not part of the update data

        const update = { $set: data };
        const announcement_id = await announcement_id.updateOne(query, update);

        if (announcement_id.nModified === 0) {
            return res.status(404).json({ error: 'No announcement_id found to update.' });
        }

        return res.status(200).json({
            success: true,
            data: announcement_id,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const _id = req.params.announcement_id;

         await Announcement.findByIdAndRemove(_id);
        return res.status(200).json({
            data: "Deleted",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.getAnnouncements = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const whereObj ={}

        if(data.announcement_id){
            whereObj._id =new mongoose.Types.ObjectId(data.announcement_id) 
        }

        const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
        const offset = data.offset ? parseInt(data.offset) : 0;

        const Announcements = await Announcement.find(whereObj).limit(limit).skip(offset);
        return res.status(200).json({
            data: Announcements,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};


exports.getInactiveGuard = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const whereObj ={
            status:"inactive"
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

exports.getDailyReport = async (req, res) => {
    try {
        const data = {
            ...req.query,
            ...req.body
        }

        const whereObj ={
            daily_report_comment:{
                $ne: null
            }
        }

        const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
        const offset = data.offset ? parseInt(data.offset) : 0;

        const duties = await Duty.find(whereObj).limit(limit).skip(offset).populate("site_id user_id")
        return res.status(200).json({
            data: duties,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ error: error.message });
    }
};