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
              <div className="profile-container">
                              {/* User Profile Box */}
                              <div className="profile-box pop-out-card">
                                <div className="profile-header">
                                  <UserOutlined className="profile-icon" />
                                  <h1>Representative Data</h1>
                                </div>
                                
                                <div className="profile-details">
                                  <div className="detail-item">
                                    <IdcardOutlined className="detail-icon" />
                                    <div className="detail-content">
                                      <span className="detail-label">Name</span>
                                      <span className="detail-value">{organizerData.representativeName}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="detail-item">
                                    <PhoneOutlined className="detail-icon" />
                                    <div className="detail-content">
                                      <span className="detail-label">Contact Number</span>
                                      <span className="detail-value">{organizerData.representativeContactNo}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="detail-item">
                                    <UserOutlined className="detail-icon" />
                                    <div className="detail-content">
                                      <span className="detail-label">Role</span>
                                      <span className="detail-value">
                                        {organizerData.representativeRole || 'Not provided'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                    
                              {/* Events Participation Box */}
                              <div className="events-box pop-out-card">
                                <div className="events-header">
                                  <CalendarOutlined className="section-icon" />
                                  <h2>Organization Details</h2>
                                 
                                </div>
                    
                                <div className="profile-details">
                                  <div className="detail-item">
                                    <BankOutlined className="detail-icon" />
                                    <div className="detail-content">
                                      <span className="detail-label">Organization Name</span>
                                      <span className="detail-value">{organizerData.organizationName}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="detail-item">
                                    <MailOutlined className="detail-icon" />
                                    <div className="detail-content">
                                      <span className="detail-label">Oganization Email</span>
                                      <span className="detail-value">{organizerData.organizationEmail}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="detail-item">
                                    <IdcardOutlined className="detail-icon" />
                                    <div className="detail-content">
                                      <span className="detail-label">Organization Type</span>
                                      <span className="detail-value">
                                        {organizerData.organizationType || 'Not provided'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="detail-item">
                                    <GlobalOutlined className="detail-icon" />
                                    <div className="detail-content">
                                      <span className="detail-label">Organization website</span>
                                      <span className="detail-value">
                                        {organizerData.organizationWebsite || 'Not provided'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="detail-item">
                                    <ExclamationCircleOutlined className="detail-icon" />
                                    <div className="detail-content">
                                      <span className="detail-label">Current Status</span>
                                      <span className="detail-value">
                                        {organizerData.status || 'Not provided'}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  
                                </div>
                              </div>
                            </div>
            )}
      
           
          </>
     
    </OrgLayout>
  )
}

export default OrgProfile
