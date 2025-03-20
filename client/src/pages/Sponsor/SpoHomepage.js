//import React from 'react'
import SpoLayout from '../../components/SpoLayout';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Typography,Button } from 'antd';
import { useNavigate } from 'react-router-dom';
//import Layout from '../components/Layout';
import '../../styles/HomePage.css'
import {useSelector} from 'react-redux'

const { Title, Paragraph } = Typography;


const SpoHomepage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    if(user?.isAdmin)
      {
       navigate('/admin/UsersList')
      }

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
    
      const fetchEvents = async () => {
        try {
          
          const response = await axios.get('/api/v1/sponsor/ListEvent', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          //Filter events based on the eventDate (future events only)
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
       // getUserData(); // Check user login status
        fetchEvents(); // Fetch events when the page loads
      }, []);

  return (
    <SpoLayout>
     
       {/* <div className="container"> */}
      
              {/* Page Title */}
              <h1 className="title"> Events</h1>
      
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
           
                            <Button type='primary' onClick={()=>{navigate(`/sponsor/EventDetails/${event._id}`)}}>View Event Data</Button>
                          
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
      
            {/* </div> */}
      
    </SpoLayout>
    
  )
}

export default SpoHomepage