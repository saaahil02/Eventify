import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Upload, Button, Checkbox, InputNumber, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import OrgLayout from "../../components/OrgLayout";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../../redux/features/alertSlice.js';
import axios from 'axios';
import '../../styles/CreateEvent.css'

const { TextArea } = Input;
const { Option } = Select;

const CreateEvent = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFreeEvent, setIsFreeEvent] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);

  const handleFinish = async (values) => {
    if (!user || !user._id) {
      message.error('User is not authenticated');
      return;
    }

    if (!bannerFile) {
      message.error('Please upload an event banner');
      return;
    }

    // Convert banner file to Base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        dispatch(showLoading());
        const res = await axios.post('/api/v1/organizer/create-event',
          {
            ...values,
            eventBannerUrl: reader.result, // Attach Base64 banner
            userId: user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        dispatch(hideLoading());
        if (res.data.success) {
          message.success(res.data.message);
          navigate(`/organizer/profile/${user?._id}`);
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error(error);
        message.error('Something went wrong');
      }
    };
    reader.readAsDataURL(bannerFile);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }
    setBannerFile(file);
    return false; // Prevent automatic upload
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

        <Form.Item label="Event Date and Time" name="eventDate" rules={[{ required: true, message: "Please select the date and time" }]}>
          <DatePicker showTime />
        </Form.Item>

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

        <Form.Item label="Event Banner" rules={[{ required: true, message: "Please upload a banner" }]}>
          <Upload listType="picture" maxCount={1} beforeUpload={beforeUpload}>
            <Button icon={<UploadOutlined />}>Upload Banner</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Checkbox checked={isFreeEvent} onChange={(e) => setIsFreeEvent(e.target.checked)}>
            Free Event
          </Checkbox>
        </Form.Item>

        {!isFreeEvent && (
          <Form.Item label="Ticket Price" name="ticketPrice" rules={[{ required: true, message: "Please enter ticket price" }]}>
            <InputNumber min={0} />
          </Form.Item>
        )}

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
