// import React, { useEffect, useState } from 'react';
// import Layout from '../components/Layout';
// import { Spin,  } from 'antd';
// import axios from 'axios';
// import {useDispatch} from 'react-redux'
// import { hideLoading, showLoading } from '../redux/features/alertSlice';
// import {useSelector} from 'react-redux'


// const Profile = () => {
//   const [userData, setUserData] = useState(null);
//    const [loading, setLoading] = useState(true);
//     const dispatch = useDispatch()
//     const { user } = useSelector((state) => state.user);

//     const fetchUserData = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get('/api/v1/user/profile',{
//           headers:{
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         })     
//         if (res.data.success) {
//           setUserData(res.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }finally {
//         setLoading(false);
//       }
//     }
    
//      useEffect(() => {
//       fetchUserData();
//       }, []);

   

//   return (
//       <Layout>
//        {/* Loading Spinner */}
//        {/* {loading && (
//           <div className="loading-container">
//             <Spin size="large" />
//           </div>
//         )} */}
//         <h1>User Profile</h1>
//         <p>Name: {user.name}</p>
//         <p>Email: {user.email}</p>
//         <p>Contact: {user.contact}</p>
//         <hr/>

    //  {/* <h3>Events Participated</h3>
    //     <h3>
    //     <p>
    //       Total Events Participated: <strong>{userData.events ? userData.events.length : 0}</strong>
    //     </p>
    //     </h3>
    //     <ul>
    //       {userData.events && userData.events.length > 0 ? (
    //         userData.events.map((event, index) => (
    //           <li key={index}>
    //             <h3>{index + 1} Event Name - {event.eventName}</h3>
    //             <p>Event Description - {event.eventDescription}</p>
    //             <p>Event Date - {new Date(event.eventDate).toLocaleDateString()}</p>
    //           </li>
    //         ))
    //       ) : (
    //         <p>No events participated yet.</p>
    //       )}
    //     </ul> */} 
      

//       </Layout>
//   );
// };

// export default Profile

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Spin,Empty } from 'antd';
import { 
  LoadingOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import {useSelector} from 'react-redux'
import '../styles/Profile.css'

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/v1/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setUserData(res.data.user);
      }
    } catch (err) {
      setError('Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <Layout>
        {/* {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <h1>User Profile</h1>
            <p>Name: {userData.name}</p>
            <p>Email: {userData.email}</p>
            <p>Contact: {userData.contact}</p>
            <h3>Events Participated</h3>
        <h3>
        <p>
          Total Events Participated: <strong>{userData.events ? userData.events.length : 0}</strong>
        </p>
        </h3>
        <ul>
          {userData.events && userData.events.length > 0 ? (
            userData.events.map((event, index) => (
              <li key={index}>
                <h3>{index + 1} Event Name - {event.eventName}</h3>
                <p>Event Description - {event.eventDescription}</p>
                <p>Event Date - {new Date(event.eventDate).toLocaleDateString()}</p>
              </li>
            ))
          ) : (
            <p>No events participated yet.</p>
          )}
        </ul> 
          </>
        )} */}
        {/*------------------------------------------------------------- */}
{/*         
        {loading ? (
  <div className="loading-container">
    <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    <p className="loading-text">Loading Profile...</p>
  </div>
) : error ? (
  <div className="error-alert">
    <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />
    <p>{error}</p>
  </div>
) : (
  <div className="profile-container">
    <div className="profile-header">
      <UserOutlined className="profile-icon" />
      <h1>User Profile</h1>
    </div>

    <div className="profile-grid">
      <div className="profile-card">
        <div className="profile-info">
          <div className="info-item">
            <IdcardOutlined className="info-icon" />
            <div>
              <label>Name</label>
              <p className="info-value">{userData.name}</p>
            </div>
          </div>
          
          <div className="info-item">
            <MailOutlined className="info-icon" />
            <div>
              <label>Email</label>
              <p className="info-value">{userData.email}</p>
            </div>
          </div>

          <div className="info-item">
            <PhoneOutlined className="info-icon" />
            <div>
              <label>Contact</label>
              <p className="info-value">{userData.contact || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="events-card">
        <div className="events-header">
          <CalendarOutlined className="section-icon" />
          <h2>Event Participation</h2>
          <div className="events-badge">
            {userData.events ? userData.events.length : 0}
          </div>
        </div>

        {userData.events && userData.events.length > 0 ? (
          <div className="events-list">
            {userData.events.map((event, index) => (
              <div className="event-card" key={index}>
                <div className="event-header">
                  <span className="event-number">#{index + 1}</span>
                  <h3 className="event-title">{event.eventName}</h3>
                </div>
                <p className="event-description">{event.eventDescription}</p>
                <div className="event-date">
                  <ClockCircleOutlined />
                  <span>
                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} 
                   description="No events participated yet" />
          </div>
        )}
      </div>
    </div>
  </div>
)} */}
{/*--------------------------------------------------------------------- */}
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
          <div className="profile-header">
            <UserOutlined className="profile-icon" />
            <h1>User Profile</h1>
          </div>

          <div className="profile-grid">
            <div className="profile-card animated-card">
              <div className="profile-info">
                <div className="info-item">
                  <IdcardOutlined className="info-icon" />
                  <div>
                    <label>Name</label>
                    <p className="info-value">{userData.name}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <MailOutlined className="info-icon" />
                  <div>
                    <label>Email</label>
                    <p className="info-value">{userData.email}</p>
                  </div>
                </div>

                <div className="info-item">
                  <PhoneOutlined className="info-icon" />
                  <div>
                    <label>Contact</label>
                    <p className="info-value">{userData.contact || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="events-card animated-card">
              <div className="events-header">
                <CalendarOutlined className="section-icon" />
                <h2>Event Participation</h2>
                <div className="events-badge">
                  {userData.events ? userData.events.length : 0}
                </div>
              </div>

              {userData.events && userData.events.length > 0 ? (
                <div className="events-list">
                  {userData.events.map((event, index) => (
                    <div className="event-card" key={index}>
                      <div className="event-header">
                        <span className="event-number">#{index + 1}</span>
                        <h3 className="event-title">{event.eventName}</h3>
                      </div>
                      <p className="event-description">{event.eventDescription}</p>
                      <div className="event-date">
                        <ClockCircleOutlined />
                        <span>
                          {new Date(event.eventDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-events">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description="No events participated yet" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </Layout>
    </div>
  );
};

export default Profile;
