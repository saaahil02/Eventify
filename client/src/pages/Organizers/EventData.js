
//---------------------------------------------------------------------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table, Button, Spin, Modal, Typography } from 'antd';

import OrgLayout from '../../components/OrgLayout';

const { Title } = Typography;

const EventData = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [eventData, setEventData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { user } = useSelector((state) => state.user);


  const fetchParticipantData = async () => {
    try {
      const res = await axios.get(`/api/v1/organizer/${id}/getParticipantData`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Set event data; assuming eventData is either an object or an array
      setEventData(res.data.eventData);
      console.log(res.data.eventData);
    } catch (error) {
      console.log("Failed to fetch participant data", error);
    }
  };

  useEffect(() => {
    fetchParticipantData();
  }, []);

  // Define table columns
  const columns = [
    {
      title: 'Participant Name',
      key: 'participantName',
      render: (record) => {
        // Assuming responses are stored as an object with numeric keys (0,1,2,...)
        const participant = eventData?.participants?.find(p => p._id === record.userId);
      return participant ? participant.name : 'N/A';
      },
    },
    {
      title: 'Email',
      key: 'participantEmail',
      render: (record) => {
        const participant = eventData?.participants?.find(p => p._id === record.userId);
      return participant ? participant.email : 'N/A';
      },
    },
    {
      title: 'Contact',
      key: 'participantContact',
      render: (record) => {
        const participant = eventData?.participants?.find(p => p._id === record.userId);
        return participant ? participant.contact : 'N/A';
      },
    },
    {
      title: 'Responses',
      key: 'responses',
      render: (record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedRecord(record);
            setModalVisible(true);
          }}
        >
          View Response
        </Button>
      ),
    },
    
  ];

  return (
    <OrgLayout>
      <div className="text-center" style={{ marginBottom: '20px' }}>
        <Title level={3}>Participant's Data</Title>
      </div>
      {eventData ? (
        <>
          <Table
            dataSource={eventData.response} // Using the response array from the event data
            columns={columns}
            rowKey={(record) => (record.userId && record.userId._id) || record.userId}
            pagination={false}
          />

          <Modal
            title="User Responses"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setModalVisible(false)}>
                Close
              </Button>,
            ]}
          >
            {selectedRecord && eventData && eventData.questions && (
              <div>
                {eventData.questions.map((question, index) => {
                  let answer =
                    selectedRecord.responses &&
                    selectedRecord.responses[index] !== undefined
                      ? selectedRecord.responses[index]
                      : 'N/A';
                  if (Array.isArray(answer)) {
                    answer = answer.join(', ');
                  }
                  return (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <strong>{question.text}:</strong> {answer.toString()}
                    </div>
                  );
                })}
              </div>
            )}
          </Modal>
        </>
      ) : (
        <Spin size="large" />
      )}
    </OrgLayout>
  );
};

export default EventData;
