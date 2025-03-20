import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Spin, Typography, Button, Modal, Form, Input, message, Checkbox, Radio, InputNumber } from 'antd';
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
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [responses, setResponses] = useState({});
  const [step, setStep] = useState(1);
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.user); // Get user data from Redux
  const dispatch = useDispatch();
  const isOrganizerMessage = (senderId) => senderId === event.userId; // Check if the message sender is the organizer
  const [collectedData, setCollectedData] = useState({}); // New variable to accumulate data
  const [paymentStatus, setPaymentStatus] = useState(false);




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
        setCollectedData((prev) => ({ ...prev, }));
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

      const values = {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.contact || '',
        responses
      }
      console.log("Both", values)
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

  const fetchPaymentDetails = async() =>{
    try {
      const res= await axios.get(`/api/v1/payment/paymentDetails/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache', // Disable caching
        },
      })
      console.log("res",res)
      const status = res.data.status === true || res.data.status === "true";
      setPaymentStatus(status);
      

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchEventDetails();
    fetchPaymentDetails()
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/v1/user/events/${id}/chat`,
        {
          message: newMessage,
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

  const checkoutHandler = async () => {
    const amount = event.eventAmount
    console.log('amount', amount)
    try {

      const { data: { key } } = await axios.get("http://localhost:3000/api/v1/getkey")

      const { data: { order } } = await axios.post('/api/v1/payment/checkout',
        { amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }

      )



      const options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: user.name,
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        // callback_url: "http://localhost:3000/api/v1/payment/paymentVerification",
       
        handler: async function (response) {
          try {
            const result = await axios.post('/api/v1/payment/paymentVerification', {
              userId:user._id,
              id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
              
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            console.log('Payment successful:', result.data);
            setPaymentStatus(true);
            window.location.reload()
            // Option 2: Refresh payment status from backend after a delay
    setTimeout(() => {
      fetchPaymentDetails();
    }, 2000); // 2 seconds delay
            message.success('Payment successful!');
            // Redirect or show success message
            
      
          } catch (error) {
            console.error('Payment verification failed:', error);
            // Handle error accordingly
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.contact
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          "color": "#2C2F33"
        }
      };
      const razor = new window.Razorpay(options);
      razor.open();


    } catch (error) {
      console.log(error)
    }


    console.log(window)
  }


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
               

              <h4>  <Title level={2}>{event.eventName}</Title></h4>
                <img
          className="spo-event-banner"
          src={`/uploads/${event.eventBannerUrl.split('/').pop()}`}
          alt={event.eventName || 'Event Image'}
        />
               
                <Paragraph> <strong>Description:</strong>{event.eventDescription || 'No description available'}</Paragraph>
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
                {event.eventFee === "Yes" ? 
                <Paragraph>
                 Event Fee: {event.eventAmount || 'Event is Free'}
                </Paragraph> :<h4>Event is Free</h4> }




                {isUserRegistered || user._id === event.userId ? (
                  <>
                    <Paragraph><br/>
                      <b>You are already registered for this event.</b>
                    </Paragraph>
                    <hr/>
                    <div className="text-center"><h1>Chatroom</h1></div>
                    <div className="chatroom">
                      <div className="messages">
                        {messages.map((msg, index) => (
                          <div key={index} className="message-wrapper">
                            {/* Display the user's email and message time */}
                            <div className="message-meta">
                              <span className="message-email"><h6>{msg.senderEmail}</h6></span> {/* Assuming msg.senderEmail exists */}
                          
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
                              className={`message ${isOrganizerMessage(msg.senderId) ? 'organizer-message' : 'user-message'
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
                  event.eventFee === 'Yes' ? 
                 
                 (
       paymentStatus ? (
         // Payment already completed – show submit button.
      <>
      <br/>
         <Button type="primary" onClick={handleNext} className="w-full">
                    Register For Event
                  </Button>
      </>
       ) : (
         <>
         <Button type="primary" onClick={checkoutHandler}>
           Proceed to payment
         </Button><br/><br/>
        
         <h6>Note Once you Have Done the Payment , refresh the page to register</h6>
         
         
         </>
         
         
       )
     )
                 :(
                   <>
                   <br/>
                   <Button type="primary" onClick={handleNext} className="w-full">
                    Register For Event
                  </Button>
                   </>
                 )
                  

                  
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
                  <Button onClick={handlePrev}>Back</Button><hr />

                   <Button type="primary" htmlType="submit">
            Submit
          </Button>
                </div>

              </>
            )}

            {step === 3 && (
              <>

                <h2 className="text-xl font-bold mb-4">Step 2: Payment Gateway</h2>

                <div className="flex justify-between">
                  <Button onClick={handlePrev}>Back</Button><hr />

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