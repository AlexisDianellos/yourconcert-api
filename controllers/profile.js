const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_SALT;

exports.getProfile = async(req,res)=>{
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
  });
};