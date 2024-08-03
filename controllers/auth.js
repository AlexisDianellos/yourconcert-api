const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_SALT;

exports.register = async(req,res)=>{
  const {username,password}=req.body;
  
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch (error){
    console.error('Error during user registration: ', error);
    res.status(500).json({error: error.message || 'Server error during registration' });
  }
}

exports.login = async(req,res)=>{
  try{
    const {username,password} = req.body;
    const userDoc = await User.findOne({username:username});
    if (userDoc){
      const passwordResult = bcrypt.compareSync(password,userDoc.password)
      if (passwordResult){
        //logged in
  
        jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
          if(err) throw err;
            res.cookie('token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'None'
            }).json({
              id:userDoc._id,
              username,
            });
        });//create token
  
      }
      else{
        //not logged in
        res.status(400).json('Incorrect username or password');
      }
      }else{
        res.status(400).json('User doesnt exist');
      }
    }catch(err){
      res.status(500).json({error: err.message})
    }
}

exports.logout = async(req,res)=>{
  res.clearCookie('token').json({ message: 'Logged out successfully' });
}