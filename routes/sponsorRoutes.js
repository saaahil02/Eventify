const express=require('express')
const AuthMiddleware=require('../middlewares/authMiddleware')
const {getSponsorProfile} = require('../controllers/spoCtrl')

const router = express.Router()

router.get('/profile',AuthMiddleware,getSponsorProfile)

module.exports=router