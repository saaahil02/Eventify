// import React from 'react'
// import Layout from '../components/Layout.js'
// import { Form,Input,Button,message } from 'antd'
// import '../styles/OrganizerRegister.css'
// import {useSelector,useDispatch} from 'react-redux'
// import {useNavigate} from 'react-router-dom'
// import { hideLoading, showLoading } from '../redux/features/alertSlice.js'
// import axios from 'axios'
// import { isEmail, isURL } from 'validator';


// const OrganizerDashboard = () => {
//   const {user} = useSelector(state => state.user)

//   const dispatch=useDispatch()
//   const navigate=useNavigate()
//   //handle form
//     const handlefinish = async(values) => {
//         try {
          
//           dispatch(showLoading())
//           const res = await axios.post('/api/v1/user/Organizer-Register',{...values,userId:user._id},{
//             headers:{
//               Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//           })
//           dispatch(hideLoading())
//            if(res.data.success){
//             message.success(res.data.success)
//             navigate('/')
//            }
//            else{
//             message.error(res.data.success)
//            }
//         } catch (error) {
//           dispatch(hideLoading())
//           console.log(error)
//           message.error('Something went wrong')
//         }
//     }
//   return (
    
//       <Layout>
//       <div className="form-wrapper">
//         <div className="form-container">
//         <h3 className='text-center'>Organizer Form Register</h3>
//         <Form layout='vertical' onFinish={handlefinish}>
//         <Form.Item
//     name="organizationName"
//     label="Organization Name"
//     rules={[
//       {
//         required: true,
//         message: 'Organization Name is required',
//       },
//       {
//         pattern: /^[A-Za-z\s]+$/,
//         message: 'Organization Name should contain only alphabets and spaces',
//       },
//     ]}
//   >
//     <Input />
//   </Form.Item>

//   {/* Organization Email */}
//   <Form.Item
//     name="organizationEmail"
//     label="Organization Email"
//     rules={[
//       {
//         required: true,
//         message: 'Organization Email is required',
//       },
//       {
//       validator: (_, value) =>
//         value && isEmail(value)
//           ? Promise.resolve()
//           : Promise.reject(new Error('Please provide a valid email address')),
//     },
//     ]}
//   >
//     <Input />
//   </Form.Item>

//   {/* Organization Type */}
//   <Form.Item
//     name="organizationType"
//     label="Organization Type"
//     rules={[
//       {
//         required: true,
//         message: 'Organization Type is required',
//       },
//     ]}
//   >
//     <select>
//       <option value="">Select Organization Type</option>
//       <option value="Non-profit">Non-profit</option>
//       <option value="Individual">Individual</option>
//       <option value="Corporation">Corporation</option>
//     </select>
//   </Form.Item>

//   {/* Organization Affiliation Certificate */}
//   <Form.Item 
//     name="organizationAffiliationCertificate"
//     label="Organization Affiliation Certificate"
//     rules={[
//       {
//         required: true,
//         message: 'Organization Affiliation Certificate is required',
//       },
//     ]}
//   >
//     <Input type="file" />
//   </Form.Item>

//   {/* Organization Proof of Address */}
//   <Form.Item
//     name="organizationProofOfAddress"
//     label="Organization Proof of Address"
//     rules={[
//       {
//         required: true,
//         message: 'Organization Proof of Address is required',
//       },
//     ]}
//   >
//     <Input type="file" />
//   </Form.Item>

//   {/* Organization Website */}
//   <Form.Item
//     name="organizationWebsite"
//     label="Organization Website"
//     rules={[
//       {
//         required: true,
//         message: 'Organization Website is required',
//       },
//       {
//         type: 'url',
//         message: 'Please provide a valid website link',
//       },
//     ]}
//   >
//     <Input />
//   </Form.Item>

//   {/* Representative Name */}
//   <Form.Item
//     name="representativeName"
//     label="Representative Name"
//     rules={[
//       {
//         required: true,
//         message: 'Representative Name is required',
//       },
//       {
//         pattern: /^[A-Za-z\s]+$/,
//         message: 'Representative Name should contain only alphabets and spaces',
//       },
//     ]}
//   >
//     <Input />
//   </Form.Item>

//   {/* Representative Contact No */}
//   <Form.Item
//     name="representativeContactNo"
//     label="Representative Contact No"
//     rules={[
//       {
//         required: true,
//         message: 'Representative Contact Number is required',
//       },
//       {
//         pattern: /^\d{10}$/,
//         message: 'Representative Contact Number should be a 10-digit number',
//       },
//     ]}
//   >
//     <Input />
//   </Form.Item>

//   {/* Representative Role */}
//   <Form.Item
//     name="representativeRole"
//     label="Representative Role"
//     rules={[
//       {
//         required: true,
//         message: 'Representative Role is required',
//       },
//     ]}
//   >
//     <Input />
//   </Form.Item>

//   {/* Username */}
//   <Form.Item
//     name="username"
//     label="Username"
//     rules={[
//       {
//         required: true,
//         message: 'Username is required',
//       },
//       {
//         pattern: /^[A-Za-z0-9]+$/,
//         message: 'Username should contain only alphabets and numbers',
//       },
//     ]}
//   >
//     <Input />
//   </Form.Item>

//   {/* Password */}
//   <Form.Item
//     name="password"
//     label="Password"
//     rules={[
//       {
//         required: true,
//         message: 'Password is required',
//       },
//       {
//         min: 5,
//         message: 'Password should be at least 5 characters long',
//       },
//     ]}
//   >
//     <Input.Password />
//   </Form.Item>

 
//         <Form.Item >
//         <Button htmlType='submit'>Register</Button>
//       </Form.Item>
//         </Form>
//         <hr/><br/>
//         </div>
//       </div>
//       </Layout>
    
//   )
// }

// export default OrganizerDashboard

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.js';
import { Form, Input, Button, message } from 'antd';
import '../styles/OrganizerRegister.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/features/alertSlice.js';
import axios from 'axios';
import { isEmail } from 'validator';

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
  

  

  // Handle form submission
  const handleFinish = async (values) => {
    if (!user || !user._id) {
      message.error('User is not authenticated');
      return;
    }
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/Organizer-Register',
        { ...values, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
  

  if (hasSubmitted) {
    if(user.isOrganizer){
      return (
        <Layout>
          <div className="form-wrapper">
            <div className="form-container">
              <h3 className="text-center">Your request has been approved!</h3>
              <p className="text-center">You can now access the organizer dashboard.</p>
              <Link to="/organizer/profile/:id">CLick here</Link>
            </div>
          </div>
        </Layout>
      ); 
    }else{
      return (
        <Layout>
          <div className="form-wrapper">
            <div className="form-container">
              <h3 className="text-center">Your request has been submitted!</h3>

            </div>
          </div>
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
  
              <Form.Item
                name="organizationEmail"
                label="Organization Email"
                rules={[
                  {
                    required: true,
                    message: 'Organization Email is required',
                  },
                  {
                    validator: (_, value) =>
                      value && isEmail(value)
                        ? Promise.resolve()
                        : Promise.reject(new Error('Please provide a valid email address')),
                  },
                ]}
              >
                <Input />
              </Form.Item>
  
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
                label="Organization Affiliation Certificate"
                rules={[
                  {
                    required: true,
                    message: 'Organization Affiliation Certificate is required',
                  },
                ]}
              >
                <Input type="file" />
              </Form.Item>
  
              <Form.Item
                name="organizationProofOfAddress"
                label="Organization Proof of Address"
                rules={[
                  {
                    required: true,
                    message: 'Organization Proof of Address is required',
                  },
                ]}
              >
                <Input type="file" />
              </Form.Item>
  
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
  
              <Form.Item
                name="representativeName"
                label="Representative Name"
                rules={[
                  {
                    required: true,
                    message: 'Representative Name is required',
                  },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: 'Representative Name should contain only alphabets and spaces',
                  },
                ]}
              >
                <Input />
              </Form.Item>
  
              <Form.Item
                name="representativeContactNo"
                label="Representative Contact No"
                rules={[
                  {
                    required: true,
                    message: 'Representative Contact Number is required',
                  },
                  {
                    pattern: /^\d{10}$/,
                    message: 'Representative Contact Number should be a 10-digit number',
                  },
                ]}
              >
                <Input />
              </Form.Item>
  
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
  
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  {
                    required: true,
                    message: 'Username is required',
                  },
                  {
                    pattern: /^[A-Za-z0-9]+$/,
                    message: 'Username should contain only alphabets and numbers',
                  },
                ]}
              >
                <Input />
              </Form.Item>
  
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: 'Password is required',
                  },
                  {
                    min: 5,
                    message: 'Password should be at least 5 characters long',
                  },
                ]}
              >
                <Input.Password />
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
