const uploadRouter = require('express').Router();  // Express Router
const UPLOAD = require('../controllers/upload');  // User Controller

uploadRouter.put('/upload/:collection/:id', UPLOAD.uploadFile);

module.exports = uploadRouter;  // Export router - Export Class on TypeScript
