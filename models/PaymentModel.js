const mongoose=require('mongoose');

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
   userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
   eventId: {type: mongoose.Schema.Types.ObjectId, ref: 'events'},
   status:{
    type:String,
    default:'true'
  }
},{timestamps:true});

const PaymentModel = mongoose.model("Payment", paymentSchema);
module.exports=PaymentModel