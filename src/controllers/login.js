const userModel = require('../models/user');  // User Model
const encrypt = require('bcryptjs');  // Encrypt Password
const jwt = require ('jsonwebtoken');  // JSON WEB TOKEN

const { SEED } = require('../config/config');  // SEED + Hash = Token
const { CLIENT_ID } = require('../config/config'); // GOOGLE Developer ID
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(CLIENT_ID);  // New GOOGLE Client

const LOGINCTRL = {};  // Create Object

// EMAIL/PASSWORD LOGIN //
LOGINCTRL.login = async (req, res)=> {

  let body = req.body;
  await userModel.findOne({ email: body.email}, (err, user) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error at searching an User",
        err
      });
    }

    if (!user) { // No User?
      return res.status(400).json({
        ok: false,
        message: "Incorrect credentials (Email)",
        err
      });
    }

    if (!encrypt.compareSync(body.password, user.password)){  // Compare Passwords
      return res.status(400).json({
        ok: false,
        message: "Incorrect credentials (Password)",
        err
      });
    }

    // TOKEN
    let token = jwt.sign({user: user}, SEED, {expiresIn: 14400});  // 4 HOURS

    user.password = null;  // No need Password on the Response
    res.status(200).json({
        ok: true,
        message: 'Logged in',
        user,
        token: token,
        _id: user._id
      });
    }); // End of findOne
}

// GOOGLE SIGN IN //
LOGINCTRL.loginGoogle = async (req, res)=> {

  let token = req.body.token;
  let googleUser = await verify(token)  // Verify Token
   .catch(err => {
     return res.status(403).json({
       ok: false,
       message: "Invalid Token",
       err
     });
   })

  userModel.findOne({email: googleUser.email}, (err, user) => {
    if (err) {  // Find User by Email
      return res.status(500).json({
        ok: false,
        message: "Error searching Google User",
        err
      });
    }

    if (user) {  // Using Google SignIn with Google = False? No Thanks!
      if (user.google === false){
        return res.status(400).json({
          ok: false,
          message: "You are not Google User. Use a Email/Password connection instead",
          err
        });
      }
        // TOKEN
        let token = jwt.sign({user: user}, SEED, {expiresIn: 14400});  // 4 HOURS

        res.status(200).json({
          ok: true,
          message: 'Logged in',
          user,
          token: token,
          _id: user._id
        });

    } else {  // No Google User with the Email? Create ONE!
      let user = new userModel();
      user.name = googleUser.name;
      user.email = googleUser.email;
      user.image = googleUser.image;
      user.google = true;  // ;)
      user.password = "GoogleUsersDoesntNeedPassword";

      user.save((err, createdUser) => {  // Save NEW Google User
        if (err) {
          return res.status(500).json({
            ok: false,
            message: "Error saving Google User",
            err
          });
        }
        res.status(200).json({
          ok: true,
          message: 'Google User created',
          createdUser,
          token: token,
        });
      });
    }
  })
};

async function verify(token) {  // Verify Token Function

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();  // Payload = User
    return {
      name: payload.name,
      email: payload.email,
      image: payload.picture,
      google: true
    };
}


module.exports = LOGINCTRL;  // Exports the Object with all the Methods
