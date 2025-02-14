const EventModel = require('../models/EventModel');
const OrganizerModel = require('../models/OrganizerModels');


// Create Event
const createEvent = async (req, res) => {
  try {

    const { userId,eventDate,eventLastDate } = req.body;
    // const questionSchema= questions
    // console.log('questions =' +questionSchema)

    const data = req.body;
    console.log(data)

    let questions = [];

    // Parse questions if provided as a JSON string
    if (req.body.questions) {
      try {
        questions = JSON.parse(req.body.questions);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid questions format. Must be a valid JSON array.',
        });
      }
    }

    console.log('Parsed questions:', questions);

    // Find the organizer by userId
    const organizer = await OrganizerModel.findOne({ userId });

    if (!req.files || !req.files.eventBannerUrl) {
      return res.status(400).send({
          success: false,
          message: 'Event banner is required',
      });
  }

    const eventBannerPath = req.files.eventBannerUrl[0].path;
    const eventBanner=eventBannerPath.replace(/\\/g, '/');

    // Check if the organizer exists
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    //const object=req.body
    // console.log(object)


    // Create the event and directly store organizer details
    const newEvent = new EventModel({
      ...req.body,  // Spread all other event fields
      questions,
      eventBannerUrl:eventBanner,
      organizer: organizer._id,  // Store the organizer's _id
      organizationEmail: organizer.organizationEmail,  // Store the organizer's email directly
      organizationName: organizer.organizationName,  // Store the organizer's name directly
    });

    await newEvent.save();
    
    res.status(200).json({
      message: "Event created successfully",
      success: true,
      event: newEvent,  // Return the event with organizer details included
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const getEvents = async (req, res) => {
    try {
      // Fetch all events with organizer details (if needed, you can filter, sort, or paginate the events)
      const events = await EventModel.find().populate('organizer', 'organizationName organizationEmail');
  
      // Return events in response
      res.status(200).json({
        message: "Events fetched successfully",
        success: true,
        events: events,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error while fetching events",
        error: error.message,
      });
    }
  };
  
  const getOrganizerProfile = async (req, res) => {
    try {
      const userId  = req.body.userId; // Extracted from the authenticated token
      console.log(userId)
      const organizer = await OrganizerModel.findOne({ userId });
  
      if (!organizer) {
        return res.status(404).json({ success: false, message: 'organizer not found' });
      }
  
      res.status(200).json({ success: true, organizer });
    } catch (error) {
      console.error('Error fetching organizer profile:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  const getYourEvent = async (req,res) => {
    try {
      const userId = req.body.userId;
      console.log("User ID",userId)
      const events = await EventModel.find({userId})
      console.log("Events are \n",events)
      res.status(200).json({success:true,message:"Events retrieved successfully",events})
    } catch (error) {
      res.status(500).json({success:false,message:"Error in retieving events"})
      console.log(error)
    }
   }
   
   const getParticipantDataCtrl = async(req,res)=> {
    try {
      const {id}=req.params;
       
      const eventData = await EventModel.findById(id).populate('participants', 'name email contact')
        res.status(200).json({success:true,message:"Participant data retrieved successfully",eventData})

    } catch (error) {
      res.status(500).json({success:false,message:"Error in retieving events"})
      console.log(error)
    }
   }


module.exports = { createEvent,getEvents,getOrganizerProfile, getYourEvent,getParticipantDataCtrl};
