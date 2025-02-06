const express=require('express')
const {createEvent,getEvents, getOrganizerProfile, getFormDetails}=require('../controllers/orgCtrl')
const AuthMiddleware=require('../middlewares/authMiddleware')
const upload=require('../multer')



const router = express.Router()

router.post('/create-event',
    upload.fields([{name:'eventBannerUrl',maxCount:1},
       ])
    ,AuthMiddleware,createEvent)
router.get('/events',AuthMiddleware, getEvents);

router.get('/profile',AuthMiddleware,getOrganizerProfile)




module.exports=router