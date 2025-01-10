import React,{useEffect,useState} from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import { Table,Collapse,Button, message, } from 'antd'


const Organizers = () => {
  const [organizers, setOrganizers] = useState([])

  const { Panel } = Collapse; 


  //getOrganizers
  const getOrganizers =async () => {
    try {
      const res =await axios.get('/api/v1/admin/getAllOrganizers',{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      )
      if(res.data.success)
      {
        setOrganizers(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
//handle account
const handleAccountStatus = async(record,status) => {
  try {
    const res =await axios.post('/api/v1/admin/changeOrgAccountStatus',{organizerId : record._id, userId:record.userId, status},{
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
    getOrganizers()
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
      <h4>All Organizers List</h4>
       <Table columns={columns} dataSource={organizers}> </Table>
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
                <strong>Affiliation Certificate:</strong>{" "}
                {organizer.organizationAffiliationCertificate || "Not Provided"}
              </p>
              <p>
                <strong>Proof of Address:</strong>{" "}
                {organizer.organizationProofOfAddress || "Not Provided"}
              </p>
              <p><strong>Website:</strong> {organizer.organizationWebsite}</p>
              <p><strong>Representative Name:</strong> {organizer.representativeName}</p>
              <p>
                <strong>Contact No:</strong> {organizer.representativeContactNo}
              </p>
              <p>
                <strong>Role:</strong> {organizer.representativeRole}
              </p>
              <p>
                <strong>Username:</strong> {organizer.username}
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

export default Organizers
