const { v4: uuidv4 } = require('uuid'); // Use UUID for unique form IDs if needed
const userModel =require('../models/userModels');
const bcrypt =require('bcryptjs');
const jwt=require('jsonwebtoken');
const OrganizerModel=require('../models/OrganizerModels');
const SponsorModel=require('../models/SponsorModels');
const Event=require('../models/EventModel');
const Participant=require('../models/ParticipantModel');
const mongoose = require('mongoose');
const EventModel = require('../models/EventModel');




//Register callback
const registerController =async(req,res)=>{
    try {
        const existinguser =await userModel.findOne({email:req.body.email});
        if(existinguser){
            return res.status(200).send({message:'User Already Exist',success:false});
        }
        const password =req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt);
        req.body.password=hashedPassword;
        const newUser =new userModel(req.body);
        await newUser.save();
        res.status(200).send({message:'Register Succesfully',success:true});

    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,message:`Register Controller ${error.message}`});
    }
}



const loginController = async(req,res)=> {
    try {
        const user = await userModel.findOne({email:req.body.email});
        if(!user){
            return res.status(200).send({message:'Invalid Email',success:false})
        }
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
            return res.status(200).send({message:'Invalid Password',success:false})
            }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d',});
        res.status(201).send({message:'Login Succesfully',success:true,token});
            
    } catch (error) {
        console.log(error)
        res.status(500).send({message:`Error in Login Controller ${error.message}`});
    }
}



const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });

        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }

        // Exclude the password field from the response
        user.password = undefined;

          // Update the message if user.isOrganizer is true
          let message = 'Your request has been submitted!';
          if (user.isOrganizer) {
              message = 'Your request has been approved!';
          }

        res.status(200).send({
            success: true,
            data: user,
            message: message, // Include the dynamic message
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'auth ERROR',
            success: false,
            error: error.message || error,
        });
    }
};




const applyOrganizerController = async (req, res) => {
    try {

        const { organizationName, organizationEmail } = req.body;

        // Validate incoming data (consider using Joi or express-validator)
        if (!organizationName || !organizationEmail) {
            return res.status(400).send({
                success: false,
                message: "Organization name and email are required"
            });
        }

        // Check if files are uploaded
        if (!req.files || !req.files.organizationAffiliationCertificate || !req.files.organizationProofOfAddress) {
            return res.status(400).send({
                success: false,
                message: 'Both affiliation certificate and proof of address are required',
            });
        }

           // Get file paths
           const affiliationCertificatePath = req.files.organizationAffiliationCertificate[0].path;
           const proofOfAddressPath = req.files.organizationProofOfAddress[0].path;

             // Convert backslashes to forward slashes before saving to database
            const formattedAffiliationCertificate = affiliationCertificatePath.replace(/\\/g, '/');
            const formattedProofOfAddress = proofOfAddressPath.replace(/\\/g, '/');

            // Create new organizer document
            const newOrganizer = new OrganizerModel({
                ...req.body,
                status: 'pending',
                organizationAffiliationCertificate: formattedAffiliationCertificate,
                organizationProofOfAddress: formattedProofOfAddress
            });

        // Save organizer to the database
        await newOrganizer.save();

        // Retrieve admin user
        const adminUser = await userModel.findOne({ isAdmin: true });
        if (!adminUser) {
            return res.status(404).send({
                success: false,
                message: "Admin user not found"
            });
        }

        // Add notification for the admin
        const notification = adminUser.notification || [];
        notification.push({
            type: 'apply-organizer-request',
            message: `${newOrganizer.organizationName} (${newOrganizer.organizationEmail}) has applied for an organizer account`,
            data: {
                organizerId: newOrganizer._id,
                name: newOrganizer.organizationName,
                onClickPath: '/admin/organizers'
            }
        });

        // Update admin notifications
        await userModel.findByIdAndUpdate(adminUser._id, { notification });

        // Respond to the client
        res.status(201).send({
            success: true,
            message: 'Organizer account applied successfully'
        });
    } catch (error) {
        console.error("Error during applyOrganizerController:", error);
        res.status(500).send({
            success: false,
            message: "An error occurred while registering for organizer",
            error: error.message || error
        });
    }
};


const applySponsorController = async(req,res)=>{
    try {
        const { organizationName, organizationEmail } = req.body;

       

          // Validate incoming data (consider using Joi or express-validator)
          if (!organizationName || !organizationEmail) {
            return res.status(400).send({
                success: false,
                message: "Organization name and email are required"
            });
        }

        // Check if files are uploaded
        if (!req.files || !req.files.organizationAffiliationCertificate || !req.files.organizationProofOfAddress) {
            return res.status(400).send({
                success: false,
                message: 'Both affiliation certificate and proof of address are required',
            });
        }

           // Get file paths
           const affiliationCertificatePath = req.files.organizationAffiliationCertificate[0].path;
           const proofOfAddressPath = req.files.organizationProofOfAddress[0].path;

            // Convert backslashes to forward slashes before saving to database
            const formattedAffiliationCertificate = affiliationCertificatePath.replace(/\\/g, '/');
            const formattedProofOfAddress = proofOfAddressPath.replace(/\\/g, '/');

            // Create new sponsor document
            const newSponsor = new SponsorModel({
                ...req.body,
                status: 'pending',
                organizationAffiliationCertificate: formattedAffiliationCertificate,
                organizationProofOfAddress: formattedProofOfAddress
            });

        // Save organizer to the database
        await newSponsor.save();

        // Retrieve admin user
        const adminUser = await userModel.findOne({ isAdmin: true });
        if (!adminUser) {
            return res.status(404).send({
                success: false,
                message: "Admin user not found"
            });
        }

        // Add notification for the admin
        const notification = adminUser.notification || [];
        notification.push({
            type: 'apply-sponsor-request',
            message: `${newSponsor.organizationName} (${newSponsor.organizationEmail}) has applied for an organizer account`,
            data: {
                organizerId: newSponsor._id,
                name: newSponsor.organizationName,
                onClickPath: '/admin/sponsors'
            }
        });

        // Update admin notifications
        await userModel.findByIdAndUpdate(adminUser._id, { notification });

        // Respond to the client
        res.status(201).send({
            success: true,
            message: 'Sponsor account applied successfully'
        });
        } catch (error) {
            console.error("Error during applySponsorController:", error);
            res.status(500).send({
                success: false,
                message: "An error occurred while registering for Sponsor",
                error: error.message || error
            });
        }
}

//notification ctrl
const getAllNotificationController = async(req,res)=>{
    try {
       const user = await userModel.findOne({_id:req.body.userId}) 
       const  seennotification = user.seennotification
       const notification = user.notification
       seennotification.push(...notification)
       user.notification=[]
       user.seennotification=notification
       const updateUser =await user.save()
       res.status(200).send({success:true,message:'Notification Seen',data:updateUser,})

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:`Error in notification`,
            success:false,
            error
        })
    }
}

// delete notifications
const deleteAllNotificationController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      user.notification = [];
      user.seennotification = [];
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "Notifications Deleted successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "unable to delete all notifications",
        error,
      });
    }
  };


  // Controller to check if the user has already submitted the organizer form
  const checkSponosrStatusController = async (req, res) => {
    try {
        // Extract userId from req.body.userId instead of req.user.id for consistency
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).send({
                success: false,
                message: "User ID is required",
            });
        }

        // Check if the user has already submitted the organizer form
        const sponsor = await SponsorModel.findOne({ userId });

        if (sponsor) {
            return res.status(200).send({
                success: true,
                submitted: true,
                message: "Form already submitted",
            });
        }

        // If no record found
        res.status(200).send({
            success: true,
            submitted: false,
            message: "Form not submitted",
        });
    } catch (error) {
        console.error("Error checking sponsor status:", error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message || error,
        });
    }
};

 // Controller to check if the user has already submitted the organizer form
 const checkOrganizerStatusController = async (req, res) => {
    try {
        // Extract userId from req.body.userId instead of req.user.id for consistency
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).send({
                success: false,
                message: "User ID is required",
            });
        }

        // Check if the user has already submitted the organizer form
        const organizer = await OrganizerModel.findOne({ userId });

        if (organizer) {
            return res.status(200).send({
                success: true,
                submitted: true,
                message: "Form already submitted",
            });
        }

        // If no record found
        res.status(200).send({
            success: true,
            submitted: false,
            message: "Form not submitted",
        });
    } catch (error) {
        console.error("Error checking organizer status:", error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message || error,
        });
    }
};

const UserProfile=async(req,res)=>{
    try {
        // Ensure userId exists
        if (!req.body.userId) {
          return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }
    
        // Fetch user details
        const user = await userModel.findById(req.body.userId).select('-password');
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

         // Fetch events the user has participated in
         const participatedEvents = await Event.find({
            participants: req.body.userId, // Match events where the user is a participant
        });
        
        
        // Send user profile response
        res.status(200).send({
          success: true,
          user:{
            ...user.toObject(),
            events: participatedEvents, // Add events to user profile response
          },
            message:'Users Profile',
           
            
        });
      } catch (error) {
        console.error('Error in UserProfile:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
        });
      }
    
}


const EventDisplay = async (req, res) => {
    try {
        const eventId = req.params.id;

        if (!eventId) {
            return res.status(400).json({ success: false, message: "Event ID is required" });
        }

        // Find the event by ID
        const event = await Event.findById(eventId).populate('participants','_id').exec();

       

        // If the event does not exist
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
       

        // Send success response with the event data and registration status
        res.status(200).json({
            success: true,
            data: event,
            
        });
    } catch (error) {
        // Handle unexpected server errors
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const registerForEvent = async (req, res) => {
    const { id } = req.params; // Event ID from the URL
    const { name, email, phone, responses} = req.body; // Participant details from the request body
    console.log("responses",responses)
    const userId = req.body.userId;
    console.log(userId)
    try {
        // Check if the event exists
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

       
        const isRegistered =await EventModel.findOne({_id:id,participants:userId})

        console.log("Already Regitered",isRegistered)

        if (isRegistered) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event.',
                data:isRegistered,
            });
        }
        else{
            // Create a new participant entry
        const UserResponse = {
            eventId:id,
            responses,
            userId: req.body.userId, // Assuming userId is the logged-in user's ID
        };

        const user = await userModel.findById(req.body.userId)

       event.participants.push(req.body.userId);

      

        event.response.push(UserResponse);


       
        // Save the updated event with the new participant
        await event.save();

        //await newParticipant.save();
        }

        // Send a success response
        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            data: event, // Optionally return the updated event
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
};


const unregisterForEvent = async (req, res) => {
    const { id } = req.params; // Event ID from the URL
    const { email } = req.body; // Participant's email from the request body

    try {
        // Check if the event exists
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Find the participant by email and eventId
        const existingParticipant = await Participant.findOne({ eventId: id, email });
        if (!existingParticipant) {
            return res.status(400).json({
                success: false,
                message: 'You are not registered for this event.',
            });
        }

        // Delete the participant entry
        await Participant.deleteOne({ _id: existingParticipant._id });

        // Send a success response confirming the unregistration
        res.status(200).json({
            success: true,
            message: 'Unregistration successful!',
        });
    } catch (error) {
        console.error('Error during unregistration:', error);
        res.status(500).json({ success: false, message: 'Unregistration failed', error: error.message });
    }
};


const getOrganizerEvents = async (req, res) => {
    try {
        // Accessing userId from req.body (set by the middleware)
        const userId = req.body.userId;

        // Check if userId exists in the request body
        if (!userId) {
            return res.status(400).send({
                message: "User ID is missing in the request.",
                success: false
            });
        }

         // Get the current date and time
        // const currentDate = new Date().toISOString();
        // console.log(currentDate)

        const currentDate = new Date();
        // const offset = -date.getTimezoneOffset(); // Timezone offset in minutes
        // const sign = offset >= 0 ? '+' : '-';
        // const pad = num => String(Math.abs(num)).padStart(2, '0');

        // const localISO = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${String(date.getMilliseconds()).padStart(3, '0')}${sign}${pad(Math.floor(offset / 60))}:${pad(offset % 60)}`;
        // console.log(localISO);

        // const selectedDate = req.body.eventDate; // e.g., 2025-01-28
        // const selectedTime = req.body.eventTime; // e.g., 14:30

        // const eventDateTime = new Date(`${selectedDate}T${selectedTime}:00.000Z`);
        // console.log("Combined Date-Time:", eventDateTime);

        // Fetch the events for the organizer using the userId
        const events = await Event.find({ userId: userId,
            eventDate:{$gt:currentDate}, });

        if (!events || events.length === 0) {
            return res.status(404).send({
                message: `No events found for the given organizer with user ID: ${userId}`,
                success: false
            });
        }

        res.status(200).send({
            message: "Events retrieved successfully.",
            success: true,
            data: events
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "An error occurred while retrieving events.",
            success: false
        });
    }
};


  



const getEventParticipants = async (req, res) => {
  const { eventId } = req.params;
  console.log("Event ID",eventId)

  try {
    // Ensure that eventId is converted to ObjectId type
    // const objectId = new mongoose.Types.ObjectId(eventId); // Use 'new' here
    // console.log("Object ID",objectId)
    // const participants1 = await EventModel.find({  _id:objectId});
    // console.log("participants",participants1)
    // const participants = participants1.participants
    // console.log("Part",participants)

    const event = await EventModel.findById(eventId).populate('participants', 'name email contact')

   // console.log("Event",event)
    const participants= event.participants
    console.log("part",participants)
    if (!participants || participants.length === 0) {
      return res.status(404).json({ message: 'No participants found for this event' });
    }

    return res.status(200).json({ data: participants});
  } catch (err) {
    console.error('Error fetching participants:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


  const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: { ...user._doc, isOrganizer: user.isOrganizer } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const ChatroomController = async(req,res) => {
   // const { eventId } = req.params;
    
    const { message,eventId } = req.body;
    console.log(eventId)
    console.log(message)
    try {
        // Fetch the event and verify its existence
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found 123' });
        }
        const  userId =req.body.userId;
        console.log(userId)
       // const {user}=await userModel.findOne({userId})
       // console.log(user)
        // Fetch the user by userId and handle the case if the user doesn't exist
    const user = await userModel.findOne({ _id: userId }); // Use _id instead of userId
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log(user);
    console.log(user.email)

        // Add the message to the chatroom
        const newMessage = {
            senderId: req.body.userId, // Extracted from auth middleware
            senderEmail:user.email,
            message,
        };
        event.chatroom.push(newMessage);
        await event.save();

        res.status(200).json({ success: true, message: 'Message added to chatroom', chatroom: event.chatroom });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const SponsorRequest = async (req,res) => {
    const { id } = req.params;
    const data = req.body;
    
    const {sponsorAmount,sponsorDescription} = req.body;
    console.log(sponsorAmount)
    console.log(sponsorDescription)
    // console.log(data)
    // console.log(id)
    const userId = req.body.userId
    console.log(userId)
    const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found 123' });
        }
    const sponsor =await SponsorModel.findOne({userId});
    console.log(sponsor)
    if (!sponsor) {
        return res.status(404).json({ success: false, message: 'Sponsor not found' });
      }
    console.log(sponsor)
    console.log(sponsor.organizationName)
    const newRequest ={
        sponsorId:sponsor._id,
        sponsorName:sponsor.organizationName,
        sponsorEmail:sponsor.organizationEmail,
        sponsorAmount,
        sponsorDescription,
        userId,
    }
    event.sponsorRequest.push(newRequest)
    await event.save();
    res.status(200).json({
        success:true,
        message:'Request sent Successfully'
    })

}




module.exports = {
    loginController,
    registerController,
    authController,applyOrganizerController,applySponsorController,getAllNotificationController,deleteAllNotificationController,checkOrganizerStatusController
    ,checkSponosrStatusController,EventDisplay,registerForEvent,unregisterForEvent,getOrganizerEvents,getEventParticipants,getUserData,UserProfile,
    ChatroomController,SponsorRequest,
  };