const mongoose=require('mongoose');

const SponsorSchema = new mongoose.schema({
    organizationName: {
        type: String,
        required: [true, 'Organization Name is required'],
        validate: {
          validator: function(v) {
            return /^[A-Za-z\s]+$/.test(v); // Allows only letters and spaces
          },
          message: props => `${props.value} is not a valid organization name!`
        }
      },
    
      // Organization Email: Accepts only valid email addresses
      organizationEmail: {
        type: String,
        required: [true, 'Organization Email is required'],
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
      },
    
      // Organization Type: Accepts only specified types
      organizationType: {
        type: String,
        required: [true, 'Organization Type is required'],
        enum: ['Non-profit', 'Individual', 'Corporation'],
        message: props => `${props.value} is not a valid organization type!`
      },
    
      // Organization Affiliation Certificate: Accepts only valid documents
      affiliationCertificate: {
        type: String,
        required: [true, 'Organization Affiliation Certificate is required'],
        validate: {
          validator: function(v) {
            return /\.(pdf|docx|jpg|png)$/i.test(v); // Accepts PDF, DOCX, JPG, PNG files
          },
          message: props => `${props.value} is not a valid document type!`
        }
      },
    
      // Organization Proof of Address: Accepts only valid documents
      proofOfAddress: {
        type: String,
        required: [true, 'Organization Proof of Address is required'],
        validate: {
          validator: function(v) {
            return /\.(pdf|docx|jpg|png)$/i.test(v); // Accepts PDF, DOCX, JPG, PNG files
          },
          message: props => `${props.value} is not a valid document type!`
        }
      },
    
      // Organization Website: Accepts only valid website links
      website: {
        type: String,
        required: [true, 'Organization Website is required'],
        match: [/(https?:\/\/[^\s]+)/, 'Please provide a valid website URL']
      },
    
      // Representative Name: Accepts only proper names
      representativeName: {
        type: String,
        required: [true, 'Representative Name is required'],
        validate: {
          validator: function(v) {
            return /^[A-Za-z\s]+$/.test(v); // Allows only letters and spaces
          },
          message: props => `${props.value} is not a valid representative name!`
        }
      },
    
      // Representative Contact Number: Accepts only 10-digit numbers
      representativeContactNo: {
        type: String,
        required: [true, 'Representative Contact Number is required'],
        validate: {
          validator: function(v) {
            return /^\d{10}$/.test(v); // Ensures exactly 10 digits
          },
          message: props => `${props.value} is not a valid contact number!`
        }
      },
    
      // Representative Role in Organization: Accepts the role of representative
      representativeRole: {
        type: String,
        required: [true, 'Representative Role is required'],
        enum: ['Principal', 'Manager', 'Director'],
        message: props => `${props.value} is not a valid representative role!`
      },
    
      // Username: Accepts only proper names
      username: {
        type: String,
        required: [true, 'Username is required'],
        validate: {
          validator: function(v) {
            return /^[A-Za-z\s]+$/.test(v); // Allows only letters and spaces
          },
          message: props => `${props.value} is not a valid username!`
        }
      },
    
      // Password: While the user enters password, the field should show characters as ‘*’
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [5, 'Password must be at least 5 characters long']
      }
    
},{timestamps:true});


const SponsorModel = mongoose.model('users',SponsorSchema);

module.exports=SponsorModel;