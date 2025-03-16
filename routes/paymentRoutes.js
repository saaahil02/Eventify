const express=require('express')

const { Eventcheckout }=require('../controllers/paymentController')
const AuthMiddleware=require('../middlewares/authMiddleware')

const router=express.Router()

router.post("/checkout",Eventcheckout)

module.exports=router