import React, { useState, useEffect } from 'react';
import SpoLayout from '../../components/SpoLayout';
import { useSelector, useDispatch } from 'react-redux';
import { Spin,Empty } from 'antd';
import axios from 'axios';
import { 
  LoadingOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BankOutlined,
  GlobalOutlined 
} from '@ant-design/icons';
import '../../styles/Profile.css'

const SpoProfile = () => {
  const [sponsorData, setSponsorData] = useState(null);
  const { user } = useSelector((state) => state.user); // Get user data from Redux
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
  
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
      {/* <h3>Sponsor Profile</h3>
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
      </div> */}

      <>
            {/* {loading ? (
              <div className="loading-container">
                <Spin indicator={<LoadingOutlined className="spinner" />} />
                <p className="loading-text">Loading Profile...</p>
              </div>
            ) : error ? (
              <div className="error-alert">
                <ExclamationCircleOutlined className="error-icon" />
                <p>{error}</p>
              </div>
            ) : ( */}
              <div className="profile-container">
                {/* User Profile Box */}
                <div className="profile-box pop-out-card">
                  <div className="profile-header">
                    <UserOutlined className="profile-icon" />
                    <h1>Sponsor's Personal Data</h1>
                  </div>
                  
                  <div className="profile-details">
                    <div className="detail-item">
                      <IdcardOutlined className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Name</span>
                        <span className="detail-value">{sponsorData.representativeName}</span>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <PhoneOutlined className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Contact Number</span>
                        <span className="detail-value">{sponsorData.representativeContactNo}</span>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <UserOutlined className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Role</span>
                        <span className="detail-value">
                          {sponsorData.representativeRole || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
      
                {/* Events Participation Box */}
                <div className="events-box pop-out-card">
                  <div className="events-header">
                    <CalendarOutlined className="section-icon" />
                    <h2>Sponsor's Comapany Details</h2>
                   
                  </div>
      
                  <div className="profile-details">
                    <div className="detail-item">
                      <BankOutlined className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Organization Name</span>
                        <span className="detail-value">{sponsorData.organizationName}</span>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <MailOutlined className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Oganization Email</span>
                        <span className="detail-value">{sponsorData.organizationEmail}</span>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <IdcardOutlined className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Organization Type</span>
                        <span className="detail-value">
                          {sponsorData.organizationType || 'Not provided'}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <GlobalOutlined className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Organization website</span>
                        <span className="detail-value">
                          {sponsorData.organizationWebsite || 'Not provided'}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <ExclamationCircleOutlined className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Current Status</span>
                        <span className="detail-value">
                          {sponsorData.status || 'Not provided'}
                        </span>
                      </div>
                    </div>
                    
                    
                  </div>
                </div>
              </div>
            {/* )
            } */}
      
           
          </>
    </SpoLayout>
  );
};

export default SpoProfile;
