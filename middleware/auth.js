const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_SALT;

const verifyToken = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json('No token found');
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json('Invalid token');
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;

