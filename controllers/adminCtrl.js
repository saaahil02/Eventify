const userModel = require('../models/userModels')
const OrganizerModel = require('../models/OrganizerModels')
const SponsorModel = require('../models/SponsorModels')

const getAllUsersController = async(req,res)=>{
    try {
        const users = await userModel.find({})
        res.status(200).send({
            success:true,
            message:'users data',
            data:users

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess:false,
            message:'error while fetching users List',
            error
        })
    }
}

const getAllOrganizersController= async(req,res)=>{
    try {
        const organizers = await OrganizerModel.find({})
        res.status(200).send({
            success:true,
            message:'organizers data',
            data:organizers
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess:false,
            message:'error while fetching organizers List',
            
        })
    }
}

const getAllSponsorsController= async(req,res)=>{
    try {
        const sponsors = await SponsorModel.find({})
        res.status(200).send({
            success:true,
            message:'sponsorss data',
            data:sponsors
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess:false,
            message:'error while fetching sponsors List',
            error
        })
    }
}

// Organizer account status
const OrgchangeAccountStatusController = async (req, res) => {
    try {
      const { organizerId, status } = req.body;
      const organizer = await OrganizerModel.findByIdAndUpdate(organizerId, { status });
      const user = await userModel.findOne({ _id: organizer.userId });
      const notification = user.notification;
      notification.push({
        type: "organizer-account-request-updated",
        message: `Your organizer Account Request Has ${status} `,
        onClickPath: "/notification",
      });
      user.isOrganizer = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: organizer,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };


  // Organizer account status
const SponchangeAccountStatusController = async (req, res) => {
    try {
      const { sponsorId, status } = req.body;
      const sponsor = await SponsorModel.findByIdAndUpdate(sponsorId, { status });
      const user = await userModel.findOne({ _id: sponsor.userId });
      const notification = user.notification;
      notification.push({
        type: "sponsor-account-request-updated",
        message: `Your sponsor Account Request Has ${status} `,
        onClickPath: "/notification",
      });
      user.isSponsor = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: sponsor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };

module.exports={getAllUsersController,getAllOrganizersController,getAllSponsorsController,OrgchangeAccountStatusController,SponchangeAccountStatusController}