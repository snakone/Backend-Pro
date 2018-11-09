const mainRouter = require('express').Router();  // Express Router

const MAIN = require('../controllers/main');  // User Controller

mainRouter.get('/', MAIN.function);

module.exports = mainRouter;  // Export router - Export Class on TypeScript
