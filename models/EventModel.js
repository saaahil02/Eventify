const mongoose=require('mongoose');
const { Schema } = mongoose;


const EventSchema = new mongoose.Schema({
    userId: {
      type: String,
    },
    eventName: { type: String, required: true},
    eventDescription: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventLastDate:{type:Date,required:true},
    eventLocation: { type: String, required: true },
    eventCategory: { type: String, required: true },
    eventSponsor: { type: String, required: false},
    SponsorDescription: { type: String,required:false },
    eventMaxParticipants: { type: Number, required: true },
    eventFee:{type:String,required:true},
    eventAmount:{type:String,required:false},
    //isFreeEvent: { type: Boolean, default: true },
    //ticketPrice: { type: Number, default: 0 },
     eventBannerUrl: { type: String, required: true },
    
      // Reference to the organizer
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'organizers', required: true },
  
  organizationName: {
    type: String,
    required: [true, 'Organization Name is required'],
    // match: [/^[A-Za-z\s]+$/, 'Organization Name should contain only alphabets and spaces'],
    // trim: true,
  },
  
  // Organization Email: Valid email format
  organizationEmail: {
    type: String,
    required: [true, 'Organization Email is required'],
    // unique: true,
    // validate: [validator.isEmail, 'Please provide a valid email address'],
    // lowercase: true,
    // trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active', // Default to active
  },

   participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}
    

   ],

  //  participants: [
  //       {
  //          eventId:{type:String},
  //         //  name:{type:String,required:true},
  //         // email:{type:String,required:true},
  //         // phone:{type:String,required:true},
  //         responses:[{}],
  //         userId:{type:String}
  //       },
  //   ],

   //questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],

   response: {
 
    type: [Schema.Types.Mixed], // Now accepts an array of any type (objects, strings, etc.)
    default: []
  
  },

   questions:[{
    text: {
      type: String,
      required: true, // The question text is mandatory
    },
    type: {
      type: String,
      enum: ['text', 'radio', 'paragraph', 'checkbox','number'], // Restrict to valid types
      required: true, // The question type is mandatory
    },
    options: {
      type: [String], // Array of strings for options, empty if not applicable
      default: [], // Default to an empty array
      required:true,
    },
    required: {
      type: Boolean, // Whether the question is mandatory
      default: false, // Default to false
    },
    validation:{
      type: String,
      required:false,
    },
    fixedDigits:{
      type:Number,
      required:false,
    },
    minRange:{
      type:Number,
      required:false,
    },
    maxRange:{
      type:Number,
      required:false,
    },
    emailValidation:{
      type:Boolean,
      required:false,
    }


  }
  ],


   chatroom: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // User ID of the sender
            senderEmail: { type:String, required: false }, // User ID of the sender
            message: { type: String, required: true }, // Chat message content
            timestamp: { type: Date, default: Date.now }, // When the message was sent
        },
    ],

    sponsorRequest:[
            {
          sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'events', required: true },
          sponsorName:{type:String,required:true},
          sponsorEmail:{type:String,required:true},
          sponsorDescription:{type:String,required:true},
          sponsorAmount:{type:String,required:true},
          userId:{type:String,required:false},
          status: { type: Boolean, default: false }
        }
        ],

    

}, { timestamps: true });


const EventModel = mongoose.model('events',EventSchema);

module.exports=EventModel;