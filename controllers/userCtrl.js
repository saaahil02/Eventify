const userModel =require('../models/userModels');
const bcrypt =require('bcryptjs');
const jwt=require('jsonwebtoken');
const OrganizerModel=require('../models/OrganizerModels');
const SponsorModel=require('../models/SponsorModels');
const Event=require('../models/EventModel')
const Participant = require('../models/ParticipantModel');

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

// const authController=async(req,res)=>{
//     try {
//         const user = await userModel.findById({_id:req.body.userId})
//         user.password=undefined;
//         if(!user){
//             return res.status(200).send({message:'User not Found',success:false})
//         }
//         else{
//             res.status(200).send({
//                 success : true,
//                 data:user
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             message : "auth ERROR",
//             success : false,
//             error
//         })
//     }
// }

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


// const applyOrganizerController = async(req,res)=>{
//     try {
//          // Check if the email already exists
//         //  const existinguserOrg =await OrganizerModel.findOne({email:req.body.email});
//         // if(existinguserOrg){
//         //     return res.status(200).send({message:'User Already Exist',success:false});
//         // }
//         const newOrganizer = await OrganizerModel({...req.body,status:'pending'})
//         await newOrganizer.save()
//         const adminUser = await userModel.findOne({isAdmin:true})
//         const notification=adminUser.notification
//         notification.push({
//             type:'apply-organizer-requset',
//             message: `${newOrganizer.organizationName} ${newOrganizer.organizationEmail} has applied for an organizer account`,
//             data:{
//                 organizerId:newOrganizer._id,
//                 name: newOrganizer.organizationName,
//                 onClickPath :'/admin/organizers'
//             }
//         })
//         await userModel.findByIdAndUpdate(adminUser._id,{notification})
//         res.status(201).send({
//             success:true,
//             message:'Organizer Account Applied Succesfully'
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success:false,
//             error,
//             message:"An Error Occured while registering for Organizer"
//         })
//     }
// }

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

        // Create new organizer document
        const newOrganizer = new OrganizerModel({
            ...req.body,
            status: 'pending'
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

        // Create new sponsor document
        const newSponsor = new SponsorModel({
            ...req.body,
            status: 'pending'
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

const EventDisplay = async (req, res) => {
    try {
        const eventId = req.params.id;
        
        if (!eventId) {
            return res.status(400).json({ success: false, message: "Event ID is required" });
        }

        // Find the event by ID
        const event = await Event.findById(eventId);

        // If the event does not exist
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Send success response with the event data
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        // Handle unexpected server errors
        console.error(error);  // Log the error for debugging purposes
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const registerForEvent = async(req,res)=>{
    const { id } = req.params;
    const { name, email, phone } = req.body;
  
    try {
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
  
      const newParticipant = await Participant.create({
        eventId: id,
        name,
        email,
        phone,
      });
  
      res.status(201).json({ success: true, data: newParticipant });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Registration failed' });
    }
}

const getOrganizerEvents = async (req, res) => {
    try {
      const events = await Event.find({ organizerId: req.user.id }).populate('participants');
      const data = events.map((event) => ({
        ...event._doc,
        participantsCount: event.participants.length,
      }));
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch events' });
    }
  };

  const getEventParticipants = async (req, res) => {
    const { id } = req.params;
    try {
      const participants = await Participant.find({ eventId: id });
      res.status(200).json({ success: true, data: participants });
    } catch (error) {
      console.error('Error fetching participants:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch participants' });
    }
  };

module.exports = {
    loginController,
    registerController,
    authController,applyOrganizerController,applySponsorController,getAllNotificationController,deleteAllNotificationController,checkOrganizerStatusController
    ,checkSponosrStatusController,EventDisplay,registerForEvent,getOrganizerEvents,getEventParticipants
  };