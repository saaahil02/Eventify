import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/CreateEvent.css'

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch events from the backend API
  const fetchEvents = async () => {
    try {
      const response = await axios.get('api/v1/organizer/events');
      setEvents(response.data.events);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData(); // You may use this to check for user login status
    fetchEvents(); // Fetch events when the page loads
  }, []);

  return (
    <Layout>
    <div style={{ padding: '20px' }}>
      
        <Title level={2}>Upcoming Events</Title>

        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center' }}>
            <Paragraph type="danger">{error}</Paragraph>
          </div>
        )}

        <Row gutter={[16, 16]}>
          {events.length === 0 ? (
            <Col span={24}>
              <Title level={4}>No events available</Title>
            </Col>
          ) : (
            events.map((event) => (
              <Col span={8} key={event._id}>
                <Card
                  hoverable
                  cover={<img alt={event.eventName} src={event.eventBannerUrl} />}
                >
                  <Title level={4}>{event.eventName}</Title>
                  <Paragraph>{event.eventDescription}</Paragraph>
                  <Paragraph>{event.eventLocation}</Paragraph>
                  <Paragraph>Organizer: {event.organizer.organizationName}</Paragraph>
                  <Paragraph>{new Date(event.eventDate).toLocaleString()}</Paragraph>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="primary" size="small">
                      View Details
                    </Button>
                    <Button type="danger" size="small">
                      Register
                    </Button>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      
    </div>
    </Layout>
  );
};

export default HomePage;
