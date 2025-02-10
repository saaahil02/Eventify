const express=require('express')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const {getSponsorProfile, getSponsoredEvents} = require('../controllers/spoCtrl')

const router = express.Router()
router.get('/profile',AuthMiddleware,getSponsorProfile)

router.get('/ListEvent',AuthMiddleware,getSponsoredEvents)


module.exports=router;