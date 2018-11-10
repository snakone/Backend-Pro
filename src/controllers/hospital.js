const hospitalModel = require('../models/hospital');  // Hospital Model
const {LIMIT} = require('../config/config');
const HOSPITALCTRL = {};  // Create Object

// CREATE //
HOSPITALCTRL.addHospital = async (req, res) => {  // ADD A HOSPITAL

  req.body.user = req.user._id;
  const hospital = new hospitalModel (req.body);

  if (hospital.name == '' || hospital.user == null) {
    return res.status(400).json({
      ok: false,
      message: "Hospital needs Name, Address and User",
      action: "Creation"
    });
  }

  await hospital.save((err, createdHospital)=> {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error creating Hospital",
        err
      });
    }
      res.status(201).json({
        ok: true,
        hospital: createdHospital,
      });  // Send Hospital to server as JSON
  });
}

// READ //
HOSPITALCTRL.getHospitals = async (req, res) => {  // GET ALL HOSPITALS

  let offset = req.query.offset || 0;
  offset = Number (offset);
  const hospitals = await hospitalModel.find({}, {}, (err, hospitals) =>{
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error loading Hospitals",
        err
      });
    }
  }).skip(offset)
    .limit(LIMIT)
    .populate('hospital','name email image');

    hospitalModel.countDocuments({},(err, count) => {
      res.status(200).json({
        ok: true,
        hospitals,
        hospitalCount: count
      });  // Send Hospital to server as JSON
    });
}

// UPDATE //
HOSPITALCTRL.updateHospitalbyId = async (req, res) => {  // UPDATE HOSPITAL

  let id = req.params.id;
  await hospitalModel.findById(id, (err, hospital) => {
   if (err) {
       return res.status(500).json({
           ok: false,
           mensaje: 'Error searching Hospital',
           errors: err
       });
   }

   if (!hospital) {
       return res.status(400).json({
           ok: false,
           mensaje: "Hospital with ID " + id + " doesn't exist"
       });
   }

   hospital.name = req.body.name;  // Data Assignament
   hospital.address = req.body.address;
   console.log(hospital)

   if (hospital.name == '' || hospital.address == '') {
     return res.status(400).json({
       ok: false,
       message: "Hospital needs Name, Address and User",
       action: "Updating"
     });
   }

   hospital.save((err, updatedhospital) => {
       if (err) {
           return res.status(400).json({
               ok: false,
               mensaje: 'Error updating Hospital',
               errors: err
           });
       }

       res.status(200).json({
           ok: true,
           hospital: updatedhospital
       });
     });  // End of Save
  });  // End of Find
}

// DELETE //
HOSPITALCTRL.deleteHospital = async (req, res) => {  // DELETE HOSPITAL

  let id = req.params.id;
  hospitalModel.findByIdAndRemove(id, (err, deletedHospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error deleting Hospital",
        err
      });
    }

    if (!deletedHospital) {  // No Hospital?
      return res.status(400).json({
        ok: false,
        message: "Hospital with ID " + id + " doesn't exist",
      });
    }

    res.status(200).json({
      ok: true,
      hospital: deletedHospital
    });
  });  // Remove by ID
}

module.exports = HOSPITALCTRL;  // Exports the Object with all the Methods
