const express=require('express')
const {createEvent,getEvents, getOrganizerProfile, getFormDetails, getYourEvent, getParticipantDataCtrl}=require('../controllers/orgCtrl')
const AuthMiddleware=require('../middlewares/authMiddleware')
const upload=require('../multer')



const router = express.Router()

router.post('/create-event',
    upload.fields([{name:'eventBannerUrl',maxCount:1},
       ])
    ,AuthMiddleware,createEvent)
router.get('/events',AuthMiddleware, getEvents);

router.get('/profile',AuthMiddleware,getOrganizerProfile)

router.get('/getYourEvent',AuthMiddleware,getYourEvent)


router.get('/:id/getParticipantData',AuthMiddleware,getParticipantDataCtrl)

module.exports=router