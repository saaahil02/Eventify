const express=require('express')
const {createEvent,getEvents}=require('../controllers/orgCtrl')
const AuthMiddleware=require('../middlewares/authMiddleware')


const router = express.Router()

router.post('/create-event',AuthMiddleware,createEvent)
router.get('/events', getEvents);


module.exports=router