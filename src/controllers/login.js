const userModel = require('../models/user');  // User Model = MongoDB Collection
const encrypt = require('bcryptjs');  // Encrypt Password
const jwt = require ('jsonwebtoken');  // JSON WEB TOKEN

const { SEED } = require('../config/config');
const { CLIENT_ID } = require('../config/config');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

const LOGINCTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

LOGINCTRL.login = async (req, res)=> {

  let body = req.body;

  await userModel.findOne({ email: body.email}, (err, user) => {

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

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return {
    name: payload.name,
    email: payload.email,
    image: payload.picture,
    google: true
  };
}

LOGINCTRL.loginGoogle = async (req, res)=> {
  let token = req.body.token;

  let googleUser = await verify(token)
   .catch(err => {
     return res.status(403).json({
       ok: false,
       message: "Token no válido",
       err
     });
   })

  userModel.findOne({email: googleUser.email}, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar usuario",
        err
      });
    }

    if (user) {
      if (user.google === false){
        return res.status(400).json({
          ok: false,
          message: "Debe de usar su autentificación normal",
          err
        });
      } else {
        let token = jwt.sign({user: user}, SEED, {expiresIn: 14400});  // 4 hours

        res.status(200).json({
          ok: true,
          message: 'Logged in',
          user,
          JWT: token,
          id: user._id
        });
      }
    } else {  // If User doesn't exist, create One
      let user = new userModel();
      user.name = googleUser.name;
      user.email = googleUser.email;
      user.image = googleUser.image;
      user.google = true;
      user.password = ':)';

      user.save((err, createdUser) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Error al guardar usuario de Google",
            err
          });
        }
        res.status(200).json({
          ok: true,
          message: 'Logged in with Google',
          createdUser,
          JWT: token,
        });
      });
    }
  })

  // res.status(200).json({
  //   ok: true,
  //   message: 'Everything OK',
  //   googleUser: googleUser
  // });
};


module.exports = LOGINCTRL;  // Exports the Object with all the Methods
