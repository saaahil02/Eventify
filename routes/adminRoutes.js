const express=require('express')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const { getAllUsersController, getAllOrganizersController, getAllSponsorsController,OrgchangeAccountStatusController,SponchangeAccountStatusController } = require('../controllers/adminCtrl')

const router=express.Router()

//GET METHOD || USERS
router.get('/getAllUsers',AuthMiddleware,getAllUsersController) 

//GET METHOD || Organizers
router.get('/getAllOrganizers',AuthMiddleware,getAllOrganizersController)

//GET METHOD || Sponsors
router.get('/getAllSponsors',AuthMiddleware,getAllSponsorsController)

//POST ACCOUNT STATUS
router.post('/changeOrgAccountStatus',AuthMiddleware,OrgchangeAccountStatusController)

router.post('/changeSpoAccountStatus',AuthMiddleware,SponchangeAccountStatusController)

module.exports=router