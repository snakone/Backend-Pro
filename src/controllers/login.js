const userModel = require('../models/user');  // User Model = MongoDB Collection
const encrypt = require('bcryptjs');  // Encrypt Password
const jwt = require ('jsonwebtoken');  // JSON WEB TOKEN

const { SEED } = require('../config/config');

const LOGINCTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

LOGINCTRL.login = async (req, res)=> {

  let body = req.body;

  userModel.findOne({ email: body.email}, (err, user) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar usuario",
        err
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Credenciales incorrectas (email)",
        err
      });
    }

    if (!encrypt.compareSync(body.password, user.password)){
      return res.status(400).json({
        ok: false,
        message: "Credenciales incorrectas (password)",
        err
      });
    }

    // Token
    user.password = null;
    let token = jwt.sign({user: user}, SEED, {expiresIn: 14400});  // 4 hours


    res.status(200).json({
      ok: true,
      message: 'Logged in',
      user,
      JWT: token,
      id: user._id
    });

  });
}


module.exports = LOGINCTRL;  // Exports the Object with all the Methods
