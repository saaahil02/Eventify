const mongoose=require('mongoose');

const EventSchema = new mongoose.Schema({
    userId: {
      type: String,
    },
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventLastDate:{type:Date,required:true},
    eventLocation: { type: String, required: true },
    eventCategory: { type: String, required: true },
    eventMaxParticipants: { type: Number, required: true },
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
   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],

   chatroom: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // User ID of the sender
            senderEmail: { type:String, required: false }, // User ID of the sender
            message: { type: String, required: true }, // Chat message content
            timestamp: { type: Date, default: Date.now }, // When the message was sent
        },
    ],

    

}, { timestamps: true });


const EventModel = mongoose.model('events',EventSchema);

module.exports=EventModel;