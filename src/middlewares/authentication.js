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
  }); // All Requests to API from now on are from Verified User
}

exports.verifyAdmin = async (req, res, next) => {
    let user = req.user;

    if (user.role ==='ADMIN_ROLE'){
      next();
      return true;
    } else {
      return res.status(401).json({
        ok: false,
        message: "Incorrect Token! - You are not Admin!"
      });
    }
}

exports.verifySameUser = async (req, res, next) => {
    let user = req.user;
    let id = req.params.id;  // User We want to Update

    if (user.role ==='ADMIN_ROLE' || user._id == id){
      next();
      return true;
    } else {
      return res.status(401).json({
        ok: false,
        message: "You only can update your own profile!"
      });
    }
}
