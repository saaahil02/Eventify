const SponsorModel=require('../models/SponsorModels')
const EventModel = require('../models/EventModel');


const getSponsorProfile = async (req, res) => {
    try {
      const userId  = req.body.userId; // Extracted from the authenticated token
      console.log(userId)
      const sponsor = await SponsorModel.findOne({ userId });
  
      if (!sponsor) {
        return res.status(404).json({ success: false, message: 'Sponsor not found' });
      }
  
      res.status(200).json({ success: true, sponsor });
    } catch (error) {
      console.error('Error fetching sponsor profile:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  const getSponsoredEvents =async (req,res) =>{
    try {
      // Fetch all events with organizer details (if needed, you can filter, sort, or paginate the events)
      const events = await EventModel.find({eventSponser:"Yes"}).populate('organizer', 'organizationName organizationEmail');
  
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
  }
  
  module.exports = { getSponsorProfile ,getSponsoredEvents};
  