import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Upload, Button, Checkbox, InputNumber, message,Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import OrgLayout from "../../components/OrgLayout";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate,Link, useParams } from 'react-router-dom';
import { hideLoading, showLoading } from '../../redux/features/alertSlice.js';
import axios from 'axios';
import '../../styles/CreateEvent.css'
import Navbar from "../../components/Navbar.js";
import FormBuilder from "../../components/FormBuilder.js";
import FormPreview from "../../components/FormPreview.js";
import '../../styles/GoogleForm.css';

const { TextArea } = Input;
const { Option } = Select;

const CreateEvent = () => {
  
  const { user } = useSelector((state) => state.user);
  const [hasSubmitted, setHasSubmitted] = useState(false); // State to track submission status
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFreeEvent, setIsFreeEvent] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async () => {

    setIsSubmitted(true)

    if (isSubmitted) {
      alert('You have already submitted the form!');
      return;
    }

    console.log({questions: questions})
    
   };


  const handleFinish = async (values) => {
    if (!user || !user._id) {
      message.error('User is not authenticated');
      return;
    }
    
    

    // if (!bannerFile) {
    //   message.error('Please upload an event banner ///');
    //   return;
    // }
    // console.log("Questions t1:", JSON.stringify(questions, null, 2));
    try{
    dispatch(showLoading());
    const formData = new FormData();
    formData.append('eventName',values.eventName)
    formData.append('eventDate',values.eventDate)
    formData.append('eventLastDate',values.eventLastDate)
    formData.append('eventLocation',values.eventLocation)
    formData.append('eventDescription',values.eventDescription)
    //formData.append('isFreeEvent', values.isFreeEvent)
    formData.append('eventCategory',values.eventCategory)
    //formData.append('ticketPrice',values.ticketPrice)
    formData.append('eventMaxParticipants',values.eventMaxParticipants)
   // formData.append('questions',{ questions: questions })
    formData.append("questions", JSON.stringify(questions));

    // questions.forEach((question, index) => 
    //   formData.append(`questions[${index}]`, question)
    // );

   

    //formData.append('FormQuestion',FormQuestion)
     if (values.eventBannerUrl && values.eventBannerUrl[0]) {
        formData.append('eventBannerUrl', values.eventBannerUrl[0].originFileObj);
      } else {
        message.error('Please upload the Event Banner');
        return; // Exit early if no file is provided
      }

      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }

      

       const res = await axios.post(
              '/api/v1/organizer/create-event',
               formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            dispatch(hideLoading());
            if (res.data.success) {
              message.success(res.data.message);
              setHasSubmitted(true);
            } else {
              message.error(res.data.message);
            }
          } catch (error) {
            dispatch(hideLoading());
            console.error(error);
            message.error('Something went wrong');
          }


 

  
      
   };

  return (
    <OrgLayout>
      <Form layout="vertical" onFinish={handleFinish}>
      
      <Form.Item label="Event Name" name="eventName" rules={[{ required: true, message: "Please enter the event name" }]}>
          <Input placeholder="Enter event name" />
        </Form.Item>

        <Form.Item label="Event Description" name="eventDescription" rules={[{ required: true, message: "Please enter the description" }]}>
          <TextArea placeholder="Describe your event" rows={4} />
        </Form.Item>

        {/* <Form.Item label="Event Date and Time" name="eventDate" rules={[{ required: true, message: "Please select the date and time" }]}>
          <DatePicker showTime />
        </Form.Item> */}

        <Form.Item
        label="Event Date and Time"
        name="eventDate"
        rules={[{ required: true, message: "Please select the date and time" }]}
        >
        <DatePicker
        showTime
        onChange={(date, dateString) => {
        console.log("Selected Date:", date?.toISOString()); // Send this to the backend
        }}
        />
        </Form.Item>

        {/* <Form.Item
        label="Last Date of Registration in your event"
        name="eventLastDate"
        rules={[{ required: true, message: "Please select the date and time" }]}
        >
        <DatePicker
        showTime
        onChange={(date, dateString) => {
        console.log("Selected Date:", date?.toISOString()); // Send this to the backend
        }}
        />
        </Form.Item> */}

        <Form.Item
                  label="Last Date of Registration"
                  name="eventLastDate"
                  rules={[
                    { required: true, message: "Please select the date and time" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const eventDate = getFieldValue('eventDate');
                        if (!value || !eventDate || value.isBefore(eventDate)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Last Date of Registration should be before the Event Date"));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    onChange={(date, dateString) => {
                      console.log("Selected Last Registration Date:", date?.toISOString());
                    }}
                  />
                </Form.Item>


        {/* <Form.Item name="eventDate"
        >
          <Input type="Date"/>
        </Form.Item>

        <Form.Item name="eventTime">
          <Input type="time"/>
        </Form.Item> */}


        <Form.Item label="Event Location" name="eventLocation" rules={[{ required: true, message: "Please enter the location" }]}>
          <Input placeholder="Enter location or online link" />
        </Form.Item>

        <Form.Item label="Event Category" name="eventCategory" rules={[{ required: true, message: "Please select a category" }]}>
          <Select placeholder="Select category">
            <Option value="tech">Technology</Option>
            <Option value="art">Art</Option>
            <Option value="sports">Sports</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Maximum Participants" name="eventMaxParticipants" rules={[{ required: true, message: "Please enter max participants" }]}>
          <InputNumber min={1} />
        </Form.Item>

        {/* <Form.Item label="Event Banner" rules={[{ required: true, message: "Please upload a banner" }]}>
          <Upload listType="picture" maxCount={1} beforeUpload={beforeUpload}>
            <Button icon={<UploadOutlined />}>Upload Banner</Button>
          </Upload>
        </Form.Item> */}

        

 
      <Form.Item 
          name="eventBannerUrl" 
          label="Event Banner"
          valuePropName="fileList" // This binds the file input to the form value
          getValueFromEvent={(e) => e && e.fileList} // This ensures the file list is accessible
          rules={[{ required: true, message: 'Please upload the Event Banner' }]}
        >
          <Upload 
            beforeUpload={() => false} // Disables automatic upload
            maxCount={1} 
            accept=".png,.jpg,.jpeg" 
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
             {/* <Form.Item>
          <Checkbox checked={isFreeEvent} onChange={(e) => setIsFreeEvent(e.target.checked)}>
            Free Event
          </Checkbox>
        </Form.Item>

        {!isFreeEvent && (
          <Form.Item label="Ticket Price" name="ticketPrice" rules={[{ required: true, message: "Please enter ticket price" }]}>
            <InputNumber min={0} />
          </Form.Item>
        )} */}

        <hr/>
        <div className="text-center"><h2>Custom Filling  Form</h2> 
        {/* <h3><Link to="/user/googleForm">Click Here</Link></h3> */}
       
        

        <Button type="primary" size="large" onClick={() => setIsModalVisible(true)} >
                Create Custom Form
                  </Button> 
          <Modal
                  title="Custom Form"
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  footer={null}
                >
                   <div className="App">
        <h1>Custom Filling Form</h1>
        <Navbar filterItem={handleTabChange} />
        {activeTab === 'create' && (
          <FormBuilder questions={questions} setQuestions={setQuestions} />
        )}
        {activeTab === 'preview' && <FormPreview questions={questions} />}
        {/* {activeTab === "response" && <FormResponse questions={questions} />} */}
        <div className="text-center">
          <Button onClick={handleSubmit} disabled={isSubmitted}>
            {isSubmitted ? 'Form Submitted' : 'Submit'}
          </Button>
        </div>
      </div>
                </Modal>
                </div>
        
                  <hr/>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Publish Event
          </Button>
        </Form.Item>
      </Form>
    </OrgLayout>
  );
};

export default CreateEvent;
