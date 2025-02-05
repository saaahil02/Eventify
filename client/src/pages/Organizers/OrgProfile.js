import React, { useState, useEffect } from 'react'
import OrgLayout from '../../components/OrgLayout'
import { useSelector, useDispatch } from 'react-redux';
import { Spin,Empty } from 'antd';
import '../../styles/Profile.css'
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

const OrgProfile = () => {
  const [organizerData, setorganizerData] = useState(null);
   const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.user); // Get user data from Redux
    

    const fetchOrganizerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/v1/organizer/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.data.success) {
          setorganizerData(res.data.organizer);
        }
      } catch (err) {
        setError('Failed to fetch user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchOrganizerData();
    }, []);

    

  return (
    <OrgLayout>
      
      <>
      {loading ? (
        <div className="loading-container">
          <Spin indicator={<LoadingOutlined className="spinner" />} />
          <p className="loading-text">Loading Profile...</p>
        </div>
      ) : error ? (
        <div className="error-alert">
          <ExclamationCircleOutlined className="error-icon" />
          <p>{error}</p>
        </div>
      ) : (

        <>
        <div className="profile-container">
       <h3 className="profile-header">
    <IdcardOutlined className="profile-icon" />
    Organization Profile
  </h3>
  
  <div className="profile-grid">
    {/* Organization Details Card */}
    <div className="profile-card">
      <div className="profile-section">
        <h4 className="section-title">
          <BankOutlined className="section-icon" />
          Organization Details
        </h4>
        
        <div className="detail-item">
          <span className="detail-label">Organization Name:</span>
          <span className="detail-value">{organizerData.organizationName}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{organizerData.organizationEmail}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{organizerData.organizationType}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Website:</span>
          <a href={organizerData.organizationWebsite} 
             target="_blank" 
             rel="noopener noreferrer"
             className="website-link">
            <GlobalOutlined /> {organizerData.organizationWebsite}
          </a>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Status:</span>
          <span className={`status-badge ${organizerData.status.toLowerCase()}`}>
            {organizerData.status}
          </span>
        </div>
      </div>
    </div>

    {/* Representative Details Card */}
    <div className="profile-card">
      <div className="profile-section">
        <h4 className="section-title">
          <UserOutlined className="section-icon" />
          Representative Details
        </h4>
        
        <div className="detail-item">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{organizerData.representativeName}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Contact:</span>
          <span className="detail-value">{organizerData.representativeContactNo}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Role:</span>
          <span className="detail-value">{organizerData.representativeRole}</span>
        </div>
      </div>
    </div>
  </div>
</div>




           {/* <div>
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
      </div> */}
        </>
        
       
      
      )}

     
    </>
    </OrgLayout>
  )
}

export default OrgProfile
