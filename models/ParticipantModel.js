// models/Participant.js

const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  userId: {
      type: String,
    },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});


const ParticipantModel = mongoose.model('Participant', participantSchema);

module.exports=ParticipantModel

