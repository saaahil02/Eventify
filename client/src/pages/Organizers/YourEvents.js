import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrgLayout from '../../components/OrgLayout';
import { Spin, Typography } from 'antd';
import '../../styles/HomePage.css'
const { Title, Paragraph } = Typography;

const YourEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events for the logged-in organizer
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/v1/user/getYourEvent'); // Replace with your API endpoint
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
     
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (eventId) => {
    try {
      
    } catch (error) {
      console.log('Error editing event:',error)
    }
  };

  return (
    <OrgLayout>
      <h3>Your Events</h3>
    </OrgLayout>
  );
};

export default YourEvents;
