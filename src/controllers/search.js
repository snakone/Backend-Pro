const userModel = require('../models/user');  // Hospital Model
const doctorModel = require('../models/doctor');  // Hospital Model
const hospitalModel = require('../models/hospital');  // Hospital Model

const SEARCHCTRL = {};  // Create Object.

SEARCHCTRL.searchValue = async (req, res)=> {  // Search Value Within ALL Collections

  let value = req.params.value;
  let filter = new RegExp (value, 'i');  // Insensible to Upper/Lower Case

  Promise.all([  // All at Once, Response with ALL Results if Success
          searchUsers(filter),
          searchHospitals(filter),
          searchDoctors(filter),
        ]).then(result => {
          res.status(200).json({
            ok: true,
            users: result[0],  // Just the Order
            hospitals: result[1],
            doctors: result[2]
          });
        });
}

SEARCHCTRL.searchData = async (req, res)=> {  // Search a Value within a Collection

  let collection = req.params.collection;
  let value = req.params.value;

  let filter = new RegExp (value, 'i');  // Insensible to Upper/Lower Case
  let promise;  // Save the Promise

  switch(collection){  // Switch and Assign Promises
    case 'users':
      promise = searchUsers(filter);
      break;
    case 'hospitals':
      promise = searchHospitals(filter);
      break;
    case 'doctors':
      promise = searchDoctors(filter);
      break;
    default:
      return res.status(400).json({
          ok: false,
          message: 'Allowed Collections: \"users\", \"hospitals\", \"doctors\"'
        });
    }

    promise.then(data => {
      return res.status(200).json({
          ok: true,
          [collection]: data  // ECMA Object Property
        });
    });
}  // End of Search Data

function searchUsers(filter){  // PROMISE WITH USERS
  return new Promise((res,req) => {
    userModel.find({'name': filter}, {password:0}, (err, users) => {
        if (err) req('Error loading Users', err)
        else res(users);
      });
  });
}

function searchHospitals(filter){  // PROMISE WITH HOSPITALS
  return new Promise((res,req) => {
    hospitalModel.find({'name': filter}, (err, hospitals) => {
      if (err) req('Error loading Hospitals ', err)
      else res(hospitals);
    }).populate('user', 'name email image');  // ID Mongo Ref
  });
}

function searchDoctors(filter){  // PROMISE WITH DOCTORS
  return new Promise((res,req) => {
    doctorModel.find({'name': filter}, (err, doctors) => {
      if (err) req('Error loading Doctors ', err);
      else res(doctors);
    }).populate('user','name email image')  // ID Mongo Ref
      .populate('hospital', 'name address image');
  });
}

module.exports = SEARCHCTRL;  // Exports the Object with all the Methods
