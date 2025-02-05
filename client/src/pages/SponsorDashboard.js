import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Form,Input,Button,message,Upload } from 'antd'
import "../styles/Dashboard.css"
import {useSelector,useDispatch} from 'react-redux'
import {useNavigate,Link} from 'react-router-dom'
import { hideLoading, showLoading } from '../redux/features/alertSlice.js'
import axios from 'axios'
import { isEmail, isURL } from 'validator';
import { UploadOutlined } from '@ant-design/icons';



const SponsorDashboard = () => {

  
   const {user} = useSelector(state => state.user)
   const [hasSubmitted, setHasSubmitted] = useState(false); // State to track submission status
    const dispatch=useDispatch()
    const navigate=useNavigate()

    // Check if the user has already submitted the form
  useEffect(() => {
    if (!user || !user._id) {
      // If user data is not available, skip the API call or show a loading spinner
      return;
    }
  
    const checkSubmissionStatus = async () => {
      try {
        const res = await axios.get('/api/v1/user/check-sponsor-status', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            userId: user._id,
          },
        });
        if (res.data.submitted) {
          setHasSubmitted(true);
        }
      } catch (error) {
        console.error('Error checking submission status:', error);
      }
    };
  
    checkSubmissionStatus();
  }, [user]);


  const handlefinish = async(values) => {
    if (!user || !user._id) {
          message.error('User is not authenticated');
          return;
        }
    try {
      dispatch(showLoading())

       const formData = new FormData();
        
          // Ensure user email, name, and contact are pulled from the user object
          formData.append('organizationEmail', user.email || '');
          formData.append('representativeName', user.name || '');
          formData.append('representativeContactNo', user.contact || '');
        
          // Append other fields
          formData.append('organizationName', values.organizationName);
          formData.append('organizationType', values.organizationType);
          formData.append('organizationWebsite', values.organizationWebsite);
          formData.append('representativeRole', values.representativeRole);
          formData.append('userId', user._id);
        
         
        // Validate files before appending and check their properties
        if (values.organizationAffiliationCertificate && values.organizationAffiliationCertificate[0]) {
          formData.append('organizationAffiliationCertificate', values.organizationAffiliationCertificate[0].originFileObj);
        } else {
          message.error('Please upload the affiliation certificate');
          return; // Exit early if no file is provided
        }
      
        if (values.organizationProofOfAddress && values.organizationProofOfAddress[0]) {
          formData.append('organizationProofOfAddress', values.organizationProofOfAddress[0].originFileObj);
        } else {
          message.error('Please upload the proof of address');
          return; // Exit early if no file is provided
        }
        
          // Log formData entries
          for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
          }
        

      const res = await axios.post('/api/v1/user/Sponsor-Register',formData,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideLoading())
       if(res.data.success){
        message.success(res.data.message)
        setHasSubmitted(true);
       }
       else{
        message.error(res.data.success)
       }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
      message.error('Something went wrong')
    }
}
if (hasSubmitted) {
  if(user.isSponsor){
    return (
      <Layout>
       <div className="status-card">
          {user.isSponsor ? (
            <>
              <h3>Your request has been approved! 🎉</h3>
              <p>You can now access the sponsor dashboard</p>
              <Link to="/sponsor/profile">Access Dashboard</Link>
            </>
          ) : (
            <>
              <h3>Request Submitted Successfully! ✔️</h3>
              <p>Your application is under review. We'll notify you once approved.</p>
            </>
          )}
        </div>
       
    </Layout>
    ); 
  }
}
  return (
    <div>
      <Layout>
      <div className="form-wrapper">
        <h3 className="form-title">Sponsor Dashboard</h3>
      <Form layout='vertical' onFinish={handlefinish}>
        <Form.Item
    name="organizationName"
    label="Organization Name"
    rules={[
      {
        required: true,
        message: 'Organization Name is required',
      },
      {
        pattern: /^[A-Za-z\s]+$/,
        message: 'Organization Name should contain only alphabets and spaces',
      },
    ]}
  >
    <Input />
  </Form.Item>

  {/* Organization Email */}
  <Form.Item
    name="organizationEmail"
    label="Organization Email"
    rules={[
      {
        required: false,
        message: 'Organization Email is required',
      },
    ]}
  >
    <Input defaultValue={user.email} disabled/>
  </Form.Item>

  {/* Organization Type */}
  <Form.Item
    name="organizationType"
    label="Organization Type"
    rules={[
      {
        required: true,
        message: 'Organization Type is required',
      },
    ]}
  >
    <select>
      <option value="">Select Organization Type</option>
      <option value="Non-profit">Non-profit</option>
      <option value="Individual">Individual</option>
      <option value="Corporation">Corporation</option>
    </select>
  </Form.Item>

  

<Form.Item
  name="organizationAffiliationCertificate" 
  label="Affiliation Certificate"
  valuePropName="fileList" // This binds the file input to the form value
  getValueFromEvent={(e) => e && e.fileList} // This ensures the file list is accessible
  rules={[{ required: true, message: 'Please upload the affiliation certificate' }]}
>
  <Upload 
    beforeUpload={() => false} // Disables automatic upload
    maxCount={1} 
    accept=".png,.jpg,.jpeg,.pdf" 
  >
    <Button icon={<UploadOutlined />}>Click to upload</Button>
  </Upload>
</Form.Item>

<Form.Item 
  name="organizationProofOfAddress" 
  label="Proof of Address"
  valuePropName="fileList" 
  getValueFromEvent={(e) => e && e.fileList}
  rules={[{ required: true, message: 'Please upload the proof of address' }]}
>
  <Upload 
    beforeUpload={() => false}
    maxCount={1} 
    accept=".png,.jpg,.jpeg,.pdf" 
  >
    <Button icon={<UploadOutlined />}>Click to upload</Button>
  </Upload>
</Form.Item>

  {/* Organization Website */}
  <Form.Item
    name="organizationWebsite"
    label="Organization Website"
    rules={[
      {
        required: true,
        message: 'Organization Website is required',
      },
      {
        type: 'url',
        message: 'Please provide a valid website link',
      },
    ]}
  >
    <Input />
  </Form.Item>

  {/* Representative Name */}
  <Form.Item
    name="representativeName"
    label="Representative Name"
    rules={[
      {
        required: false,
        message: 'Representative Name is required',
      },
      {
        pattern: /^[A-Za-z\s]+$/,
        message: 'Representative Name should contain only alphabets and spaces',
      },
    ]}
  >
    <Input  defaultValue={user.name} disabled />
  </Form.Item>

  {/* Representative Contact No */}
  <Form.Item
    name="representativeContactNo"
    label="Representative Contact No"
    rules={[
      {
        required: false,
        message: 'Representative Contact Number is required',
      },
      {
        pattern: /^\d{10}$/,
        message: 'Representative Contact Number should be a 10-digit number',
      },
    ]}
  >
    <Input defaultValue={user.contact} disabled />
  </Form.Item>

  {/* Representative Role */}
  <Form.Item
    name="representativeRole"
    label="Representative Role"
    rules={[
      {
        required: true,
        message: 'Representative Role is required',
      },
    ]}
  >
    <Input />
  </Form.Item>

 
        <Form.Item >
        <Button htmlType='submit'>Register</Button>
      </Form.Item>
        </Form>
        <hr/><br/>
        </div>
      
      </Layout>
    </div>
  )
}

export default SponsorDashboard
