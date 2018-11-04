const loginRouter = require('express').Router();  // Express Router
const LOGIN = require('../controllers/login');  // User Controller

loginRouter.post('/login', LOGIN.login);
loginRouter.post('/login/google', LOGIN.loginGoogle);

module.exports = loginRouter;  // Export router - Export Class on TypeScript
