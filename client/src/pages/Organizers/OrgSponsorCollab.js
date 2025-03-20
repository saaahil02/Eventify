import React, { useEffect, useState } from 'react'
import OrgLayout from '../../components/OrgLayout'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spin, Typography, Button, Modal, Form, Input, message, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/features/alertSlice';

const { Paragraph } = Typography;

const OrgSponsorCollab = () => {
         const { id } = useParams();
          const [event, setEvent] = useState(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState(null);
          const [isModalVisible, setIsModalVisible] = useState(false);
          const [form] = Form.useForm();
          const { user } = useSelector((state) => state.user);
          const dispatch = useDispatch();

      const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`/api/v1/user/events/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Cache-Control': 'no-cache',
            },
          });
    
          if (response.data.data) {
            setEvent(response.data.data);
          } else {
            setError('Event not found.');
          }
        } catch (err) {
          console.error(err);
          setError(err.response ? err.response.data.message : 'Failed to fetch event details');
        } finally {
          setLoading(false);
        }
      };
    
    


      const acceptRequest = async()=>{
        try {
            const res= await axios.post('/api/v1/organizer/acceptRequest',{id,sponsorId:event.sponsorRequest.sponsorId},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`},
                }
            )
        } catch (error) {
            console.log(error)
        }
      }

      // Check if the user has already sent a sponsor request
  const hasSentRequest = event?.sponsorRequest?.some(
    (request) => request.userId === user._id
  );

  // Get the status of the sponsor request
  const sponsorRequestStatus = event?.sponsorRequest?.find(
    (request) => request.userId === user._id
  )?.status;

      useEffect(() => {
        fetchEventDetails();
      }, [id]);

      
  return (
    <OrgLayout>
            {loading ? (
      <Spin size="large" />
    ) : error ? (
      <p style={{ color: 'red' }}>{error}</p>
    ) : !event ? (
      // If event is still null/undefined
      <p>No event data found.</p>
    ) : (
      // Render the event details once it's defined
      <div>
        <img
          src={`/uploads/${event.eventBannerUrl.split('/').pop()}`}
          alt={event.eventName || 'Event Image'}
        />
        <Paragraph>{event.eventDescription || 'No description available'}</Paragraph>
        <Paragraph>
          <strong>Location:</strong> {event.eventLocation || 'Location not provided'}
        </Paragraph>
        <Paragraph>
          <strong>Organizer:</strong> {event.organizationName || 'Organizer not provided'}
        </Paragraph>
        <Paragraph>
          <strong>Date:</strong>{' '}
          {event.eventDate
            ? new Date(event.eventDate).toLocaleString()
            : 'Date not available'}
        </Paragraph>
        <Paragraph>
          <strong>Last Date of Registration:</strong>{' '}
          {event.eventLastDate
            ? new Date(event.eventLastDate).toLocaleString()
            : 'Date not available'}
        </Paragraph>

        

        {/* {sponsorRequestStatus ? (
  // If there is a sponsor request and it's approved:
  <Paragraph type="success">Request has been approved!</Paragraph>
) : (
  // Otherwise, show the accept button
  <Button type="primary" onClick={() => acceptRequest()}>
    Accept Request
  </Button>
  
)} */}
      </div>
    )}
    </OrgLayout>
  )
}

export default OrgSponsorCollab
