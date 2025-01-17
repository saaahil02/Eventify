import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Spin,  } from 'antd';
import axios from 'axios';
import {useDispatch} from 'react-redux'
import { hideLoading, showLoading } from '../redux/features/alertSlice';


const Profile = () => {
  const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch()
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/v1/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
       

        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Layout>
       {/* Loading Spinner */}
       {loading && (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        )}
        <h1>User Profile</h1>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Contact: {userData.contact}</p>
        <hr/>
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
      </Layout>
    </div>
  );
};

export default Profile;
