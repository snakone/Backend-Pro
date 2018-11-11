const userRouter = require('express').Router();  // Express Router
const USER = require('../controllers/user');  // User Controller
const AUTH = require('../middlewares/authentication');

userRouter.get('/users', USER.getUsers);
userRouter.get('/user/:id', USER.getUserById);
userRouter.post('/users',  USER.addUser);
userRouter.put('/users/:id', [AUTH.verifyToken,
                              AUTH.verifySameUser], USER.updateUserById);
userRouter.delete('/users/:id', [AUTH.verifyToken,
                                 AUTH.verifyAdmin], USER.deleteUser);

module.exports = userRouter;  // Export router - Export Class on TypeScript
