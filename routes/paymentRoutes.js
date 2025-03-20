const express=require('express')

const { Eventcheckout, EventpaymentVerification, paymentDetails }=require('../controllers/paymentController')
const AuthMiddleware=require('../middlewares/authMiddleware')

const router=express.Router()

router.post('/checkout',AuthMiddleware,Eventcheckout)

router.post('/paymentVerification',EventpaymentVerification)

router.get('/paymentDetails/:id',AuthMiddleware,paymentDetails)

module.exports=router