const express = require('express');
const app = express();
const fs = require('fs');

const userModel = require('../models/user');  // User Model = MongoDB Collection
const hospitalModel = require('../models/hospital');  // Hospital Model = MongoDB Collection
const doctorModel = require('../models/doctor');  // Doctor Model = MongoDB Collection

const UPLOADCTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

UPLOADCTRL.uploadFile = async (req, res) => {  // Get ALL DOCTOR

  let id = req.params.id;
  let collection = req.params.collection;
  let allowedCollections = ['users', 'hospitals', 'doctors'];

  if (!allowedCollections.includes(collection)){
    return res.status(400).json({
      ok: false,
      message: 'Colección no válida',
      error: {message: 'Las colecciones válidas son ' + allowedCollections.join(', ')},
    });  // Send User to server as JSON
  }

   if (!req.files){
     return res.status(400).json({
       ok: false,
       message: "No Seleccionó nada",
       errror: {message: "Debe seleccionar una imagen"}
     });
   }

    let file = req.files.image;
    let fileSplit = file.name.split('.');
    let fileExt = fileSplit[fileSplit.length - 1];

    let allowedExt = ['jpg','png','jpeg'];

    if (!allowedExt.includes(fileExt)){
      return res.status(400).json({
        ok: false,
        message: 'Extensión no válida',
        error: {message: 'Las extensiones válidas son ' + allowedExt.join(', ')},
        file: fileExt
      });  // Send User to server as JSON
    }

    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;
    let filePath = `./src/uploads/${collection}/${fileName}`;

    checkCollection(collection, id, file, fileName, filePath, res);

}

function moveFile(file, filePath){
  file.mv(filePath, err => {
    if (err){
      return res.status(500).json({
        ok: false,
        message: 'Error al mover archivo',
        err,
        filePath
      });  // Send User to server as JSON
    }
  });
}


function checkCollection(collection, id, file, fileName, filePath, res){
    if (collection === 'users'){
      userModel.findById(id, (err, user) => {

        if (!user){
          return res.status(400).json({
            ok: false,
            message: 'El usuario no existe',
          });}

        let oldPath = './src/uploads/users/' + user.image;
        if (fs.existsSync(oldPath)){  // If Image Exist, remove old one
          fs.unlink(oldPath, function(err) {
            if (err) {
              return res.status(500).json({
                ok: false,
                message: 'Error al eliminar foto antigua',
              });
            }
          });
        }
        user.image = fileName;
        user.save((err, updatedUser) => {
          if (err){
            return res.status(500).json({
              ok: false,
              message: 'Error al actualizar foto',
            });
          }
            moveFile(file, filePath);

            updatedUser.password = null;
            res.status(200).json({
              ok: true,
              message: 'Archivo actualizado!',
              updatedUser
          });
        });
      });
    }

    if (collection === 'hospitals'){
      hospitalModel.findById(id, (err, hospital) => {

        if (!hospital){
          return res.status(400).json({
            ok: false,
            message: 'El hospital no existe',
          });}

        let oldPath = './src/uploads/hospitals/' + hospital.image;
        if (fs.existsSync(oldPath)){  // If Image Exist, remove old one
          fs.unlink(oldPath, function(err) {
            if (err) {
              return res.status(500).json({
                ok: false,
                message: 'Error al eliminar foto antigua',
              });
            }
          });
        }
        hospital.image = fileName;
        hospital.save((err, updatedHospital) => {
          if (err){
            return res.status(500).json({
              ok: false,
              message: 'Error al actualizar foto',
            });
          }
            moveFile(file, filePath);

            res.status(200).json({
              ok: true,
              message: 'Archivo actualizado!',
              updatedHospital
          });
        });
      });
    }

    if (collection === 'doctors'){
      doctorModel.findById(id, (err, doctor) => {

        if (!doctor){
          return res.status(400).json({
            ok: false,
            message: 'El doctor no existe',
          });}

        let oldPath = './src/uploads/doctors/' + doctor.image;
        if (fs.existsSync(oldPath)){  // If Image Exist, remove old one
          fs.unlink(oldPath, function(err) {
            if (err) {
              return res.status(500).json({
                ok: false,
                message: 'Error al eliminar foto antigua',
              });
            }
          });
        }
        doctor.image = fileName;
        doctor.save((err, updatedDoctor) => {
          if (err){
            return res.status(500).json({
              ok: false,
              message: 'Error al actualizar foto',
            });
          }
            moveFile(file, filePath);

            res.status(200).json({
              ok: true,
              message: 'Archivo actualizado!',
              updatedDoctor
          });
        });
      });
    }
}

module.exports = UPLOADCTRL;  // Exports the Object with all the Methods
