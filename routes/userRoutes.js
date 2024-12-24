const express= require('express');
const {registerController,loginController, authController, }=require("../controllers/userCtrl");
const AuthMiddleware = require('../middlewares/AuthMiddleware');


//router object
const router=express.Router()

//routes
// Login || POST
router.post('/login',loginController);

// Register || POST
router.post('/register',registerController);

//Auth || POST
router.post('/getUserData',AuthMiddleware,authController);

module.exports= router;