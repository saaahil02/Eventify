import React, { useState, useEffect } from 'react';
import OrgLayout from '../../components/OrgLayout';
import { Table, Spin, Button, Modal, Typography } from 'antd';
import axios from 'axios';
import {useSelector} from 'react-redux'
const { Title, Paragraph } = Typography;

const EventAnalytics = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null); // For participant modal
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  // Fetch organizer's events
  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing');
      return;
    }
    try {
      const response = await axios.get('/api/v1/user/organizer/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data.data || []);  // Ensure response data is in the expected format
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch participants for a specific event
  const fetchParticipants = async (eventId) => {
    setParticipantsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing');
      return;
    }
    try {
      const response = await axios.get(`/api/v1/user/events/${eventId}/participants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParticipants(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch participants:', err);
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const columns = [
    {
      title: 'Event Name',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'Date',
      dataIndex: 'eventDate',
      key: 'eventDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Location',
      dataIndex: 'eventLocation',
      key: 'eventLocation',
    },
    {
      title: 'Participants',
      key: 'participantsCount',
      render: (record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedEvent(record);
            fetchParticipants(record._id);  // Fetch participants for this event
          }}
        >
          View Participants
        </Button>
      ),
    },
  ];

  return (
    <OrgLayout>
      <Title level={3}>Event Analytics</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={events}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Modal for Participants */}
      <Modal
        title={`Participants for ${selectedEvent?.eventName}`}
        visible={!!selectedEvent}
        onCancel={() => {
          setSelectedEvent(null);
          setParticipants([]);
        }}
        footer={null}
      >
        {participantsLoading ? (
  <Spin size="large" />
) : participants.length > 0 ? (
  participants.map((participant, index) => (
    <div key={participant._id} style={{ marginBottom: '10px' }}>
      <Paragraph>
        <strong>Participant No:</strong> {index + 1} {/* Display participant number */}
      </Paragraph>
      <Paragraph>
        <strong>Name:</strong> {participant.name
        }
      </Paragraph>
      <Paragraph>
        <strong>Email:</strong> {participant.email}
      </Paragraph>
      <Paragraph>
        <strong>Phone:</strong> {participant.contact}
      </Paragraph>
    </div>
  ))
) : (
  <Paragraph>No participants registered for this event.</Paragraph>
)}

      </Modal>
    </OrgLayout>
  );
};

export default EventAnalytics;
