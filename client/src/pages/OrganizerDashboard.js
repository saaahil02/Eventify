import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.js';
import { Form, Input, Button, message,Upload} from 'antd';
import '../styles/OrganizerRegister.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/features/alertSlice.js';
import axios from 'axios';
import { isEmail } from 'validator';
import { UploadOutlined } from '@ant-design/icons';

const OrganizerDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [hasSubmitted, setHasSubmitted] = useState(false); // State to track submission status
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Check if the user has already submitted the form
  useEffect(() => {
    if (!user || !user._id) {
      // If user data is not available, skip the API call or show a loading spinner
      return;
    }
  
    const checkSubmissionStatus = async () => {
      try {
        const res = await axios.get('/api/v1/user/check-organizer-status', {
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

  const handleFinish = async (values) => {
      console.log(values.organizationAffiliationCertificate)
  console.log(values.organizationProofOfAddress)
  if (!user || !user._id) {
    message.error('User is not authenticated');
    return;
  }
  try{
  dispatch(showLoading());

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
  
    // Submit formData using axios
  
    const res = await axios.post(
              '/api/v1/user/Organizer-Register',
               formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            dispatch(hideLoading());
            if (res.data.success) {
              message.success(res.data.message);
              setHasSubmitted(true);
            } else {
              message.error(res.data.message);
            }
          } catch (error) {
            dispatch(hideLoading());
            console.error(error);
            message.error('Something went wrong');
          }
        };
      

  if (!user) {
    return (
      <Layout>
        <div className="form-wrapper">
          <div className="form-container">
            <h3 className="text-center">Loading user data...</h3>
          </div>
        </div>
      </Layout>
    );
  }

  if (hasSubmitted) {
    if(user.isOrganizer){
      return (
        <Layout>
          
              <h3 className="text-center">Your request has been approved!</h3>
              <p className="text-center">You can now access the organizer dashboard.</p>
              <Link to="/organizer/profile">Click here</Link>
          
        </Layout>
      ); 
    } else {
      return (
        <Layout>
          
              <h3 className="text-center">Your request has been submitted!</h3>
         
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <div className="form-wrapper">
        <div className="form-container">
          <h3 className="text-center">Organizer Form Register</h3>
          <Form layout="vertical" onFinish={handleFinish}>
            <Form.Item
              name="organizationName"
              label="Organization Name"
              rules={[
                { required: true, message: 'Organization Name is required' },
                { pattern: /^[A-Za-z\s]+$/, message: 'Organization Name should contain only alphabets and spaces' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="organizationEmail"
              label="Organization Email"
              rules={[
                { required: false, message: 'Organization Email is required' },
                // { validator: (_, value) => (value && isEmail(value) ? Promise.resolve() : Promise.reject(new Error('Please provide a valid email address'))) },
              ]}
            >
              <Input defaultValue={user.email} disabled />
            </Form.Item>

            <Form.Item
              name="organizationType"
              label="Organization Type"
              rules={[{ required: true, message: 'Organization Type is required' }]}
            >
              <select>
                <option value="">Select Organization Type</option>
                <option value="Non-profit">Non-profit</option>
                <option value="Individual">Individual</option>
                <option value="Corporation">Corporation</option>
              </select>
            </Form.Item>

           

            <Form.Item
              name="organizationWebsite"
              label="Organization Website"
              rules={[{ required: false, message: 'Organization Website is required' }, { type: 'url', message: 'Please provide a valid website link' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="representativeName"
              label="Representative Name"
              rules={[
                { required: false, message: 'Representative Name is required' },
                { pattern: /^[A-Za-z\s]+$/, message: 'Representative Name should contain only alphabets and spaces' },
              ]}
            >
              <Input defaultValue={user.name} disabled/>
            </Form.Item>


            <Form.Item
              name="representativeContactNo"
              label="Representative Contact No"
              rules={[
                { required: false, message: 'Representative Contact Number is required' },
                { pattern: /^\d{10}$/, message: 'Representative Contact Number should be a 10-digit number' },
              ]}
            >
              <Input defaultValue={user.contact} disabled/>
            </Form.Item>

            <Form.Item
              name="representativeRole"
              label="Representative Role"
              rules={[{ required: true, message: 'Representative Role is required' }]}
            >
              <Input />
            </Form.Item>

            {/* <Form.Item
              name="organizationAffiliationCertificate"
              label="Organization Affiliation Certificate"
              rules={[{ required: true, message: 'Organization Affiliation Certificate is required' }]}
            >
              <Input type="file" name="organizationAffiliationCertificate" encType="multipart/form-data"/>
            </Form.Item>

            <Form.Item
              name="organizationProofOfAddress"
              label="Organization Proof of Address"
              rules={[{ required: true, message: 'Organization Proof of Address is required' }]}
            >
              <Input type="file" name="organizationProofOfAddress" />
            </Form.Item> */}

            {/* <Form.Item
        name="organizationAffiliationCertificate"
        label="Organization Affiliation Certificate"
        valuePropName="fileList"  // Ant Design handles fileList for Upload component
        getValueFromEvent={({ fileList }) => fileList}  // Extract the fileList from event
        rules={[{ required: true, message: 'Please upload a certificate' }]}
      >
        <Upload
          name="organizationAffiliationCertificate"
          action="/api/v1/user/Organizer-Register"  // Your backend URL
          listType="picture"
          maxCount={1}  // Allow only one file
        >
          <Button icon={<UploadOutlined />}>Upload Certificate</Button>
        </Upload>
      </Form.Item> */}

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

            <Form.Item>
              <Button htmlType="submit">Register</Button>
            </Form.Item>
          </Form>
          <hr />
          <br />
        </div>
      </div>
    </Layout>
  );
};

export default OrganizerDashboard;