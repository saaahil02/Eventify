// import React, { useEffect, useState } from 'react';
// import { useParams,Link } from 'react-router-dom';
// import axios from 'axios';
// import { Spin, Typography, Button, Modal, Form, Input, message,InputNumber } from 'antd';

// import Layout from '../../components/Layout';
// import { useSelector, useDispatch } from 'react-redux';
// import { hideLoading, showLoading } from '../../redux/features/alertSlice';
// import '../../styles/EventRegister.css';
// import '../../styles/Chatroom.css'
// import '../../styles/FormResponse.css'

// const { Title, Paragraph } = Typography;

// const SpoEventDetails = () => {
//   const { id } = useParams(); // Get the event ID from the URL
//   const [event, setEvent] = useState(null); // Initialize as null for a single event
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [messages, setMessages] = useState([]); // Chat messages state
//   const [newMessage, setNewMessage] = useState(''); // For user input in chatbox
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isModalVisible2, setIsModalVisible2] = useState(false);
//   const [isFormFilled,setIsFormFilled]=useState(false);
//   const [responses, setResponses] = useState({});
//   const [form] = Form.useForm();
//   const { user } = useSelector((state) => state.user); // Get user data from Redux
//   const dispatch = useDispatch();
//   const isOrganizerMessage = (senderId) => senderId === event.userId; // Check if the message sender is the organizer
  
//   const handleChange = (index, value) => {
//     setResponses({ ...responses, [index]: value });
//   };

//   const handleSubmit = () => {
//     console.log("Responses Submitted: ", responses);
//     alert("Form submitted successfully!");
//   };


//   const fetchEventDetails = async () => {
//     try {
//       const response = await axios.get(`/api/v1/user/events/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Cache-Control': 'no-cache', // Disable caching
//         },
//       });

//       if (response.data.data) {
//         setEvent(response.data.data); // Update state with the fetched event data
//         setMessages(response.data.data.chatroom || []); // Set chat messages
//         console.log(response.data.data.chatroom)
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

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       dispatch(showLoading());
//       const response = await axios.post(
//         `/api/v1/user/events/${id}/chat`,
//         { message: newMessage ,
//           eventId: id // Pass the `id` in the body
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       dispatch(hideLoading());
      

//       if (response.data.success) {
//         setMessages((prevMessages) => [...prevMessages, response.data.message]);
//         setNewMessage(''); // Clear input
//       } else {
//         message.error(response.data.message || 'Failed to send message');
//       }
//     } catch (err) {
//       dispatch(hideLoading());
//       console.error(err);
//       message.error(
//         err.response ? err.response.data.message : 'Failed to send message'
//       );
//     }
//   };

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

//   // const isUserRegistered = event?.participants?.some(
//   //   (participant) => participant._id.toString() === user._id.toString() 
//   // ) || user.userId===event.userId;
 
//   const isUserRegistered = event?.participants?.some(
//     (participant) => participant._id.toString() === user._id.toString()
//   );
  

//   return (
//     <Layout>
//       <div >
//         {/* <Title level={2}>{event.eventName}</Title> */}
//         <img
//           // className="event-image"
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
//           <strong>Last Date of Registration:</strong>{' '}
//           {event.eventLastDate
//             ? new Date(event.eventLastDate).toLocaleString()
//             : 'Date not available'}
//         </Paragraph>
        
//         <Button type='primary' onClick={()=>{setIsModalVisible2(true)}}>Fill Event Form </Button>
//         <Modal
//           title="Event Form"
//           visible={isModalVisible2}
//           onCancel={()=>{setIsModalVisible2(false)}}
//         >
//           <div className="form-response">
//       <h2>Submit Your Response</h2>
//       <form onSubmit={(e) => e.preventDefault()}>
//         {event.questions.map((q, index) => (
//           <div key={index} className="question">
//             <p>
//               {q.text} {q.required && <span className="required">*</span>}
//             </p>
//             {q.type === "text" && (
//               <input
//                 type="text"
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 required={q.required}
//               />
//             )}
//             {q.type === "paragraph" && (
//               <textarea
//                 rows={4}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 required={q.required}
//               ></textarea>
//             )}
//             {q.type === "radio" &&
//               q.options.map((option, oIndex) => (
//                 <div key={oIndex}>
//                   <input
//                     type="radio"
//                     id={`${index}-${oIndex}`}
//                     name={`question-${index}`}
//                     onChange={(e) => handleChange(index, option)}
//                   />
//                   <label htmlFor={`${index}-${oIndex}`}>{option}</label>
//                 </div>
//               ))}
//             {q.type === "checkbox" &&
//               q.options.map((option, oIndex) => (
//                 <div key={oIndex}>
//                   <input
//                     type="checkbox"
//                     id={`${index}-${oIndex}`}
//                     name={`question-${index}`}
//                     onChange={(e) =>
//                       handleChange(index, [
//                         ...(responses[index] || []),
//                         option,
//                       ])
//                     }
//                   />
//                   <label htmlFor={`${index}-${oIndex}`}>{option}</label>
//                 </div>
//               ))}
//             {q.type === "file" && (
//               <input
//                 type="file"
//                 onChange={(e) => handleChange(index, e.target.files[0])}
//                 required={q.required}
//               />
//             )}
//           </div>
//         ))}
//         <button onClick={handleSubmit}>Submit</button>
//       </form>
//     </div>
    
//         </Modal>

        
        
        
//           <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
//             Register for Event
//           </Button>
       
//       </div>

//       <Modal
//         title="Sponsor Event"
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
//           {/* <Form.Item
//             name="name"
//             label="Name"
//             rules={[{ required: true, message: 'Please enter your name' }]}
//           >
//             <Input disabled />
//           </Form.Item> */}
          
//            <Form.Item label="Event Name" name="eventName" rules={[{ required: true, message: "Please enter the event name" }]}>
//                      <Input placeholder="Enter event name" />
//                    </Form.Item>
//                    <Form.Item
//   label="Sponsor's Requirement"
//   name="Sponsor-Requirements(Note:Enter how u want to promote)"
//   rules={[{ required: true, message: "Please enter your Requirement" }]}
// >
//   <Input.TextArea placeholder="Enter event description" rows={4} />
// </Form.Item>



//                    <Form.Item 
//   label="SponsorAmount " 
//   name="Sponsor-Amount" 
//   rules={[{ required: true, message: "Please enter the Amount " }]}
// >
//   <InputNumber placeholder="Enter event number" style={{ width: "100%" }} />
// </Form.Item>
          
//           {/* <Form.Item
//             name="email"
//             label="Email"
//             rules={[
//               { required: true, message: 'Please enter your email' },
//               { type: 'email', message: 'Enter a valid email address' },
//             ]}
//           >
//             <Input disabled />
//           </Form.Item> */}
//           {/* <Form.Item
//             name="phone"
//             label="Phone Number"
//             rules={[{ required: true, message: 'Please enter your phone number' }]}
//           >
//             <Input disabled />
//           </Form.Item> */}
//           <Button type="primary" htmlType="submit">
//             Send a Request
//           </Button>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// };

// export default SpoEventDetails;
// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { Spin, Typography, Button, Modal, Form, Input, message, InputNumber } from 'antd';

// import Layout from '../../components/Layout';
// import { useSelector, useDispatch } from 'react-redux';
// import { hideLoading, showLoading } from '../../redux/features/alertSlice';
// import '../../styles/EventRegister.css';
// import '../../styles/Chatroom.css';
// import '../../styles/FormResponse.css';
// import SpoLayout from '../../components/SpoLayout'

// const { Title, Paragraph } = Typography;

// const SpoEventDetails = () => {
//   const { id } = useParams(); // Get the event ID from the URL
//   const [event, setEvent] = useState(null); // Initialize as null for a single event
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [messages, setMessages] = useState([]); // Chat messages state
//   const [newMessage, setNewMessage] = useState(''); // For user input in chatbox
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const { user } = useSelector((state) => state.user); // Get user data from Redux
//   const dispatch = useDispatch();
//   const isOrganizerMessage = (senderId) => senderId === event.userId; // Check if the message sender is the organizer

//   const fetchEventDetails = async () => {
//     try {
//       const response = await axios.get(`/api/v1/user/events/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Cache-Control': 'no-cache', // Disable caching
//         },
//       });

//       if (response.data.data) {
//         setEvent(response.data.data); // Update state with the fetched event data
//         setMessages(response.data.data.chatroom || []); // Set chat messages
//        // console.log(response.data.data.chatroom);
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

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       dispatch(showLoading());
//       const response = await axios.post(
//         `/api/v1/user/events/${id}/chat`,
//         { message: newMessage, eventId: id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       dispatch(hideLoading());

//       if (response.data.success) {
//         setMessages((prevMessages) => [...prevMessages, response.data.message]);
//         setNewMessage(''); // Clear input
//       } else {
//         message.error(response.data.message || 'Failed to send message');
//       }
//     } catch (err) {
//       dispatch(hideLoading());
//       console.error(err);
//       message.error(err.response ? err.response.data.message : 'Failed to send message');
//     }
//   };

//   const handleRegister = async (values) => {
//     try {
//       //const formData = new FormData();
//       //formData.append('sponsorDescription',values.sponsorDescription)
//      // console.log(formData)
//       console.log(values)
//       dispatch(showLoading());
//       const response = await axios.post(
//         `/api/v1/user/events/${id}/sponsor`,
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
//       message.error(err.response ? err.response.data.message : 'Registration failed');
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

//   const isUserRegistered = event?.participants?.some(
//     (participant) => participant._id.toString() === user._id.toString()
//   );

//   return (
//     <SpoLayout>
//       <div>
//         <img
//           src={`/uploads/${event.eventBannerUrl.split('/').pop()}`}
//           alt={event.eventName || 'Event Image'}
//         />
//         <Paragraph>{event.eventDescription || 'No description available'}</Paragraph>
//         <Paragraph>
//           <strong>Location:</strong> {event.eventLocation || 'Location not provided'}
//         </Paragraph>
//         <Paragraph>
//           <strong>Organizer:</strong> {event.organizationName || 'Organizer not provided'}
//         </Paragraph>
//         <Paragraph>
//           <strong>Date:</strong>{' '}
//           {event.eventDate ? new Date(event.eventDate).toLocaleString() : 'Date not available'}
//         </Paragraph>
//         <Paragraph>
//           <strong>Last Date of Registration:</strong>{' '}
//           {event.eventLastDate ? new Date(event.eventLastDate).toLocaleString() : 'Date not available'}
//         </Paragraph>

//         <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
//           Sponsor Event
//         </Button>
//       </div>

//       <Modal
//         title="Sponsor Event"
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           form={form}
//           onFinish={handleRegister}
//           layout="vertical"
//         >
         
//           <Form.Item
//             label="Sponsor's Requirement"
//             name="sponsorDescription"
//             rules={[{ required: true, message: "Please enter your Requirement" }]}
//           >
//             <Input.TextArea placeholder="Enter event description" rows={4} />
//             {/* <Input /> */}
//           </Form.Item>
//           <Form.Item
//             label="SponsorAmount "
//             name="sponsorAmount"
//             rules={[{ required: true, message: "Please enter the Amount " }]}
//           >
//             <InputNumber placeholder="Enter event number" style={{ width: "100%" }} />
//           </Form.Item>
//           <Button type="primary" htmlType="submit">
//             Send  Request
//           </Button>
//         </Form>
//       </Modal>
//     </SpoLayout>
//   );
// };

// export default SpoEventDetails;  

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spin, Typography, Button, Modal, Form, Input, message, InputNumber } from 'antd';

import SpoLayout from '../../components/SpoLayout';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/features/alertSlice';

const { Paragraph } = Typography;

const SpoEventDetails = () => {
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

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleRegister = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/v1/user/events/${id}/sponsor`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        message.success('Sponsor request sent successfully!');
        setIsModalVisible(false);
        form.resetFields();
        fetchEventDetails(); // Refresh event details
      } else {
        message.error(response.data.message || 'Failed to send sponsor request');
      }
    } catch (err) {
      dispatch(hideLoading());
      console.error(err);
      message.error(err.response ? err.response.data.message : 'Failed to send sponsor request');
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

  // Check if the user has already sent a sponsor request
  const hasSentRequest = event?.sponsorRequest?.some(
    (request) => request.userId === user._id
  );

  // Get the status of the sponsor request
  const sponsorRequestStatus = event?.sponsorRequest?.find(
    (request) => request.userId === user._id
  )?.status;

  return (
    <SpoLayout>
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
          {event.eventDate ? new Date(event.eventDate).toLocaleString() : 'Date not available'}
        </Paragraph>
        <Paragraph>
          <strong>Last Date of Registration:</strong>{' '}
          {event.eventLastDate ? new Date(event.eventLastDate).toLocaleString() : 'Date not available'}
        </Paragraph>

        {hasSentRequest ? (
          sponsorRequestStatus === false ? (
            
            <Paragraph type="warning">Request has been sent...</Paragraph>
          ) : (
            <Paragraph type="success">Request has been approved!</Paragraph>
          )
        ) : (
          <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
            Sponsor Event
          </Button>
        )}
      </div>

      <Modal
        title="Sponsor Event"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleRegister} layout="vertical">
          <Form.Item
            label="Sponsor's Requirement"
            name="sponsorDescription"
            rules={[{ required: true, message: "Please enter your Requirement" }]}
          >
            <Input.TextArea placeholder="Enter event description" rows={4} />
          </Form.Item>
          <Form.Item
            label="Sponsor Amount"
            name="sponsorAmount"
            rules={[{ required: true, message: "Please enter the Amount" }]}
          >
            <InputNumber placeholder="Enter amount" style={{ width: "100%" }} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Send Request
          </Button>
        </Form>
      </Modal>
    </SpoLayout>
  );
};

export default SpoEventDetails;