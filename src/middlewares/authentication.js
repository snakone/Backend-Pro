const jwt = require ('jsonwebtoken');  // JSON WEB TOKEN
const { SEED } = require('../config/config');  // SEED + Hash = Token

exports.verifyToken = async (req, res, next) => {
  let token = req.query.token;  // Get Token from URL
  jwt.verify(token, SEED, (err, decoded) => {
    if (err){
      return res.status(401).json({
        ok: false,
        message: "Incorrect Token!",
        err
      });
    }
    req.user = decoded.user;  // Verified User = User Requesting to API
    next();  // Token Valid? Continue
  });
}
