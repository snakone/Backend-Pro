const userModel = require('../models/user');  // User Model
const encrypt = require('bcryptjs');  // Encrypt Password
const {LIMIT} = require('../config/config');
const USERCTRL = {};  // Create Object.

// CREATE
USERCTRL.addUser = async (req, res) => {  // ADD AN USER

    req.body.password = encrypt.hashSync(req.body.password, 10);  // Encrypt
    const user = new userModel (req.body);

    if (user.name == '' || user.lastName == '' ||
        user.email == '' || user.password == '') {
      return res.status(400).json({
        ok: false,
        message: "User needs Name, LastName, Email and Password",
        action: "Creation"
      });
    }

    await user.save((err, createdUser)=> {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Email must be unique!",
          err
        });
      }
        res.status(201).json({
          ok: true,
          user: createdUser
        });
    });
}

// READ
USERCTRL.getUsers = async (req, res) => {  // GET ALL USERS

    let offset = req.query.offset || 0;  // Pagination
    offset = Number (offset);
    const users = await userModel.find({}, {password: 0}, (err, users) =>{
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error loading Users",
          err
        });
      }
    }).skip(offset)
      .limit(LIMIT);

    userModel.countDocuments({},(err, count) => {  // Document Count
      res.status(200).json({
        ok: true,
        users,
        userCount: count
      });
    });
}

USERCTRL.getUserById = async (req, res) => {
    let id = req.params.id;
    userModel.findById(id, (err, user) => {
     if (err) {
         return res.status(500).json({
             ok: false,
             mensaje: 'Error searching User',
             errors: err
          });
        }

     if (!user) {  // No User with given ID?
          return res.status(400).json({
              ok: false,
              mensaje: "User with ID " + id + " doesn't exist"
          });
       }

       res.status(200).json({
         ok: true,
         user
       });
    }) // End of Find
    .populate('user', 'name email image');
}

// UPDATE
USERCTRL.updateUserById = async (req, res) => {  // UPDATE AN USER BY ID

  let id = req.params.id;
  userModel.findById(id, (err, user) => {
   if (err) {
       return res.status(500).json({
           ok: false,
           mensaje: 'Error searching User',
           errors: err
       });
   }

   if (!user) {  // No User with given ID?
       return res.status(400).json({
           ok: false,
           mensaje: "User with ID " + id + " doesn't exist"
       });
   }

   user.name = req.body.name;  // Data Assignament
   user.email = req.body.email;
   user.lastName = req.body.lastName;
   user.role = req.body.role;

   if (user.name == '' || user.lastName == '' ||
       user.email == '' || user.password == '') {
     return res.status(400).json({
       ok: false,
       message: "User needs Name, LastName, Email and Password",
       action: "Updating"
     });
   }

   user.save((err, updatedUser) => {  // Save User with the new Data
       if (err) {
           return res.status(400).json({
               ok: false,
               mensaje: 'Error updating User',
               errors: err
           });
         }
         updatedUser.password = null;  // No need Response the Password

         res.status(200).json({
             ok: true,
             user: updatedUser
        });
    }); // End of Save
  }); // End of Find
}

// DELETE
USERCTRL.deleteUser = (req, res) => {  // Remove User from MongoDB

  let id = req.params.id;
  userModel.findByIdAndRemove(id, (err, deletedUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error removing User",
        err
      });
    }

    if (!deletedUser) {  // No User with given ID?
      return res.status(400).json({
        ok: false,
        message: "User with ID " + id + " doesn't exist",
      });
    }

    res.status(200).json({
      ok: true,
      user: deletedUser
    });
  });
}

module.exports = USERCTRL;  // Exports the Object with all the Methods
