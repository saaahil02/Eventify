
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spin, Typography, Button, Modal, Form, Input, message, InputNumber } from 'antd';
import '../../styles/SpoEventDetails.css'
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
       <div className="spo-event-container">
        <div className="spo-event-header">
          <h2>{event.eventName}</h2>
        </div>
        <img
          className="spo-event-banner"
          src={`/uploads/${event.eventBannerUrl.split('/').pop()}`}
          alt={event.eventName || 'Event Image'}
        />
        <div className="spo-event-details">
          <div>
            <Paragraph>
              <strong>Description:</strong> {event.eventDescription || 'No description available'}
            </Paragraph>
            <Paragraph>
              <strong>Location:</strong> {event.eventLocation || 'Location not provided'}
            </Paragraph>
            <Paragraph>
              <strong>Date:</strong>{' '}
              {event.eventDate ? new Date(event.eventDate).toLocaleString() : 'Date not available'}
            </Paragraph>
          </div>
          <div>
            <Paragraph>
              <strong>Organizer:</strong> {event.organizationName || 'Organizer not provided'}
            </Paragraph>
            <Paragraph>
              <strong>Organizer Email:</strong> {event.organizationEmail || 'Organizer not provided'}
            </Paragraph>
            <Paragraph>
              <strong>Last Date of Registration:</strong>{' '}
              {event.eventLastDate ? new Date(event.eventLastDate).toLocaleString() : 'Date not available'}
            </Paragraph>
          </div>
        </div>
        <hr />
        <div className="spo-event-section">
          <h3>Sponsorship Details</h3>
          <Paragraph>
            <strong>Description:</strong> {event.SponsorDescription || 'Not provided'}
          </Paragraph>
        </div>
        <hr />
        <div className="spo-event-section">
          <h3>Event Representative Details</h3>
          <Paragraph>
            <strong>Name:</strong> {event.organizer.representativeName}
          </Paragraph>
          <Paragraph>
            <strong>Contact:</strong> {event.organizer.representativeContactNo}
          </Paragraph>
          <Paragraph>
            <strong>Role:</strong> {event.organizer.representativeRole}
          </Paragraph>
        </div>
        <div className="spo-action">
          {/* {sponsorRequestStatus ? (
            <Paragraph type="success">Request has been approved!</Paragraph>
          ) : (
            <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
              Sponsor Event
            </Button>
          )} */}
        </div>

        <Modal
          title="Sponsor Event"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleRegister} layout="vertical" className="modal-form">
            <Form.Item
              label="Sponsor's Requirement"
              name="sponsorDescription"
              rules={[{ required: true, message: 'Please enter your requirement' }]}
            >
              <Input.TextArea placeholder="Enter your requirement" rows={4} />
            </Form.Item>
            <Form.Item
              label="Sponsor Amount"
              name="sponsorAmount"
              rules={[{ required: true, message: 'Please enter the amount' }]}
            >
              <InputNumber placeholder="Enter amount" style={{ width: '100%' }} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Request
            </Button>
          </Form>
        </Modal>
      </div>
    </SpoLayout>
  );
};

export default SpoEventDetails;