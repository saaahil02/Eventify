// import React, { useEffect, useState } from 'react';
// import Layout from '../../components/Layout';
// import axios from 'axios';
// import { Table, Collapse, Button, message } from 'antd';
// import '../../styles/Organizers.css'

// const Organizers = () => {
//   const [organizers, setOrganizers] = useState([]);
//   const { Panel } = Collapse;

//   // Get organizers
//   const getOrganizers = async () => {
//     try {
//       const res = await axios.get('/api/v1/admin/getAllOrganizers', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       if (res.data.success) {
//         setOrganizers(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Handle account status change
//   const handleAccountStatus = async (record, status) => {
//     try {
//       const res = await axios.post(
//         '/api/v1/admin/changeOrgAccountStatus',
//         { organizerId: record._id, userId: record.userId, status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       if (res.data.success) {
//         message.success('Account status changed successfully');
//         window.location.reload();
//       }
//     } catch (error) {
//       message.error('Something went wrong');
//     }
//   };

//   useEffect(() => {
//     getOrganizers();
//   }, []);

//   const columns = [
//     {
//       title: 'Organization Name',
//       dataIndex: 'organizationName',
//     },
//     {
//       title: 'Organization Email',
//       dataIndex: 'organizationEmail',
//     },
//     {
//       title: 'Organization Status',
//       dataIndex: 'status',
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       render: (text, record) => (
//         <div className='d-flex'>
//           {record.status === 'pending' ? (
//             <button className='btn btn-success' onClick={() => handleAccountStatus(record, 'approved')}>
//               Approve
//             </button>
//           ) : (
//             <button className='btn btn-danger'>Reject</button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Layout>
//       <h4>All Organizers List</h4>
//       <Table columns={columns} dataSource={organizers}></Table><hr/>
//       <Collapse accordion>
//         {organizers.map((organizer) => (
//           <Panel header={`${organizer.organizationEmail} (${organizer.status})`} key={organizer._id}>
//             <div>
//               <p><strong>Organization Name:</strong> {organizer.organizationName}</p>
//               <p><strong>Organization Email:</strong> {organizer.organizationEmail}</p>
//               <p><strong>Organization Type:</strong> {organizer.organizationType}</p>
//               <p>
//                 <strong>Affiliation Certificate:</strong>
//                 <div className="event-image">
//                   <img
//                     src={`/uploads/${organizer.organizationAffiliationCertificate.split('/').pop()}`} // Extract the file name
//                     // alt={organizer.organizationName}
//                     style={{ maxWidth: '100%', height: 'auto' }}
//                   />
//                   {organizer.organizationAffiliationCertificate && (
//                     <a
//                       href={`/uploads/${organizer.organizationAffiliationCertificate.split('/').pop()}`}
//                       download
//                     >
//                       <Button type="primary" style={{ marginTop: '10px' }}>Download Certificate</Button>
//                     </a>
//                   )}
//                 </div>
//               </p>
//               <p>
//                 <strong>Proof of Address:</strong>
//                 <div className="event-image">
//                   <img
//                     src={`/uploads/${organizer.organizationProofOfAddress.split('/').pop()}`}
//                     // alt={organizer.organizationName}
//                     style={{ maxWidth: '100%', height: 'auto' }}
//                   />
//                   {organizer.organizationProofOfAddress && (
//                     <a
//                       href={`/uploads/${organizer.organizationProofOfAddress.split('/').pop()}`}
//                       download
//                     >
//                       <Button type="primary" style={{ marginTop: '10px' }}>Download Proof</Button>
//                     </a>
//                   )}
//                 </div>
//               </p>

//               <p><strong>Website:</strong> {organizer.organizationWebsite}</p>
//               <p><strong>Representative Name:</strong> {organizer.representativeName}</p>
//               <p><strong>Contact No:</strong> {organizer.representativeContactNo}</p>
//               <p><strong>Role:</strong> {organizer.representativeRole}</p>
//             </div>
//           </Panel>
//         ))}
//       </Collapse>
//     </Layout>
//   );
// };

// export default Organizers;

import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Collapse, Button, message, Spin } from 'antd';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../../styles/Organizers.css';

const Organizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Panel } = Collapse;

  // Fetch organizers
  const getOrganizers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/admin/getAllOrganizers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setOrganizers(res.data.data);
      } else {
        message.error('Failed to fetch organizers');
      }
    } catch (error) {
      message.error('Something went wrong');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle account status change
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        '/api/v1/admin/changeOrgAccountStatus',
        { organizerId: record._id, userId: record.userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        message.success('Account status changed successfully');
        getOrganizers(); // Refresh the data
      } else {
        message.error('Failed to change account status');
      }
    } catch (error) {
      message.error('Something went wrong');
      console.log(error);
    }
  };

  // Download as PDF
  const handleDownloadPDF = async (id, elementId, filename) => {
    const input = document.getElementById(`${elementId}-${id}`);
    if (!input) {
      message.error('Element not found for PDF generation');
      return;
    }
    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Width for A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      message.error('Failed to generate PDF');
      console.log(error);
    }
  };

  useEffect(() => {
    getOrganizers();
  }, []);

  const columns = [
    {
      title: 'Organization Name',
      dataIndex: 'organizationName',
    },
    {
      title: 'Organization Email',
      dataIndex: 'organizationEmail',
    },
    {
      title: 'Organization Status',
      dataIndex: 'status',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          {record.status === 'pending' ? (
            <button
              className="btn btn-success"
              onClick={() => handleAccountStatus(record, 'approved')}
            >
              Approve
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => handleAccountStatus(record, 'rejected')}
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h4>All Organizers List</h4>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Table columns={columns} dataSource={organizers} rowKey="_id" />
          <hr />
          <Collapse accordion>
            {organizers.map((organizer) => (
              <Panel
                header={`${organizer.organizationEmail} (${organizer.status})`}
                key={organizer._id}
              >
                <div>
                  <p><strong>Organization Name:</strong> {organizer.organizationName}</p>
                  <p><strong>Organization Email:</strong> {organizer.organizationEmail}</p>
                  <p><strong>Organization Type:</strong> {organizer.organizationType}</p>

                  <p>
                    <strong>Affiliation Certificate:</strong>
                    <div id={`certificate-container-${organizer._id}`} className="event-image">
                      <img
                        src={`/uploads/${organizer.organizationAffiliationCertificate.split('/').pop()}`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        alt="Affiliation Certificate"
                      />
                      {organizer.organizationAffiliationCertificate && (
                        <Button
                          type="primary"
                          style={{ marginTop: '10px' }}
                          onClick={() =>
                            handleDownloadPDF(
                              organizer._id,
                              'certificate-container',
                              'Affiliation_Certificate'
                            )
                          }
                        >
                          Download as PDF
                        </Button>
                      )}
                    </div>
                  </p>

                  <p>
                    <strong>Proof of Address:</strong>
                    <div id={`proof-container-${organizer._id}`} className="event-image">
                      <img
                        src={`/uploads/${organizer.organizationProofOfAddress.split('/').pop()}`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        alt="Proof of Address"
                      />
                      {organizer.organizationProofOfAddress && (
                        <Button
                          type="primary"
                          style={{ marginTop: '10px' }}
                          onClick={() =>
                            handleDownloadPDF(
                              organizer._id,
                              'proof-container',
                              'Proof_of_Address'
                            )
                          }
                        >
                          Download as PDF
                        </Button>
                      )}
                    </div>
                  </p>

                  <p><strong>Website:</strong> {organizer.organizationWebsite}</p>
                  <p><strong>Representative Name:</strong> {organizer.representativeName}</p>
                  <p><strong>Contact No:</strong> {organizer.representativeContactNo}</p>
                  <p><strong>Role:</strong> {organizer.representativeRole}</p>
                </div>
              </Panel>
            ))}
          </Collapse>
        </>
      )}
    </Layout>
  );
};

export default Organizers;
