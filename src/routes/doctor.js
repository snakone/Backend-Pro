const doctorRouter = require('express').Router();  // Express Router
const DOCTOR = require('../controllers/doctor');  // Doctor Controller
const AUTH = require('../middlewares/authentication');

doctorRouter.get('/doctors', DOCTOR.getDoctors);
doctorRouter.get('/doctor/:id', DOCTOR.getDoctorById);
doctorRouter.post('/doctors', [AUTH.verifyToken,
                               AUTH.verifyAdmin], DOCTOR.addDoctor);
doctorRouter.put('/doctors/:id', [AUTH.verifyToken,
                                  AUTH.verifyAdmin], DOCTOR.updateDoctorById);
doctorRouter.delete('/doctors/:id', [AUTH.verifyToken,
                                     AUTH.verifyAdmin], DOCTOR.deleteDoctor);

module.exports = doctorRouter;  // Export router - Export Class on TypeScript
