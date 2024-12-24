const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
    },
    email:{
        type:String,
        required:[true,'email is required'],
    },
    contact:{
        type:Number,
        required:[false,'contact is required'],
    },
    password:{
        type:String,
        required:[true,'password is required'],
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    isOrganizer:{
        type:Boolean,
        default:false,
    },
    isSponsor:{
        type:Boolean,
        default:false,
    },
    notification:{
        type:Array,
        default:[]
    },
    seennotification:{
        type:Array,
        default:[]
    }
});

const userModel = mongoose.model('users',userSchema);

module.exports=userModel;