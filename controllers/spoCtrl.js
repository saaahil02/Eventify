const SponsorModel=require('../models/SponsorModels')

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
  
  module.exports = { getSponsorProfile };
  