// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Spin, Typography, Button } from 'antd';
// import Layout from '../components/Layout';

// const { Title, Paragraph } = Typography;

// const EventRegister = () => {
//   const { id } = useParams(); // Get the event ID from the URL
//   const [event, setEvent] = useState(null); // Initialize as null for a single event
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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

//   if (!event) {
//     return <div>Event not found</div>;
//   }

//   return (
//     <Layout>
//           <div className="container">
//       <Title level={2}>{event.eventName}</Title>
//       <img
//         className="event-image"
//         src={event.eventBannerUrl || 'default-image.jpg'}
//         alt={event.eventName || 'Event Image'}
//       />
//       <Paragraph>{event.eventDescription || 'No description available'}</Paragraph>
//       <Paragraph>
//         <strong>Location:</strong> {event.eventLocation || 'Location not provided'}
//       </Paragraph>
//       <Paragraph>
//         <strong>Organizer:</strong>{' '}
//         {event.organizationName || 'Organizer not provided'}
//       </Paragraph>
//       <Paragraph>
//         <strong>Date:</strong>{' '}
//         {event.eventDate
//           ? new Date(event.eventDate).toLocaleString()
//           : 'Date not available'}
//       </Paragraph>
//       <Button
//         type="primary"
//         size="large"
//         onClick={() => alert('Registration functionality here')}
//       >
//         Register for Event
//       </Button>
//     </div>
//     </Layout>
//   );
// };

// export default EventRegister;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spin, Typography, Button, Modal, Form, Input, message } from 'antd';
import Layout from '../components/Layout';

const { Title, Paragraph } = Typography;

const EventRegister = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null); // Initialize as null for a single event
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/user/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache', // Disable caching
        },
      });

      // Check if the event exists
      if (response.data.data) {
        setEvent(response.data.data); // Update state with the fetched event data
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

  const handleRegister = async (values) => {
    try {
      const response = await axios.post(
        `/api/v1/user/events/${id}/register`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        message.success('Registration successful!');
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error(response.data.message || 'Registration failed');
      }
    } catch (err) {
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

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <Layout>
      <div className="container">
        <Title level={2}>{event.eventName}</Title>
        <img
          className="event-image"
          src={event.eventBannerUrl || 'default-image.jpg'}
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
        <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
          Register for Event
        </Button>
      </div>

      {/* Registration Modal */}
      <Modal
        title="Register for Event"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleRegister} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email address' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input />
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
