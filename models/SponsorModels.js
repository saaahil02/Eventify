const mongoose=require('mongoose');

const SponsorSchema = new mongoose.schema({});


const SponsorModel = mongoose.model('users',SponsorSchema);

module.exports=SponsorModel;