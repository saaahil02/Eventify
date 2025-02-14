// import React,{useState,useEffect} from 'react'
// import axios from 'axios'
// import {useParams} from 'react-router-dom'
// import {useSelector} from 'react-redux'
// import {Table,Button,Spin,Modal,Typography} from 'antd'

// import OrgLayout from '../../components/OrgLayout'

// const { Title, Paragraph } = Typography;



// const EventData = () => {
//   const { id } = useParams(); // Get the event ID from the URL
//   const [ParticipantData,SetParticipantData]=useState();
//   const [eventData,SetEventData]=useState();
//   const { user } = useSelector((state) => state.user);


//  const fetchParticipantData = async () => {
//   try {
//     const res = await axios.get(`/api/v1/organizer/${id}/getParticipantData`,{
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     }
//     );
//     //SetParticipantData(res.data.participantData);
//     SetEventData(res.data.eventData)
//     console.log(res.data.eventData)
//   } catch (error) {
//     console.log("Failed to Fetch Participant's Data",error)
//   }
//  };


  

  

//   useEffect(() => {
//      fetchParticipantData()
//     }, []);

   
//      // Define table columns
//   const columns = [
//     {
//       title: 'Participant Name',
//       key: 'participantName',
//       render: (record) =>{  
//         const responses = record.responses || {};
//         const name = responses[0] || 'N/A';
//         return name;}
        
    
//     },
//     {
//       title: 'Email',
//       key: 'participantEmail',
//       render: (record) => {
//         // Get email from responses index 1
//         const responses = record.responses || {};
//         const email = responses[1] || 'N/A';
//         return email;
//       },
//     },
//     {
//       title: 'Contact',
//       key: 'participantContact',
//       render: (record) => {
//         // Get contact from responses index 2
//         const responses = record.responses || {};
//         const contact = responses[2] || 'N/A';
//         return contact;
//       },
//     },
//     {
//       title: 'Responses',
//       key: 'responses',
//       render: (record) => (
//         <div>
//       {eventData &&
//         eventData.questions &&
//         eventData.questions.map((question, index) => {
//           // Use the index to access the response
//           let answer =
//             record.responses && record.responses[index] !== undefined
//               ? record.responses[index]
//               : 'N/A';

//           // If the answer is an array, join it into a string
//           if (Array.isArray(answer)) {
//             answer = answer.join(', ');
//           }

//           return (
//             <div key={index} style={{ marginBottom: '8px' }}>
//               <strong>{question.text}:</strong> {answer.toString()}
//             </div>
//           );
//         })}
//     </div>
//       ),
//     },
//   ];
//   return (
//     <OrgLayout>
//      <div className="text-center" style={{ marginBottom: '20px' }}>
//         <Title level={3}>Participant's Data</Title>
//       </div>
//       {eventData ? (
//         <Table
//           dataSource={eventData.response} // Using the response array from the event data
//           columns={columns}
//           rowKey={(record)=>(record.userId && record.userId._id) || record.userId}
//           pagination={false}
//         />
//       ) : (
//         <Spin size="large" />
//       )}
   

        
//     </OrgLayout>
//   )
// }

// export default EventData
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
        const responses = record.responses || {};
        const name = responses[0] || 'N/A';
        return name;
      },
    },
    {
      title: 'Email',
      key: 'participantEmail',
      render: (record) => {
        const responses = record.responses || {};
        const email = responses[1] || 'N/A';
        return email;
      },
    },
    {
      title: 'Contact',
      key: 'participantContact',
      render: (record) => {
        const responses = record.responses || {};
        const contact = responses[2] || 'N/A';
        return contact;
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
    {
      title: 'Status',
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
