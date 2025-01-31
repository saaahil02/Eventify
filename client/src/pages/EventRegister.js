import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import { Spin, Typography, Button, Modal, Form, Input, message } from 'antd';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import '../styles/EventRegister.css';
import '../styles/Chatroom.css'

const { Title, Paragraph } = Typography;

const EventRegister = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null); // Initialize as null for a single event
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]); // Chat messages state
  const [newMessage, setNewMessage] = useState(''); // For user input in chatbox
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.user); // Get user data from Redux
  const dispatch = useDispatch();
  const isOrganizerMessage = (senderId) => senderId === event.userId; // Check if the message sender is the organizer


  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/user/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache', // Disable caching
        },
      });

      if (response.data.data) {
        setEvent(response.data.data); // Update state with the fetched event data
        setMessages(response.data.data.chatroom || []); // Set chat messages
        console.log(response.data.data.chatroom)
      } else {
        setError('Event not found.');
      }
    } catch (err) {
      console.error(err); // Log error for debugging
      setError(err.response ? err.response.data.message : 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/v1/user/events/${id}/chat`,
        { message: newMessage ,
          eventId: id // Pass the `id` in the body
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      

      if (response.data.success) {
        setMessages((prevMessages) => [...prevMessages, response.data.message]);
        setNewMessage(''); // Clear input
      } else {
        message.error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      dispatch(hideLoading());
      console.error(err);
      message.error(
        err.response ? err.response.data.message : 'Failed to send message'
      );
    }
  };

  const handleRegister = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/v1/user/events/${id}/register`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        message.success('Registration successful!');
        setIsModalVisible(false);
        form.resetFields();
        fetchEventDetails(); // Refresh event details
      } else {
        message.error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      dispatch(hideLoading());
      console.error(err);
      message.error(
        err.response ? err.response.data.message : 'Registration failed'
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Paragraph type="danger">{error}</Paragraph>
      </div>
    );
  }

  // const isUserRegistered = event?.participants?.some(
  //   (participant) => participant._id.toString() === user._id.toString() 
  // ) || user.userId===event.userId;
 
  const isUserRegistered = event?.participants?.some(
    (participant) => participant._id.toString() === user._id.toString()
  );
  

  return (
    <Layout>
      <div className="container">
        <Title level={2}>{event.eventName}</Title>
        <img
          className="event-image"
          src={`/uploads/${event.eventBannerUrl.split('/').pop()}`}
          alt={event.eventName || 'Event Image'}
        />
        <Paragraph>{event.eventDescription || 'No description available'}</Paragraph>
        <Paragraph>
          <strong>Location:</strong> {event.eventLocation || 'Location not provided'}
        </Paragraph>
        <Paragraph>
          <strong>Organizer:</strong>{' '}
          {event.organizationName || 'Organizer not provided'}
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
        

        {isUserRegistered || user._id === event.userId  ? (
          <>
            <Paragraph>
              <b>You are already registered for this event.</b>
            </Paragraph>
            {/* <div className="chatroom">
              <div className="messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                    //  msg.isOrganizer
                    isOrganizerMessage(msg.senderId)
                       ? 'organizer-message' : 'user-message'
                    }`}
                  >
                    <span>{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <Input
                  type="text"
                  value={newMessage}
                  name='message'
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <Button type="primary" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </div> */}<hr/>
            <div className="text-center"><h1>Chatroom</h1></div>
            <div className="chatroom">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className="message-wrapper">
                  {/* Display the user's email and message time */}
                  <div className="message-meta">
                    <span className="message-email"><h6>{msg.senderEmail}</h6></span> {/* Assuming msg.senderEmail exists */}
{/*                     
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span> */}
                    <span className="message-time"><h6>
                    {new Date(msg.timestamp).toLocaleString([], { 
                        weekday: 'short', // Short day of the week (e.g., Mon)
                        year: 'numeric', 
                        month: 'short', // Short month (e.g., Jan)
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </h6>
                      
                    </span>
                  </div>

                  {/* Display the message */}
                  <div
                    className={`message ${
                      isOrganizerMessage(msg.senderId) ? 'organizer-message' : 'user-message'
                    }`}
                  >
                    <span>{msg.message}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <Input
                type="text"
                value={newMessage}
                name="message"
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <Button type="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>

          </>
        ) : (
          <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
            Register for Event
          </Button>
        )}
      </div>

      <Modal
        title="Register for Event"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          initialValues={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.contact || '',
          }}
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email address' },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input disabled />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
};

export default EventRegister;
