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
    },
    events: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'events' 
      }], // Add this line to track the events the user is participating in
    
},{timestamps:true});

const userModel = mongoose.model('users',userSchema);

module.exports=userModel;