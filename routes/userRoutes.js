const express= require('express');
const {registerController,loginController, authController, applyOrganizerController, applySponsorController,getAllNotificationController,deleteAllNotificationController,checkOrganizerStatusController
  ,checkSponosrStatusController,EventDisplay,registerForEvent,getOrganizerEvents,getEventParticipants,
  getUserData,
  UserProfile,unregisterForEvent,ChatroomController,QuestionController
}=require("../controllers/userCtrl");
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const upload=require('../multer')



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
router.post('/Organizer-Register',
 upload.fields([{name:'organizationAffiliationCertificate',maxCount:1},
  {name:'organizationProofOfAddress',maxCount:1},
 ]) 
  ,AuthMiddleware,applyOrganizerController);

//Org noti || POST
router.post('/Organizer-Notification',AuthMiddleware,getAllNotificationController);

//Spon noti ||POST
router.post('/Sponsor-Register',
  upload.fields([{name:'organizationAffiliationCertificate',maxCount:1},
    {name:'organizationProofOfAddress',maxCount:1},
   ])
  ,AuthMiddleware,applySponsorController);


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

router.get('/profile',AuthMiddleware,UserProfile)

// Fetch organizer's events
router.get('/organizer/events', AuthMiddleware, getOrganizerEvents);

// Fetch participants for a specific event
router.get(`/events/:eventId/participants`, AuthMiddleware, getEventParticipants);


router.post('/getUserData',AuthMiddleware,getUserData)
// 
router.post('/events/:id/unregister',AuthMiddleware,unregisterForEvent)

router.post('/events/:id/chat',AuthMiddleware,ChatroomController)

router.post('/questions',AuthMiddleware,QuestionController)



module.exports= router;