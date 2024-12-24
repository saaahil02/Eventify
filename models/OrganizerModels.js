const mongoose=require('mongoose');

const OrganizerSchema = new mongoose.schema({
    userId:{
        type:String,
    },
    name:{
        type:String,
        required:[true,'name is required'],
    },
    email:{
        type:String,
        required:[true,'email is required'],
    },
    address:{
        type:String,
        required:[true,'address is required'],
    },
    website:{
        type:url,
        required:[true,'Provide valid website link'],
    },
    


});

const OrganizerModel = mongoose.model('users',OrganizerSchema);

module.exports=OrganizerModel;