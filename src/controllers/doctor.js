const doctorModel = require('../models/doctor');  // Doctor Model
const {LIMIT} = require('../config/config');
const DOCTORCTRL = {};  // Create Object.

// CREATE //
DOCTORCTRL.addDoctor = async (req, res) => {  // ADD A DOCTOR

    req.body.user = req.user._id;
    console.log(req.body)
    const doctor = new doctorModel (req.body);

    if (doctor.name == '' || doctor.lastName == '' || doctor.hospital == '') {
      return res.status(400).json({
        ok: false,
        message: "Doctor needs Name, LastName and Hospital",
        action: "Updating"
      });
    }

    await doctor.save((err, createdDoctor)=> {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error creating Doctor",
          err
        });
      }
        res.status(201).json({
          ok: true,
          doctor: createdDoctor,
        });  // Send Doctor to server as JSON
    });
}

// READ //
DOCTORCTRL.getDoctors = async (req, res) => {  // Get ALL DOCTORS

    let offset = req.query.offset || 0;  // Pagination
    offset = Number (offset);
    const doctors = await doctorModel.find({}, {}, (err, doctors) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error loading Doctors",
          err
        });
      }
    }).skip(offset)
      .limit(LIMIT)
      .populate('doctor','name email image')  // Get the Model Ref ID
      .populate('hospital');

    doctorModel.countDocuments({},(err, count) => {
      res.status(200).json({
        ok: true,
        doctors,
        doctorCount: count
      });
    });
}

DOCTORCTRL.getDoctorById = async (req, res) => {
    let id = req.params.id;
    doctorModel.findById(id, (err, doctor) => {
     if (err) {
         return res.status(500).json({
             ok: false,
             mensaje: 'Error searching Doctor',
             errors: err
          });
        }

     if (!doctor) {  // No Doctor with given ID?
          return res.status(400).json({
              ok: false,
              mensaje: "Doctor with ID " + id + " doesn't exist"
          });
       }

       res.status(200).json({
         ok: true,
         doctor
       });
    }) // End of Find
    .populate('user', 'name email image')
    .populate('hospital');
}

// UPDATE //
DOCTORCTRL.updateDoctorById = async (req, res) => {  // UPDATE DOCTOR BY ID

  let id = req.params.id;
  doctorModel.findById(id, (err, doctor) => {
   if (err) {
       return res.status(500).json({
           ok: false,
           mensaje: 'Error searching Doctor',
           errors: err
       });
   }

   if (!doctor) {  // No Doctor with given ID?
       return res.status(400).json({
           ok: false,
           mensaje: "Doctor with ID " + id + " doesn't exist"
       });
   }

   doctor.name = req.body.name;  // Data Assignament
   doctor.lastName = req.body.lastName;

   if (doctor.name == '' || doctor.lastName == '') {
     return res.status(400).json({
       ok: false,
       message: "Doctor needs Name and LastName",
       action: "Updating"
     });
   }

   doctor.save((err, updatedDoctor) => {  // Save Doctor with the new Data
       if (err) {
           return res.status(400).json({
               ok: false,
               mensaje: 'Error updating Doctor',
               errors: err
           });
         }
         updatedDoctor.password = null;  // No need Response the Password

         res.status(200).json({
             ok: true,
             doctor: updatedDoctor
        });
    }); // End of Save
  }); // End of Find
}

// DELETE //
DOCTORCTRL.deleteDoctor = async (req, res) => {  // Remove Doctor from MongoDB

    let id = req.params.id;
    doctorModel.findByIdAndRemove(id, (err, deletedDoctor) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error deleting Doctor",
          err
        });
      }

      if (!deletedDoctor) {  // No Doctor?
        return res.status(400).json({
          ok: false,
          message: "Doctor with ID " + id + " doesn't exist",
        });
      }

      res.status(200).json({
        ok: true,
        doctor: deletedDoctor
      });
    });  // Remove by ID
}

module.exports = DOCTORCTRL;  // Exports the Object with all the Methods
