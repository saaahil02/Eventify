const mongoose=require('mongoose');
const validator=require('validator');


const SponsorSchema = new mongoose.Schema({
  userId: {
      type: String,
    },
   organizationName: {
       type: String,
       required: [true, 'Organization Name is required'],
      //  match: [/^[A-Za-z\s]+$/, 'Organization Name should contain only alphabets and spaces'],
      //  trim: true,
     },
     
     // Organization Email: Valid email format
     organizationEmail: {
       type: String,
       required: [true, 'Organization Email is required'],
      //  unique: true,
      //  validate: [validator.isEmail, 'Please provide a valid email address'],
      //  lowercase: true,
      //  trim: true,
     },
     
     // Organization Type: Non-profit, Individual, Corporation
     organizationType: {
       type: String,
       required: [true, 'Organization Type is required'],
       enum: ['Non-profit', 'Individual', 'Corporation'],
     },
     
     // Organization Affiliation Certificate: Must be a valid document (string for now, can be extended for file validation)
     organizationAffiliationCertificate: {
       type: String,
       required: [true, 'Organization Affiliation Certificate is required'],
      //  validate: {
      //    validator: function(value) {
      //      // Add document validation logic (e.g., file types, size)
      //      return value && value.length > 0; // For simplicity, assuming a non-empty string
      //    },
      //    message: 'Please upload a valid document',
      //  },
     },
     
     // Organization Proof of Address: Must be a valid document
     organizationProofOfAddress: {
       type: String,
       required: [true, 'Organization Proof of Address is required'],
      //  validate: {
      //    validator: function(value) {
      //      return value && value.length > 0;
      //    },
      //    message: 'Please upload a valid document',
      //  },
     },
     
     // Organization Website: Valid URL format
     organizationWebsite: {
       type: String,
       required: [true, 'Organization Website is required'],
      //  validate: [validator.isURL, 'Please provide a valid website link'],
     },
     
     // Representative Name: Proper name
     representativeName: {
       type: String,
       required: [true, 'Representative Name is required'],
      //  match: [/^[A-Za-z\s]+$/, 'Representative Name should contain only alphabets and spaces'],
      //  trim: true,
     },
     
     // Representative Contact No: Must be a 10-digit number
     representativeContactNo: {
       type: String,
       required: [true, 'Representative Contact Number is required'],
      //  match: [/^\d{10}$/, 'Representative Contact Number should be a 10-digit number'],
     },
     
     // Representative Role in Organization: The role (e.g., Principal)
     representativeRole: {
       type: String,
       required: [true, 'Representative Role is required'],
      //  trim: true,
     },
     
     status:{
       type:String,
       default:'pending'
     }
    
},{timestamps:true});


const SponsorModel = mongoose.model('sponsors',SponsorSchema);

module.exports=SponsorModel;