import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import { Card,Spin, Typography, Button, Modal, Form, Input, message,Checkbox,Radio,InputNumber } from 'antd';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import '../styles/EventRegister.css';
import '../styles/Chatroom.css'
import '../styles/FormResponse.css'

const { Title, Paragraph } = Typography;

const EventRegister = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null); // Initialize as null for a single event
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]); // Chat messages state
  const [newMessage, setNewMessage] = useState(''); // For user input in chatbox
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormFilled,setIsFormFilled]=useState(false);
  const [responses, setResponses] = useState({});
  const [step, setStep] = useState(1);
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.user); // Get user data from Redux
  const dispatch = useDispatch();
  const isOrganizerMessage = (senderId) => senderId === event.userId; // Check if the message sender is the organizer
  const [collectedData, setCollectedData] = useState({}); // New variable to accumulate data
  
  
  const handleChange = (index, value) => {
    setResponses({ ...responses, [index]: value });
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      if (step === 1) {
        // Extract Page 1 data from the form
       
  
        const page1Data = form.getFieldsValue([
         
        ]);
        setCollectedData((prev) => ({ ...prev, ...page1Data }));
      } else if (step === 2) {
        // In Page 2, assume the custom form data is managed via the 'questions' state.
        // Merge that data into collectedData.
        setCollectedData((prev) => ({ ...prev,  }));
      }
      setStep((prev) => prev + 1);
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  // Handle Back button click
  const handlePrev = () => setStep((prev) => prev - 1);
  // const handleSubmit = () => {
  //   console.log("Responses Submitted: ", responses);
  //   alert("Form submitted successfully!");
  // };

    // Updated handleSubmit with validation

    const handleSubmit2 = async () => {
      try {
        // const finalData = {
        //   ...collectedData,
        //   // ...page3Data, // merge if available
        // };
  
        //console.log("Final Submitted Data:", finalData);
        await form.validateFields();
        //console.log("Responses Submitted: ", responses);
        
        const values = {  name: user?.name || '',
          email: user?.email || '',
          phone: user?.contact || '',
          responses
          }
          console.log("Both",values)
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
        form.resetFields();
      } catch (errorInfo) {
        console.log('Validation failed:', errorInfo);
      }
    };

const handleSubmit = () => {
  const newErrors = {};

  event.questions.forEach((q, index) => {
    const response = responses[index];
    let error = "";

    // Check required fields
    if (q.required && (!response || (Array.isArray(response) && response.length === 0))) {
      error = "This field is required";
    }

    // Number validations
    if (q.type === "number" && response) {
      if (q.fixedDigits && response.length !== q.fixedDigits) {
        error = `Must be exactly ${q.fixedDigits} digits`;
      }
      if (q.minRange !== null && Number(response) < q.minRange) {
        error = `Minimum value is ${q.minRange}`;
      }
      if (q.maxRange !== null && Number(response) > q.maxRange) {
        error = `Maximum value is ${q.maxRange}`;
      }
    }

    // Email validation
    if (q.type === "text" && q.emailValidation && response) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(response)) {
        error = "Invalid email format";
      }
    }

    if (error) newErrors[index] = error;


  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    alert("Please fix the errors before submitting");
  } else {
    console.log("Responses Submitted: ", responses);
    alert("Form submitted successfully!");
    setErrors({});
    // Add your submission logic here
  }
};


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
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md p-6 space-y-4 shadow-xl">
          <Form form={form} layout="vertical" onFinish={handleSubmit2}
          
          onValuesChange={(changedValues, allValues) => {
         setResponses(allValues);
          }}
          initialValues={responses}

>
            {step === 1 && (
              <>
                <h2 className="text-xl font-bold mb-4"> Event Details</h2>
             
                <Title level={2}>{event.eventName}</Title>
        <img
          // className="event-image"
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
              {/* <Input
                type="text"
                value={newMessage}
                name="message"
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              /> */}
              <Input
  type="text"
  value={newMessage}
  name="message"
  onChange={(e) => setNewMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleSendMessage();
    }
  }}
  placeholder="Type your message..."
/>

              <Button type="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>

          </>
        ) : (
          <Button type="primary" onClick={handleNext} className="w-full">
                  Register For Event
                </Button>
        )}
     

                
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-bold mb-4">Step 1: Fill Event Details</h2>

                
                {event.questions.map((q, index) => (
        <Form.Item
          key={index}
          label={<span>{q.text} {q.required && <span className="required">*</span>}</span>}
          name={index.toString()}
          rules={[
            { 
              required: q.required, 
              message: 'This field is required' 
            },
            ...(q.type === 'text' && q.emailValidation ? [{
              type: 'email',
              message: 'Please enter a valid email address',
            }] : []),
            ...(q.type === 'number' ? [
              {
                validator: (_, value) => {
                  if (q.fixedDigits && value?.toString().length !== q.fixedDigits) {
                    return Promise.reject(`Must be exactly ${q.fixedDigits} digits`);
                  }
                  if (q.minRange !== null && value < q.minRange) {
                    return Promise.reject(`Minimum value is ${q.minRange}`);
                  }
                  if (q.maxRange !== null && value > q.maxRange) {
                    return Promise.reject(`Maximum value is ${q.maxRange}`);
                  }
                  return Promise.resolve();
                }
              }
            ] : [])
          ]}
        >
          {q.type === "text" && <Input placeholder="Your answer" />}
          
          {q.type === "paragraph" && (
            <Input.TextArea rows={4} placeholder="Your answer" />
          )}

          {q.type === "radio" && (
            <Radio.Group>
              {q.options.map((option, oIndex) => (
                <Radio key={oIndex} value={option}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          )}

          {q.type === "checkbox" && (
            <Checkbox.Group>
              {q.options.map((option, oIndex) => (
                <Checkbox key={oIndex} value={option}>
                  {option}
                </Checkbox>
              ))}
            </Checkbox.Group>
          )}

          {q.type === "number" && (
            <InputNumber 
              style={{ width: '100%' }}
              min={q.minRange}
              max={q.maxRange}
            />
          )}
        </Form.Item>
      ))}

       <div className="flex justify-between">
                        <Button onClick={handlePrev}>Back</Button>
                        <Button type="primary" onClick={handleNext}>
                          Next
                        </Button>
                      </div>

              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-xl font-bold mb-4">Step 2: Payment Gateway</h2>
                {/* If you have any Page 3 fields, add them as Form.Item here.
                    For this example, we assume there are no additional fields on Page 3. */}
                <div className="flex justify-between">
                  <Button onClick={handlePrev}>Back</Button>
                  {/* Clicking this Submit button triggers the onFinish handler (handleSubmit) */}
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default EventRegister;