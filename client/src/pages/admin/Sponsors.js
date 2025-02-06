
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Collapse, Button, message, Spin } from 'antd';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../../styles/Sponsors.css';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Panel } = Collapse;

  // Fetch sponsors
  const getSponsors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/admin/getAllSponsors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setSponsors(res.data.data);
      } else {
        message.error('Failed to fetch sponsors');
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
        '/api/v1/admin/changeSpoAccountStatus',
        { sponsorId: record._id, userId: record.userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        message.success('Account status changed successfully');
        getSponsors(); // Refresh the data
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
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      message.error('Failed to generate PDF');
      console.log(error);
    }
  };

  useEffect(() => {
    getSponsors();
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
          {record.status === 'approved' ? (
            <button
              className="btn btn-danger"
              onClick={() => handleAccountStatus(record, 'rejected')}
            >
              Reject
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => handleAccountStatus(record, 'approved')}
            >
              Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h4>All Sponsors List</h4>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Table columns={columns} dataSource={sponsors} rowKey="_id" />
          <hr />
          <Collapse accordion>
            {sponsors.map((sponsor) => (
              <Panel
                header={`${sponsor.organizationEmail} (${sponsor.status})`}
                key={sponsor._id}
              >
                <div>
                  <p><strong>Organization Name:</strong> {sponsor.organizationName}</p>
                  <p><strong>Organization Email:</strong> {sponsor.organizationEmail}</p>
                  <p><strong>Organization Type:</strong> {sponsor.organizationType}</p>

                  <p>
                    <strong>Affiliation Certificate:</strong>
                    <div id={`certificate-container-${sponsor._id}`} className="event-image">
                      <img
                        src={`/uploads/${sponsor.organizationAffiliationCertificate.split('/').pop()}`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        alt="Affiliation Certificate"
                      />
                      {sponsor.organizationAffiliationCertificate && (
                        <Button
                          type="primary"
                          style={{ marginTop: '10px' }}
                          onClick={() =>
                            handleDownloadPDF(
                              sponsor._id,
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
                    <div id={`proof-container-${sponsor._id}`} className="event-image">
                      <img
                        src={`/uploads/${sponsor.organizationProofOfAddress.split('/').pop()}`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        alt="Proof of Address"
                      />
                      {sponsor.organizationProofOfAddress && (
                        <Button
                          type="primary"
                          style={{ marginTop: '10px' }}
                          onClick={() =>
                            handleDownloadPDF(
                              sponsor._id,
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

                  <p><strong>Website:</strong> {sponsor.organizationWebsite}</p>
                  <p><strong>Representative Name:</strong> {sponsor.representativeName}</p>
                  <p><strong>Contact No:</strong> {sponsor.representativeContactNo}</p>
                  <p><strong>Role:</strong> {sponsor.representativeRole}</p>
                  <p><strong>Username:</strong> {sponsor.username}</p>
                </div>
              </Panel>
            ))}
          </Collapse>
        </>
      )}
    </Layout>
  );
};

export default Sponsors;
