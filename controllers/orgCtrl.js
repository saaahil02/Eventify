const EventModel = require('../models/EventModel');
const OrganizerModel = require('../models/OrganizerModels');
const SponsorModel=require('../models/SponsorModels')


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
      console.log(eventData)
      // Assuming eventData has a field "userId" for the organizer's id
    const organizerId = eventData.userId.toString();

    // Filter participants: if a participant's id matches organizerId,
    // skip it (we send the response without that entry).
    // const filteredParticipants = eventData.participants.filter(participant => {
    //   // Ensure participant exists and compare ids
    //   return participant && participant._id.toString() !== organizerId;
    // });

    // Create a new object with filtered participants for the response
    // const updatedEventData = { 
    //   ...eventData.toObject(), 
    //   participants: filteredParticipants 
    // };
        res.status(200).json({success:true,message:"Participant data retrieved successfully",eventData})

    } catch (error) {
      res.status(500).json({success:false,message:"Error in retieving events"})
      console.log(error)
    }
   }


   const sponsorCollab = async(req,res) =>{
        try {
          const userId=req.body.userId
          console.log("UserId",userId)
          const events = await EventModel.find({userId, sponsorRequest: { $exists: true, $not: { $size: 0 } },}).populate('organizer', 'organizationName organizationEmail');
          console.log("events",events)
          res.status(200).json({
            message: "Events fetched successfully",
            success: true,
            events: events,
          });
        } catch (error) {
          console.log(error)
          res.status(500).json({
            message: "Server error while fetching events",
            error: error.message,
          });
        }
   }


   const acceptRequest = async(req,res) =>{
    try {
      const userId=req.body.userId
      console.log("UserId",userId)
      const eventId=req.body.id
      console.log("Event Id",eventId)
      const sponsor=await SponsorModel.findOne({userId})
     
      
      // 1. Fetch the event
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    console.log(sponsor._id.toString())

    // 2. Locate the specific sponsor request by userId
    const sponsorReq = event.sponsorRequest.find(
      (item) => item.sponsorId.toString() === sponsor._id.toString()
    );

    console.log("Sponsor Request:", sponsorReq);
  
    if (!sponsorReq) {
      return res.status(404).json({
        success: false,
        message: "Sponsor And Organizer Are the same..",
      });
    }
    
    // 3. Update the status
    sponsorReq.status = true;

    // 4. Save the updated event
    await event.save();

    res.status(200).json({
      success: true,
      message: "Sponsor request accepted",
      data: event,
    });
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
   }

module.exports = { createEvent,getEvents,getOrganizerProfile, getYourEvent,getParticipantDataCtrl,sponsorCollab,acceptRequest};
