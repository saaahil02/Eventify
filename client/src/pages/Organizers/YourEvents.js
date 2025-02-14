import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrgLayout from '../../components/OrgLayout';
import { Button, Spin, Typography } from 'antd';
import '../../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const YourEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/v1/organizer/getYourEvent', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <OrgLayout>
      <Title level={3}>Your Events</Title>
      
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
                 
                 <Paragraph >Event Date: {new Date(event.eventDate).toLocaleString()}</Paragraph>

                 <Button type='primary' onClick={()=>{navigate(`/organizer/EventData/${event._id}`)}}>View Event Data</Button>
               
                {/* <Paragraph className="event-date">
                  Date/Time: {new Date(event.eventDate).toLocaleString()}
                </Paragraph> */}

                {/* Actions */}
                <div className="hhh">
                 
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
    </OrgLayout>
  );
};

export default YourEvents;
