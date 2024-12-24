const mongoose=require('mongoose');

const SponsorSchema = new mongoose.schema({
    userId:{
        type:String,
    },
});


const SponsorModel = mongoose.model('users',SponsorSchema);

module.exports=SponsorModel;