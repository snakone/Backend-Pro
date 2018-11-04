const userModel = require('../models/user');  // Hospital Model = MongoDB Collection
const doctorModel = require('../models/doctor');  // Hospital Model = MongoDB Collection
const hospitalModel = require('../models/hospital');  // Hospital Model = MongoDB Collection

const SEARCHCTRL = {};  // Create Object. We add Methods to it so We can use them OUTSIDE later

SEARCHCTRL.searchValue = async (req, res)=> {

  let value = req.params.value;
  let filter = new RegExp (value, 'i');  // Insensible to Upper/Lower Case

  Promise.all([
          searchUsers(value,filter),
          searchHospitals(value,filter),
          searchDoctors(value,filter),
        ]).then(result => {
          res.status(200).json({
            ok: true,
            hospitals: result[0],
            doctors: result[1],
            users: result[2]
          });
        })
  };

SEARCHCTRL.searchData = async (req, res)=> {

  let collection = req.params.collection;
  let value = req.params.value;
  console.log(req.params)
  let filter = new RegExp (value, 'i');  // Insensible to Upper/Lower Case
  let promise;

  switch(collection){
    case 'users':
      promise = searchUsers(value, filter);
      break;
    case 'hospitals':
      promise = searchHospitals(value, filter);
      break;
    case 'doctors':
      promise = searchDoctors(value, filter);
      break;
    default:
      return res.status(400).json({
          ok: false,
          message: 'Tipos de búsqueda: \"user\", \"hospital\", \"doctor\"',
          error: {message: "Colección de la DB no válida"}
        });
  }

    promise.then(data => {
      return res.status(200).json({
          ok: true,
          [collection]: data  // ECMA Object Property
        });
    })
  };  // End of GET


function searchUsers(value, filter){
  return new Promise((res,req) => {
    userModel.find({}, 'name email role')
             .or([{'name': filter}, {'email': filter}])
             .exec((err, users) => {
                if (err) req('Error al cargar usuarios ', err)
                else res(users)
             });
  });
}

function searchHospitals(value, filter){
  return new Promise((res,req) => {
    hospitalModel.find({name: filter}, (err, hospitals) => {
      if (err){
        req('Error al cargar Hospitales ', err);
      } else {
        res(hospitals);
      }
    }).populate('user', 'name email');
  });
}

function searchDoctors(value, filter){
  return new Promise((res,req) => {
    doctorModel.find({name: filter}, (err, doctors) => {
      if (err){
        req('Error al cargar Doctors ' + err);
      } else {
        res(doctors);
      }
    }).populate('user','name email')
      .populate('hospital');
  });
}

module.exports = SEARCHCTRL;  // Exports the Object with all the Methods
