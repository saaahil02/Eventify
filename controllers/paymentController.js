const { data } = require('framer-motion/client')
const {instance} = require('../paymentInstance')
const crypto=require('crypto')
const PaymentModel = require('../models/PaymentModel')

const Eventcheckout = async (req,res) => {
    try {
        const amount=req.body.amount
        console.log('amount',amount)
       
        const options={
            amount:Number(req.body.amount*100),
            currency:'INR',
        
        }
        const order=await instance.orders.create(options)
        console.log(order)
        res.status(200).json({
            sucess:true,
            message:"Payment Successfully done",
            order
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess:false,
            message:"Payment Failed"
        })
    }
}


const EventpaymentVerification = async (req,res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
        const data = req.body;
        console.log(data)
        const eventId = req.body.id;
        console.log("Event ID:",eventId)
        const userId = req.body.userId;
        console.log("User Id",userId)
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            console.log("All good till")
            // Database comes here

            await PaymentModel.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId,
            userId
            });

            // res.redirect(
            // '/api/v1/payment/paymentVerification'
            // );
        } else {
            res.status(400).json({
            success: false,
            });
        }
        



        // res.status(200).json({
        //     sucess:true,
        //     message:"Payment  Verification Successfully done",
            
        // })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess:false,
            message:"Payment Verification Failed"
        })
    }
}

const paymentDetails = async (req,res) =>{
    const userId=req.body.userId
    console.log("User ID:",userId)
    const eventId=req.params.id;
    console.log("Event Id:",eventId)
    const data = await PaymentModel.find({userId,eventId})
    console.log("Data",data)
    // if(data.userId==userId && data.eventId==eventId)
    // {
    //     const status="true"
    // }
    // else{
    //     const status="false"
    //}
    // Check if any payment record exists
    let status;
    if (data && data.length > 0) {
      status = true;  // Payment exists
    } else {
      status = false; // Payment does not exist
    }
    res.status(200).json({
        success:true,
        status,
    })

}

module.exports={Eventcheckout,EventpaymentVerification,paymentDetails}