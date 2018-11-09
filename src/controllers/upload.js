const express = require('express');
const app = express();
const fs = require('fs');  // File System

const userModel = require('../models/user');  // User Model
const hospitalModel = require('../models/hospital');  // Hospital Model
const doctorModel = require('../models/doctor');  // Doctor Model

const UPLOADCTRL = {};  // Create Object.

UPLOADCTRL.uploadFile = async (req, res) => {  // UPLOAD FILE INTO SERVER

  let id = req.params.id;
  let collection = req.params.collection;
  let allowedCollections = ['users', 'hospitals', 'doctors'];

  if (!allowedCollections.includes(collection)){
    return res.status(400).json({
      ok: false,
      message: 'Invalid Collection',
      error: {message: 'Allowed Collections ' + allowedCollections.join(', ')},
    });
  }

   if (!req.files){  // No File Selected?
     return res.status(400).json({
       ok: false,
       message: "Select a File first!"
     });
   }

    let file = req.files.image;  // Get the FILE from the Request
    let fileSplit = file.name.split('.');
    let fileExt = fileSplit[fileSplit.length - 1];  // Get File extension (.jpg,.png)

    let allowedExt = ['jpg','png','jpeg'];

    if (!allowedExt.includes(fileExt)){
      return res.status(400).json({
        ok: false,
        message: 'File extension not allowed',
        error: {message: 'Allowed extensions ' + allowedExt.join(', ')},
        file: fileExt
      });
    }

    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;  // Random File Name
    let filePath = `./src/uploads/${collection}/${fileName}`;

    checkCollection(collection, id, file, fileName, filePath, res);  // MAIN Function
}

function moveFile(file, filePath){  // Move the FILE into PATH
  file.mv(filePath, err => {
    if (err){
      return res.status(500).json({
        ok: false,
        message: 'Error while moving the File',
        err,
        filePath
      });
     }
  });
}

 function checkCollection(collection, id, file, fileName, filePath, res){

    if (collection === 'users'){  // COLLECTION USER?
       userModel.findById(id, (err, user) => {
        if (!user){
          return res.status(400).json({
            ok: false,
            message: "User doesn't exist",
          });}

        let oldPath = './src/uploads/users/' + user.image;
        if (fs.existsSync(oldPath)){  // If Image Exist, remove old one
          fs.unlink(oldPath, function(err) {
            if (err) {
              return res.status(500).json({
                ok: false,
                message: 'Error deleting User old Photo',
              });
            }
          });
        }

        user.image = fileName;
        user.save((err, updatedUser) => {  // Save with new Image
          if (err){
            return res.status(500).json({
              ok: false,
              message: 'Error updating User Photo',
            });
          }
            moveFile(file, filePath);  // Move the FILE into PATH
            updatedUser.password = null;  // No need to response the Password
            res.status(200).json({
              ok: true,
              message: 'User Photo updated!',
              updatedUser
          });
        });
      });
    }

    if (collection === 'hospitals'){  // COLLECTION HOSPITAL?

       hospitalModel.findById(id, (err, hospital) => {
        if (!hospital){
          return res.status(400).json({
            ok: false,
            message: "Hospital doesn't exist",
          });}

        let oldPath = './src/uploads/hospitals/' + hospital.image;
        if (fs.existsSync(oldPath)){  // If Image Exist, remove old one
          fs.unlink(oldPath, function(err) {
            if (err) {
              return res.status(500).json({
                ok: false,
                message: 'Error deleting Hospital old Photo',
              });
            }
          });
        }

        hospital.image = fileName;
        hospital.save((err, updatedHospital) => {  // Save with new Image
          if (err){
            return res.status(500).json({
              ok: false,
              message: 'Error updating Hospital Photo',
            });
          }
            moveFile(file, filePath); // Move the FILE into PATH
            res.status(200).json({
              ok: true,
              message: 'Hospital Photo updated!',
              updatedHospital
          });
        });
      });
    }

    if (collection === 'doctors'){  // COLLECTION DOCTOR?

      doctorModel.findById(id, (err, doctor) => {
        if (!doctor){
          return res.status(400).json({
            ok: false,
            message: "Doctor doesn't exist",
          });}

        let oldPath = './src/uploads/doctors/' + doctor.image;
        if (fs.existsSync(oldPath)){  // If Image Exist, remove old one
          fs.unlink(oldPath, function(err) {
            if (err) {
              return res.status(500).json({
                ok: false,
                message: 'Error deleting Doctor old Photo',
              });
            }
          });
        }

        doctor.image = fileName;
        doctor.save((err, updatedDoctor) => {  // Save with new Image
          if (err){
            return res.status(500).json({
              ok: false,
              message: 'Error updating Doctor Photo',
            });
          }
            moveFile(file, filePath); // Move the FILE into PATH
            res.status(200).json({
              ok: true,
              message: 'Doctor Photo updated!',
              updatedDoctor
          });
        });
      });
    }
}

module.exports = UPLOADCTRL;  // Exports the Object with all the Methods
