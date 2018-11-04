const userRouter = require('express').Router();  // Express Router
const USER = require('../controllers/user');  // User Controller
const AUTH = require('../middlewares/authentication');

userRouter.get('/users', USER.getUsers);
userRouter.post('/users', AUTH.verifyToken, USER.addUser);
userRouter.put('/users/:id', AUTH.verifyToken, USER.updateUserbyId);
userRouter.delete('/users/:id', AUTH.verifyToken, USER.deleteUser);

module.exports = userRouter;  // Export router - Export Class on TypeScript
