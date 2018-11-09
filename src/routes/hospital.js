const hospitalRouter = require('express').Router();  // Express Router
const HOSPITAL = require('../controllers/hospital');  // Hospital Controller
const AUTH = require('../middlewares/authentication');

hospitalRouter.get('/hospitals', HOSPITAL.getHospitals);
hospitalRouter.post('/hospitals', AUTH.verifyToken, HOSPITAL.addHospital);
hospitalRouter.put('/hospitals/:id', AUTH.verifyToken, HOSPITAL.updateHospitalbyId);
hospitalRouter.delete('/hospitals/:id', AUTH.verifyToken, HOSPITAL.deleteHospital);

module.exports = hospitalRouter;  // Export router - Export Class on TypeScript
