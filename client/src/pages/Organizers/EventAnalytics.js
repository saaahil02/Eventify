import React, { useState, useEffect } from 'react';
import OrgLayout from '../../components/OrgLayout';
import { Table, Spin, Button, Modal, Typography } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const EventAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null); // For participant modal
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  // Fetch organizer's events
  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/v1/user/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch participants for a specific event
  const fetchParticipants = async (eventId) => {
    setParticipantsLoading(true);
    try {
      const response = await axios.get(`/api/v1/user/events/${eventId}/participants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
      render: (record) => record.participantsCount || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedEvent(record);
            fetchParticipants(record._id); // Fetch participants for this event
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
          participants.map((participant) => (
            <div key={participant._id} style={{ marginBottom: '10px' }}>
              <Paragraph>
                <strong>Name:</strong> {participant.name}
              </Paragraph>
              <Paragraph>
                <strong>Email:</strong> {participant.email}
              </Paragraph>
              <Paragraph>
                <strong>Phone:</strong> {participant.phone}
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
