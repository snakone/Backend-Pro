const doctorModel = require('../models/doctor');  // Doctor Model

const DOCTORCTRL = {};  // Create Object.

// CREATE //
DOCTORCTRL.addDoctor = async (req, res) => {  // ADD A DOCTOR

    req.body.user = req.user._id;
    const doctor = new doctorModel (req.body);
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
      .limit(10)
      .populate('user','name email image')  // Get the Model Ref ID
      .populate('hospital');

    doctorModel.countDocuments({},(err, count) => {
      res.status(200).json({
        ok: true,
        doctors,
        doctorCount: count
      });
    });
}

// UPDATE //
DOCTORCTRL.updateDoctorbyId = async (req, res) => {  // UPDATE DOCTOR BY ID

    let id = req.params.id;
    let doctor = {  // Data Assignament
      name: req.body.name,
      user: req.user._id,  // Mongo ID
      hospital: req.body.hospital
    };

    if (doctor.name == null || doctor.user == null || doctor.hospital == null) {
      return res.status(400).json({
        ok: false,
        message: "Doctor needs Name, User and Hospital",
      });
    }

    await doctorModel.findByIdAndUpdate(id, {$set: doctor}, (err, updatedDoctor) => {
      if (!updatedDoctor){
        return res.status(400).json({
          ok: false,
          message: "Doctor with ID " + id + " doesn't exist",
          err
        });
      }

      if (err){
        return  res.status(500).json({
            ok: false,
            message: 'Error updating Doctor',
            err
          });
      }

      res.status(200).json({
        ok: true,
        doctor: updatedDoctor
      });
    });  // Find by ID and Update in MongoDB
}

// DELETE //
DOCTORCTRL.deleteDoctor = async (req, res) => {  // Remove Doctor from MongoDB

    let id = req.params.id;
    await doctorModel.findByIdAndRemove(id, (err, deletedDoctor) => {
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
