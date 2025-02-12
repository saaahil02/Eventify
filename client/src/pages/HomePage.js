import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/HomePage.css'
import {useSelector} from 'react-redux'
//import { Color } from 'antd/es/color-picker';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

 //user?.isAdmin ? navigate('/admin/UsersList') : ;
 if(user?.isAdmin)
 {
  navigate('/admin/UsersList')
 }

  // Fetch user data (for login validation or other user-related tasks)
  const getUserData = async () => {
    try {
      const res = await axios.post(
        'api/v1/user/getUserData',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch events from the backend API
  const fetchEvents = async () => {
    try {
      const response = await axios.get('api/v1/organizer/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Filter events based on the eventDate (future events only)
    const currentDate = new Date();
    const futureEvents = response.data.events.filter(
      (event) => new Date(event.eventLastDate) > currentDate
    );
      setEvents(futureEvents);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData(); // Check user login status
    fetchEvents(); // Fetch events when the page loads
  }, []);

  return (
    <Layout>
    {/* <div className="container"> */}

        {/* Page Title */}
        {/* <h1 className="title">Upcoming Events</h1> */}

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-container">
            <Paragraph type="danger">{error}</Paragraph>
          </div>
        )}

        {/* Event Cards */}
        <div className="aaa">
          {!loading && events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} className="bbb">
                {/* Event Image */}
                <div className="ccc">
                  <img
                    //src={event.eventBannerUrl || 'https://via.placeholder.com/300'}
                    src={`/uploads/${event.eventBannerUrl.split('/').pop()}`}
                    alt={event.eventName}
                  />
                </div>

                {/* Event Details */}
                <h3 className="eee">{event.eventName}</h3><hr/>
                {/* <Paragraph className="event-description">{event.eventDescription}</Paragraph> */}
                {/* <Paragraph className="event-location">Event Location: {event.eventLocation}</Paragraph> */}
                <Paragraph className="fff">
                  Organizer: {event.organizer.organizationName}
                </Paragraph>
                <Paragraph className="ggg">
                  Email: {event.organizer.organizationEmail}
                </Paragraph>
                <Paragraph>
                
                  Last Date of Registration:
                  {event.eventLastDate
                    ? new Date(event.eventLastDate).toLocaleString()
                    : 'Date not available'}
                </Paragraph>
                {/* <Paragraph className="event-date">
                  Date/Time: {new Date(event.eventDate).toLocaleString()}
                </Paragraph> */}

                {/* Actions */}
                <div className="hhh">
                  <button
                    className="iii"
                    onClick={() => navigate(`/user/event/${event._id}`)}
                  >
                    View Details
                  </button>
                  {/* <button
                    className="register-link"
                    onClick={() => navigate(`/register/${event._id}`)}
                  >
                    Register
                  </button> */}
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <h3 className="jjj">No Events Available</h3>
            )
          )}
        </div>

      {/* </div> */}

    </Layout>
  );
};

export default HomePage;
