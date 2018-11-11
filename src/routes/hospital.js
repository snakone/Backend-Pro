const hospitalRouter = require('express').Router();  // Express Router
const HOSPITAL = require('../controllers/hospital');  // Hospital Controller
const AUTH = require('../middlewares/authentication');

hospitalRouter.get('/hospitals', HOSPITAL.getHospitals);
hospitalRouter.get('/hospital/:id', HOSPITAL.getHospitalById);
hospitalRouter.post('/hospitals', [AUTH.verifyToken,
                                   AUTH.verifyAdmin], HOSPITAL.addHospital);
hospitalRouter.put('/hospitals/:id', [AUTH.verifyToken,
                                      AUTH.verifyAdmin], HOSPITAL.updateHospitalById);
hospitalRouter.delete('/hospitals/:id', [AUTH.verifyToken,
                                         AUTH.verifyAdmin], HOSPITAL.deleteHospital);

module.exports = hospitalRouter;  // Export router - Export Class on TypeScript
