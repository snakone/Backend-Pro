const imageRouter = require('express').Router();  // Express Router

const IMAGE = require('../controllers/images');  // User Controller

imageRouter.get('/images/:collection/:image', IMAGE.getImage);

module.exports = imageRouter;  // Export router - Export Class on TypeScript
