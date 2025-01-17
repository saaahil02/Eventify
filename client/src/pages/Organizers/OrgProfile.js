import React, { useState, useEffect } from 'react'
import OrgLayout from '../../components/OrgLayout'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';


const OrgProfile = () => {
  const [organizerData, setorganizerData] = useState(null);
    const { user } = useSelector((state) => state.user); // Get user data from Redux
    useEffect(() => {
      const fetchOrganizerData = async () => {
        try {
          const token = localStorage.getItem('token'); // Retrieve token from local storage
          const response = await axios.get("/api/v1/organizer/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (response.data.success) {
            setorganizerData(response.data.organizer);
          } else {
            console.error(response.data.message);
          }
        } catch (error) {
          console.error('Error fetching organizer data:', error);
        }
      };
  
      fetchOrganizerData();
    }, []);
  
    if (!organizerData) {
      return <div>Loading... 123</div>;
    }

  return (
    <OrgLayout>
        <h3>Org Profile</h3>
        <div>
        <h4>Organization Details</h4>
        <p><strong>Organization Name:</strong> {organizerData.organizationName}</p>
        <p><strong>Organization Email:</strong> {organizerData.organizationEmail}</p>
        <p><strong>Organization Type:</strong> {organizerData.organizationType}</p>
        <p>
          <strong>Website:</strong>{' '}
          <a href={organizerData.organizationWebsite} target="_blank" rel="noopener noreferrer">
            {organizerData.organizationWebsite}
          </a>
        </p>
        <p><strong>Status:</strong> {organizerData.status}</p>
        <hr />
        <h4>Representative Details</h4>
        <p><strong>Name:</strong> {organizerData.representativeName}</p>
        <p><strong>Contact Number:</strong> {organizerData.representativeContactNo}</p>
        <p><strong>Role:</strong> {organizerData.representativeRole}</p>
      </div>
    </OrgLayout>
  )
}

export default OrgProfile
