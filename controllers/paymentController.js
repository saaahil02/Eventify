const {instance} = require('../paymentInstance')

const Eventcheckout = async (req,res) => {
    try {
        console.log(instance)
        const options={
            amount:100,
            currency:'INR',
        }
        const order=await instance.orders.create(options)
        console.log(order)
        res.status(200).json({
            sucess:true,
            message:"Payment Successful"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess:false,
            message:"Payment Failed"
        })
    }
}

module.exports={Eventcheckout}