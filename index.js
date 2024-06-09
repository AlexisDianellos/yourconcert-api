require('dotenv').config();
const express = require('express')
const cors = require('cors');
const User = require('./models/User');
const Post = require('./models/Post');
const Concerts = require('./models/Concerts');
const bcrypt = require('bcryptjs');//in order to encrypt the password
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest:'./uploads'});
const fs = require('fs');//file system

const salt=bcrypt.genSaltSync(10);//generate salt for passwords, protects from attacks
const secret = process.env.SECRET_SALT;//salt for json web tokens

const app = express();

app.use(cors({credentials:true,origin:'https://yourconcert.onrender.com'})); //setting up a middleware that allows Cross-Origin Resource Sharing (CORS) for your server. This line of code enables your server to accept requests from different domains than the one your server is hosted on.
// and i need to define credentials:true bc i use it in login.js

app.use(express.json());// so i can parse the json from the request it makes the request(req.body) into js object

app.use(cookieParser());//to read cookies

app.use('/uploads', express.static(__dirname + '/uploads'));//for cover on post

mongoose.connect(process.env.MONGODB_URI)//to connect to db

app.post('/register',async(req,res)=>{ //post bc we want to send some infromation w a post request
  const {username,password}=req.body; //grabbing username + password from the request body
  try{

    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });  //creating my user with the model
    res.json(userDoc);

  } catch (error){
    console.error('Error during user registration: ', error);
    res.status(500).json({error: error.message || 'Server error during registration' });
  }
})

app.post('/login',async (req,res)=>{
  const {username,password} = req.body;//grabbing username + password from the request body
  const userDoc = await User.findOne({username:username});//find a single document that matches/ username field matches the value of the username variable.
  if (userDoc){
    const passwordResult = bcrypt.compareSync(password,userDoc.password)//comparing passwords true/false
    if (passwordResult){
      //logged in

      jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
        if(err) throw err;
          res.cookie('token', token).json({
            id:userDoc._id,
            username,
          });//im sending it back as a cookie which i can find in the headers tab in network in order to save the cookie inside of my react app

      })//create token which essentially is a random string

    }
    else{
      //not logged in
      res.status(400).json('Incorrect username or password');
    }
    }else{
      res.status(400).json('User doesnt exist');
    }
})

app.get('/profile',(req,res)=>{
  const {token} = req.cookies;//jwt token from cookies
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }
  jwt.verify(token, secret, {}, (err,info)=>{
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.json(info);
  })
})

app.post('/logout',(req,res)=>{
  res.cookie('token','').strictContentLength('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path: tempPath } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = `${tempPath}.${ext}`;
    fs.renameSync(tempPath, newPath);
    //now im done with fixing the file
    //i want to save the 4 things to db and for that i will need a new model Post

    const { token } = req.cookies;//jwt token from cookies
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(401).json('Invalid token');

      const { title, summary, content, performanceQuality, pqComments, stagePresence, spComments, soundQuality, sqComments, visualEffects, veComments, audienceInteraction, aiComments } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath.replace(/\\/g, '/'),
        performanceQuality,
        pqComments,
        stagePresence,
        spComments,
        soundQuality,
        sqComments,
        visualEffects,
        veComments,
        audienceInteraction,
        aiComments,
        author: info.id,
      });
      res.json(postDoc);//save file to Uploads

    });
  } catch (error) {
    console.error('Error during post creation:', error);
    res.status(500).json({ error: error.message || 'Server error during post creation' });
  }
});

app.get('/post',async(req,res)=>{
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.get('/concerts', async (req, res) => {
  try {
    const concerts = await Concerts.find().sort({ date: 1 }); // Sort by date
    res.json(concerts);
  } catch (error) {
    console.error('Error fetching concerts:', error);
    res.status(500).json({ error: 'Server error while fetching concerts'});
  }
});

app.listen(4000);