const EventModel = require('../models/EventModel');
const OrganizerModel = require('../models/OrganizerModels');

// Create Event
const createEvent = async (req, res) => {
  try {
    // Extract userId from the request body (added by AuthMiddleware)
    const { userId } = req.body;

    // Find the organizer by userId
    const organizer = await OrganizerModel.findOne({ userId });

    // Check if the organizer exists
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Create the event and directly store organizer details
    const newEvent = new EventModel({
      ...req.body,  // Spread all other event fields
      organizer: organizer._id,  // Store the organizer's _id
      organizationEmail: organizer.organizationEmail,  // Store the organizer's email directly
      organizationName: organizer.organizationName,  // Store the organizer's name directly
    });

    await newEvent.save();

    res.status(201).json({
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
  


module.exports = { createEvent,getEvents };
