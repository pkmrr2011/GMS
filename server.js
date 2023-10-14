var express = require('express');
var path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const multer = require("multer");
var usersRouter = require('./routes/users');

var adminRouter = require('./routes/admin');

var app = express();
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://admin:admin@cluster0.i58qwej.mongodb.net/gms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

app.get("/",(req,res)=>{
  return res.status(200).json({
    message: "App is running.."
  })
})

app.use('/admin', adminRouter);

app.use('/users', usersRouter);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
   return cb(null, "./uploads/")
  },
  filename: (req, file, cb) => {
    return cb(null, Date.now() + "-" + file.originalname)
  },
})

const uploadStorage = multer({ storage: storage });
app.post("/upload", 
uploadStorage.single("media"),
 (req, res)=>{
  try {
    return res.status(200).json({filename: req.file.filename });
  } catch (error) {
    return res.status(400).json({
      error:true,
      message:error.message
    })
  }
 });

app.get("*", (req,res)=>{
  return res.status(400).json({
    error: true,
    message: "URL_NOT_FOUND"
  })
})

app.listen(4000, ()=>{
  console.log('App listening on port 4000')
});
