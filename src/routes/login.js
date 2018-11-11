const loginRouter = require('express').Router();  // Express Router
const LOGIN = require('../controllers/login');  // User Controller
const AUTH = require('../middlewares/authentication');

loginRouter.post('/login', LOGIN.login);
loginRouter.post('/login/google', LOGIN.loginGoogle);
loginRouter.get('/refresh-token', AUTH.verifyToken, LOGIN.refreshToken);

module.exports = loginRouter;  // Export router - Export Class on TypeScript
