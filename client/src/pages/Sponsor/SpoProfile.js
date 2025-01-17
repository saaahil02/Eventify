import React, { useState, useEffect } from 'react';
import SpoLayout from '../../components/SpoLayout';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const SpoProfile = () => {
  const [sponsorData, setSponsorData] = useState(null);
  const { user } = useSelector((state) => state.user); // Get user data from Redux
  
  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await axios.get("/api/v1/sponsor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setSponsorData(response.data.sponsor);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching sponsor data:', error);
      }
    };

    fetchSponsorData();
  }, []);

  if (!sponsorData) {
    return <div>Loading... 123</div>;
  }

  return (
    <SpoLayout>
      <h3>Sponsor Profile</h3>
      <div>
        <h4>Organization Details</h4>
        <p><strong>Organization Name:</strong> {sponsorData.organizationName}</p>
        <p><strong>Organization Email:</strong> {sponsorData.organizationEmail}</p>
        <p><strong>Organization Type:</strong> {sponsorData.organizationType}</p>
        <p>
          <strong>Website:</strong>{' '}
          <a href={sponsorData.organizationWebsite} target="_blank" rel="noopener noreferrer">
            {sponsorData.organizationWebsite}
          </a>
        </p>
        <p><strong>Status:</strong> {sponsorData.status}</p>
        <hr />
        <h4>Representative Details</h4>
        <p><strong>Name:</strong> {sponsorData.representativeName}</p>
        <p><strong>Contact Number:</strong> {sponsorData.representativeContactNo}</p>
        <p><strong>Role:</strong> {sponsorData.representativeRole}</p>
      </div>
    </SpoLayout>
  );
};

export default SpoProfile;
