const doctorModel = require('../models/doctor');  // Doctor Model = MongoDB Collection

const DOCTORCTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

DOCTORCTRL.getDoctors = async (req, res) => {  // Get ALL DOCTORS
    let offset = req.query.offset || 0;
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
      .limit(5)
      .populate('user','name email image')
      .populate('hospital');

    doctorModel.countDocuments({},(err, count) => {
      res.status(200).json({
        ok: true,
        doctors,
        doctorCount: count
      });  // Send User to server as JSON
    });

}


DOCTORCTRL.addDoctor = async (req, res) => {  // Add a DOCTOR
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

DOCTORCTRL.updateDoctorbyId = async (req, res) => {  // Get ALL DOCTORS
    let id = req.params.id;
    let doctor = {
      name: req.body.name,
      user: req.user._id,  // Mongo ID
      hospital: req.body.hospital
    };

    if (doctor.name == null || doctor.user == null || doctor.hospital == null) {
      return res.status(400).json({
        ok: false,
        message: "Introduce los datos",
      });
    }

    await doctorModel.findByIdAndUpdate(id, {$set: doctor}, (err, updatedDoctor) => {
      if (!updatedDoctor){
        return res.status(400).json({
          ok: false,
          message: "Doctor with " + id + " doesn't exist",
          err
        });
      }

      if (err){
        return  res.status(500).json({
            ok: false,
            message: 'Error al actualizar Doctor',
            err
          });
      }

      res.status(200).json({
        ok: true,
        doctor: updatedDoctor
      });  // Send Doctor to server as JSON
    });  // Find by ID and Update in MongoDB
}

DOCTORCTRL.deleteDoctor = async (req, res) => {  // Remove Doctor from MongoDB

  let id = req.params.id;
  console.log(id)
  await doctorModel.findByIdAndRemove(id, (err, deletedDoctor) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error deleting Doctors",
        err
      });
    }

    if (!deletedDoctor) {
      return res.status(400).json({
        ok: false,
        message: "Doctor with " + id + " doesn't exist",
      });
    }

    res.status(200).json({
      ok: true,
      doctor: deletedDoctor
    });  // Send Doctor to server as JSON

  });  // Remove by ID

}

module.exports = DOCTORCTRL;  // Exports the Object with all the Methods
