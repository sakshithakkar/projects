const { Router } = require('express');
const userController = require('../controllers/userController');
const {isAuthorized} = require('../middleware/userMiddleware');

const router = Router();

router.get('/users/signup',userController.signupGet);

router.post('/users/signup',userController.signupPost);

router.get('/users/login',userController.loginGet);

router.post('/users/login',userController.loginPost);

router.get('/logout', userController.logoutGet);

router.get('/getUsersById/:userId',isAuthorized, userController.findById);

router.get('/users/list',isAuthorized, userController.listUsers);

router.patch('/updateUserById/:userId',isAuthorized,userController.updateUser);

module.exports = router;