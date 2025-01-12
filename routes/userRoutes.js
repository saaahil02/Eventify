const express= require('express');
const {registerController,loginController, authController, applyOrganizerController, applySponsorController,getAllNotificationController,deleteAllNotificationController,checkOrganizerStatusController
  ,checkSponosrStatusController,EventDisplay,registerForEvent,getOrganizerEvents,getEventParticipants}=require("../controllers/userCtrl");
const AuthMiddleware = require('../middlewares/AuthMiddleware');



//router object
const router=express.Router()

//routes
// Login || POST
router.post('/login',loginController);

// Register || POST
router.post('/register',registerController);

//Auth || POST
router.post('/getUserData',AuthMiddleware,authController);

//org register || POST
router.post('/Organizer-Register',AuthMiddleware,applyOrganizerController);

//Org noti || POST
router.post('/Organizer-Notification',AuthMiddleware,getAllNotificationController);

//Spon noti ||POST
router.post('/Sponsor-Register',AuthMiddleware,applySponsorController);


//Sponsor noti || POST
router.post('/get-all-notification',AuthMiddleware,getAllNotificationController);

router.post(
    "/delete-all-notification",
    AuthMiddleware,
    deleteAllNotificationController
  );

// Check Organizer Submission Status || GET
router.get('/check-organizer-status', AuthMiddleware, checkOrganizerStatusController);

router.get('/check-sponsor-status', AuthMiddleware, checkSponosrStatusController);

router.get('/events/:id',AuthMiddleware,EventDisplay)

router.post('/events/:id/register', AuthMiddleware, registerForEvent);

// Fetch organizer's events
router.get('/organizer/events', AuthMiddleware, getOrganizerEvents);

// Fetch participants for a specific event
router.get('/organizer/events/:id/participants', AuthMiddleware, getEventParticipants);


module.exports= router;