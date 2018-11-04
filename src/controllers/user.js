const userModel = require('../models/user');  // User Model = MongoDB Collection
const encrypt = require('bcryptjs');  // Encrypt Password

const USERCTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

USERCTRL.getUsers = async (req, res) => {  // Get ALL USERS
    let offset = req.query.offset || 0;
    offset = Number (offset);
    const users = await userModel.find({}, {}, (err, users) =>{
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error loading Users",
          err
        });
      }
    }).skip(offset)
      .limit(5);

    userModel.countDocuments({},(err, count) => {
      res.status(200).json({
        ok: true,
        users,
        userCount: count
      });  // Send User to server as JSON
    });

}

USERCTRL.addUser = async (req, res) => {  // Add a USER
    req.body.password = encrypt.hashSync(req.body.password, 10);
    const user = new userModel (req.body);
    await user.save((err, createdUser)=> {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error creating User",
          err
        });
      }
        res.status(201).json({
          ok: true,
          user: createdUser,
          token: req.user
        });  // Send User to server as JSON
    });

}

USERCTRL.updateUserbyId = async (req, res) => {  // Get ALL USERS

    let id = req.params.id;
    let user = req.body;

    if (user.name == null || user.email == null || user.role == null) {
      return res.status(400).json({
        ok: false,
        message: "Introduce los datos",
      });
    }

    await userModel.findByIdAndUpdate(id, {$set: user}, (err, updatedUser) => {
      if (!updatedUser){
        return res.status(400).json({
          ok: false,
          message: "User with " + id + " doesn't exist",
          err
        });
      }

      if (err){
        return  res.status(500).json({
            ok: false,
            message: 'Error al actualizar User',
            err
          });
      }

      res.status(200).json({
        ok: true,
        user: updatedUser
      });  // Send User to server as JSON
    });  // Find by ID and Update in MongoDB
}

USERCTRL.deleteUser = async (req, res) => {  // Remove User from MongoDB

  let id = req.params.id;
  await userModel.findByIdAndRemove(id, (err, deletedUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error deleting Users",
        err
      });
    }

    if (!deletedUser) {
      return res.status(400).json({
        ok: false,
        message: "User with " + id + " doesn't exist",
      });
    }

    res.status(200).json({
      ok: true,
      user: deletedUser
    });  // Send User to server as JSON

  });  // Remove by ID

}

module.exports = USERCTRL;  // Exports the Object with all the Methods
