import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Upload, Button, Checkbox, InputNumber, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import OrgLayout from "../../components/OrgLayout";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import { hideLoading, showLoading } from '../../redux/features/alertSlice.js';
import axios from 'axios';
import '../../styles/CreateEvent.css'

const { TextArea } = Input;
const { Option } = Select;

const CreateEvent = () => {
  const { user } = useSelector((state) => state.user);
    const [hasSubmitted, setHasSubmitted] = useState(false); // State to track submission status
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFreeEvent, setIsFreeEvent] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);

  const handleFinish = async (values) => {
    if (!user || !user._id) {
      message.error('User is not authenticated');
      return;
    }

    // if (!bannerFile) {
    //   message.error('Please upload an event banner ///');
    //   return;
    // }

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
     if (values.eventBannerUrl && values.eventBannerUrl[0]) {
        formData.append('eventBannerUrl', values.eventBannerUrl[0].originFileObj);
      } else {
        message.error('Please upload the Event Banner');
        return; // Exit early if no file is provided
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

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

  //   // Convert banner file to Base64
  //   const reader = new FileReader();
  //   reader.onload = async () => {
  //     try {
  //       dispatch(showLoading());
  //       const res = await axios.post('/api/v1/organizer/create-event',
  //         {
  //           ...values,
  //           eventBannerUrl: reader.result, // Attach Base64 banner
  //           userId: user._id,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //         }
  //       );
  //       dispatch(hideLoading());
  //       if (res.data.success) {
  //         message.success(res.data.message);
  //         navigate(`/organizer/profile/${user?._id}`);
  //       } else {
  //         message.error(res.data.message);
  //       }
  //     } catch (error) {
  //       dispatch(hideLoading());
  //       console.error(error);
  //       message.error('Something went wrong');
  //     }
  //   };
  //   reader.readAsDataURL(bannerFile);
  // };

  // const beforeUpload = (file) => {
  //   const isImage = file.type.startsWith('image/');
  //   const isLt2M = file.size / 1024 / 1024 < 2;

  //   if (!isImage) {
  //     message.error('You can only upload image files!');
  //     return Upload.LIST_IGNORE;
  //   }
  //   if (!isLt2M) {
  //     message.error('Image must be smaller than 2MB!');
  //     return Upload.LIST_IGNORE;
  //   }
  //   setBannerFile(file);
  //   return false; // Prevent automatic upload

      
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

        <Form.Item
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
        <div className="text-center"><h2>Custom Filling  Form</h2> <br/>
        <h3><Link to="/user/googleForm">Click Here</Link></h3>
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
