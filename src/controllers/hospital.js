const hospitalModel = require('../models/hospital');  // Hospital Model = MongoDB Collection

const HOSPITALCTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

HOSPITALCTRL.getHospitals = async (req, res) => {  // Get ALL HOSPITALS
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
      .limit(5)
      .populate('user','name email image');

      hospitalModel.countDocuments({},(err, count) => {
        res.status(200).json({
          ok: true,
          hospitals,
          hospitalCount: count
        });  // Send Hospital to server as JSON
      });

}


HOSPITALCTRL.addHospital = async (req, res) => {  // Add a HOSPITAL
    req.body.user = req.user._id;
    const hospital = new hospitalModel (req.body);
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

HOSPITALCTRL.updateHospitalbyId = async (req, res) => {  // Get ALL HOSPITALS
    let id = req.params.id;
    let hospital = {
      name: req.body.name,
      user: req.user._id
    };

    if (hospital.name == null || hospital.user == null) {
      return res.status(400).json({
        ok: false,
        message: "Introduce los datos",
      });
    }

    await hospitalModel.findByIdAndUpdate(id, {$set: hospital}, (err, updatedHospital) => {
      if (!updatedHospital){
        return res.status(400).json({
          ok: false,
          message: "Hospital with " + id + " doesn't exist",
          err
        });
      }

      if (err){
        return  res.status(500).json({
            ok: false,
            message: 'Error al actualizar Hospital',
            err
          });
      }

      res.status(200).json({
        ok: true,
        hospital: updatedHospital
      });  // Send Hospital to server as JSON
    });  // Find by ID and Update in MongoDB
}

HOSPITALCTRL.deleteHospital = async (req, res) => {  // Remove Hospital from MongoDB

  let id = req.params.id;
  console.log(id)
  await hospitalModel.findByIdAndRemove(id, (err, deletedHospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error deleting Hospitals",
        err
      });
    }

    if (!deletedHospital) {
      return res.status(400).json({
        ok: false,
        message: "Hospital with " + id + " doesn't exist",
      });
    }

    res.status(200).json({
      ok: true,
      hospital: deletedHospital
    });  // Send Hospital to server as JSON

  });  // Remove by ID

}

module.exports = HOSPITALCTRL;  // Exports the Object with all the Methods
