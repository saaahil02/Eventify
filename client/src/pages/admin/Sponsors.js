import React,{useEffect,useState}  from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import { Table,Collapse,Button, message, } from 'antd'

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([])

  const { Panel } = Collapse; 


  //getOrganizers
  const getSponsors =async () => {
    try {
      const res =await axios.get('/api/v1/admin/getAllSponsors',{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      )
      if(res.data.success)
      {
        setSponsors(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
//handle account
const handleAccountStatus = async(record,status) => {
  try {
    const res =await axios.post('/api/v1/admin/changeSpoAccountStatus',{sponsorId : record._id, userId:record.userId, status},{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    if(res.data.success)
      {
        message.success('Account status changed successfully')
        window.location.reload();
        }

  } catch (error) {
    message.error('something went wrong')
  }
}
  
  useEffect(()=>{
    getSponsors()
  },[])

  const columns =[
    {
      title:'Organization Name',
      dataIndex:'organizationName',
    },
    {
      title:'Organization email',
      dataIndex:'organizationEmail',
    },
    {
      title:'Organization Stauts',
      dataIndex:'status',
    },
    {
      title:'Actions',
      dataIndex:'actions',
      render:(text,record)=>(
        <div className='d-flex'>
        {record.status === 'pending' ? (
          <button className='btn btn-success' onClick={()=>handleAccountStatus(record,'approved')}>Approve</button> 
          ): (
            <button className='btn btn-danger'>Reject</button>
            )} 
        </div>
      )
    },
    

  ]
  
  return (
    <Layout>
      <h4> All Sponsors List</h4>
             <Table columns={columns} dataSource={sponsors}> </Table>
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
                      <strong>Affiliation Certificate:</strong>{" "}
                      {sponsor.organizationAffiliationCertificate || "Not Provided"}
                    </p>
                    <p>
                      <strong>Proof of Address:</strong>{" "}
                      {sponsor.organizationProofOfAddress || "Not Provided"}
                    </p>
                    <p><strong>Website:</strong> {sponsor.organizationWebsite}</p>
                    <p><strong>Representative Name:</strong> {sponsor.representativeName}</p>
                    <p>
                      <strong>Contact No:</strong> {sponsor.representativeContactNo}
                    </p>
                    <p>
                      <strong>Role:</strong> {sponsor.representativeRole}
                    </p>
                    <p>
                      <strong>Username:</strong> {sponsor.username}
                    </p>
                    {/* <div className="d-flex gap-2">
                      {organizer.status === "pending" ? (
                        <Button type="primary" onClick={() => approveOrganizer(organizer._id)}>
                          Approve
                        </Button>
                      ) : (
                        <Button type="danger" onClick={() => rejectOrganizer(organizer._id)}>
                          Reject
                        </Button>
                      )}
                    </div> */}
                  </div>
                </Panel>
              ))}
            </Collapse>
    </Layout>
  )
}

export default Sponsors
