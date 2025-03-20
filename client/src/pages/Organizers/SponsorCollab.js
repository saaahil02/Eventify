import React,{useEffect,useState} from 'react'
import axios from 'axios'
import OrgLayout from '../../components/OrgLayout'
import {Button,Typography} from 'antd'
import { useNavigate } from 'react-router-dom';
//import '../../styles/HomePage.css';

const { Title, Paragraph } = Typography;

const SponsorCollab = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSponsoredEvents = async ()=>{
        try {
            const res = await axios.get(
                '/api/v1/organizer/sponsorCollab',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                }
            )
            setEvents(res.data.events)

        } catch (error) {
            console.log(error)
        }finally {
        setLoading(false);
      }
    }
    useEffect(
        () => {
            fetchSponsoredEvents()
        },[]
    )
    
  return (
    <OrgLayout>
        <h4>Sponsor Collaborations !!</h4>
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
                    
                                     <Button type='primary' onClick={()=>{navigate(`/organizer/OrgSponsorCollab/${event._id}`)}}>View Event Data</Button>
                                   
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
  )
}

export default SponsorCollab
