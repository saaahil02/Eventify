const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userId:{
    type:String
  },
  questions:[{
    text: {
      type: String,
      required: true, // The question text is mandatory
    },
    type: {
      type: String,
      enum: ['text', 'radio', 'paragraph', 'checkbox'], // Restrict to valid types
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
  }
  ]
  
  
},{timestamps:true});



const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
