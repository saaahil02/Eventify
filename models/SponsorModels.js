const mongoose=require('mongoose');

const SponsorSchema = new mongoose.schema({
    userId:{
        type:String,
    },
    name:{
        type:String,
        required:[true,'name is required'],
    },
});


const SponsorModel = mongoose.model('users',SponsorSchema);

module.exports=SponsorModel;