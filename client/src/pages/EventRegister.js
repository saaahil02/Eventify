// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Spin, Typography, Button, Modal, Form, Input, message } from 'antd';
// import Layout from '../components/Layout';
// import { useSelector, useDispatch } from 'react-redux';
// import { hideLoading, showLoading } from '../redux/features/alertSlice';
// import '../styles/EventRegister.css'
// import { Color } from 'antd/es/color-picker';

// const { Title, Paragraph } = Typography;

// const EventRegister = () => {
//   const { id } = useParams(); // Get the event ID from the URL
//   const [event, setEvent] = useState(null); // Initialize as null for a single event
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const { user } = useSelector((state) => state.user); // Get user data from Redux
//   const dispatch = useDispatch();

//   const fetchEventDetails = async () => {
//     try {
//       const response = await axios.get(`/api/v1/user/events/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Cache-Control': 'no-cache', // Disable caching
//         },
//       });

//       // Check if the event exists
//       if (response.data.data) {
//         setEvent(response.data.data); // Update state with the fetched event data
//       } else {
//         setError('Event not found.');
//       }
//     } catch (err) {
//       console.error(err); // Log error for debugging
//       setError(err.response ? err.response.data.message : 'Failed to fetch event details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEventDetails();
//   }, [id]);

//   const handleRegister = async (values) => {
//     try {
//       dispatch(showLoading());
//       const response = await axios.post(
//         `/api/v1/user/events/${id}/register`,
//         values,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       dispatch(hideLoading());

//       if (response.data.success) {
//         message.success('Registration successful!');
//         setIsModalVisible(false);
//         form.resetFields();
//         fetchEventDetails(); // Refresh event details
//       } else {
//         message.error(response.data.message || 'Registration failed');
//       }
//     } catch (err) {
//       dispatch(hideLoading());
//       console.error(err);
//       message.error(
//         err.response ? err.response.data.message : 'Registration failed'
//       );
//     }
//   };

//   const handleUnregister = async () => {
//     try {
//       dispatch(showLoading());
//       const response = await axios.post(
//         `/api/v1/user/events/${id}/unregister`,
//         { userId: user._id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       dispatch(hideLoading());

//       if (response.data.success) {
//         message.success('You have successfully unregistered from the event.');
//         fetchEventDetails(); // Refresh event details
//       } else {
//         message.error(response.data.message || 'Unregistration failed');
//       }
//     } catch (err) {
//       dispatch(hideLoading());
//       console.error(err);
//       message.error(
//         err.response ? err.response.data.message : 'Unregistration failed'
//       );
//     }
//   };
  

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <Paragraph type="danger">{error}</Paragraph>
//       </div>
//     );
//   }


//       const isUserRegistered = event?.participants?.some(
//         (participant) => participant._id.toString() === user._id.toString()
//       );



//   return (
//     <Layout>
//       <div className="container">
//         <Title level={2}>{event.eventName}</Title>
//         <img
//           className="event-image"
//           //src={event.eventBannerUrl || 'default-image.jpg'}
//           src={`/uploads/${event.eventBannerUrl.split('/').pop()}`}
//           alt={event.eventName || 'Event Image'}
//         />
//         <Paragraph>{event.eventDescription || 'No description available'}</Paragraph>
//         <Paragraph>
//           <strong>Location:</strong> {event.eventLocation || 'Location not provided'}
//         </Paragraph>
//         <Paragraph>
//           <strong>Organizer:</strong>{' '}
//           {event.organizationName || 'Organizer not provided'}
//         </Paragraph>
//         <Paragraph>
//           <strong>Date:</strong>{' '}
//           {event.eventDate
//             ? new Date(event.eventDate).toLocaleString()
//             : 'Date not available'}
//         </Paragraph>
//         <Paragraph>
//           <strong>Last Date of Registration for the event:</strong>{' '}
//           {event.eventDate
//             ? new Date(event.eventLastDate).toLocaleString()
//             : 'Date not available'}
//         </Paragraph>
//         {isUserRegistered ? (
//           <>
//           <hr/>
//             <Paragraph><b><h4>You are already registered for this event.</h4></b></Paragraph>
// {/*             
//             <Button type="default" size="large" onClick={handleUnregister}>
//               Cancel Registration
//             </Button> */}

//                   <div className="chatroom">
//                     <div className="messages">
//                       {messages.map((msg, index) => (
//                         <div
//                           key={index}
//                           className={`message ${
//                             msg.isOrganizer ? 'organizer-message' : 'user-message'
//                           }`}
//                         >
//                           <span>{msg.text}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="chat-input">
//                       <input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder="Type your message..."
//                       />
//                       <button onClick={sendMessage}>Send</button>
//                     </div>
//                   </div>

//           </>
//         ) : (
//           <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
//             Register for Event
//           </Button>
//         )}
//       </div>

//       {/* Registration Modal */}
//       <Modal
//         title="Register for Event"
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           form={form}
//           initialValues={{
//             name: user?.name || '',
//             email: user?.email || '',
//             phone: user?.contact || '',
//           }}
//           onFinish={handleRegister}
//           layout="vertical"
//         >
//           <Form.Item
//             name="name"
//             label="Name"
//             rules={[{ required: true, message: 'Please enter your name' }]}
//           >
//             <Input disabled />
//           </Form.Item>
//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[
//               { required: true, message: 'Please enter your email' },
//               { type: 'email', message: 'Enter a valid email address' },
//             ]}
//           >
//             <Input disabled />
//           </Form.Item>
//           <Form.Item
//             name="phone"
//             label="Phone Number"
//             rules={[{ required: true, message: 'Please enter your phone number' }]}
//           >
//             <Input disabled />
//           </Form.Item>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// };

// export default EventRegister;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
        setMessages(response.data.data.chatMessages || []); // Set chat messages
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
        { text: newMessage },
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

        {isUserRegistered ? (
          <>
            <Paragraph>
              <b>You are already registered for this event.</b>
            </Paragraph>
            <div className="chatroom">
              <div className="messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.isOrganizer ? 'organizer-message' : 'user-message'
                    }`}
                  >
                    <span>{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <Input
                  type="text"
                  value={newMessage}
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
