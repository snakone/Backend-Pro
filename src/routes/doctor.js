const doctorRouter = require('express').Router();  // Express Router
const DOCTOR = require('../controllers/doctor');  // Doctor Controller
const AUTH = require('../middlewares/authentication');

doctorRouter.get('/doctors', DOCTOR.getDoctors);
doctorRouter.post('/doctors', AUTH.verifyToken, DOCTOR.addDoctor);
doctorRouter.put('/doctors/:id', AUTH.verifyToken, DOCTOR.updateDoctorbyId);
doctorRouter.delete('/doctors/:id', AUTH.verifyToken, DOCTOR.deleteDoctor);

module.exports = doctorRouter;  // Export router - Export Class on TypeScript
