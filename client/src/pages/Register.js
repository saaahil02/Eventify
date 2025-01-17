
import React from 'react';
import axios from 'axios';
import { Button, Form, Input,message } from 'antd';
import {Link,useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import '../styles/ParticipantRegister.css'
const Register = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();

  // onfinishhandler 
  const onfinishHandler = async(values) => {
    try {
      dispatch(showLoading());
      const res =await axios.post('/api/v1/user/register',values);
      dispatch(hideLoading());
      if(res.data.success){
        message.success('Registration Succesfull !!');
        navigate('/login');
      }
      else{
        message.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error)
      message.error('Something went wrong');
    }
  }

  return (
    <div className="outer-container">
    <Form layout="vertical"  onFinish={onfinishHandler} className='register-form'>
      <h3>Register Here !!</h3>
      <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: 'Name is required' },
            {
        pattern: /^[A-Za-z\s]+$/,
        message: 'User Name should contain only alphabets and spaces',
      },
          ]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        {/* Contact */}
        <Form.Item
          name="contact"
          label="Contact Number"
          rules={[
            {
              required: true,
              pattern: /^\d{10}$/,
              message: 'Contact number must be a 10-digit number',
            },
          ]}
        >
          <Input placeholder="Enter your contact number (optional)" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 5, message: 'Password must be at least 5 characters' },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

      <Form.Item >
        <Button htmlType='submit'>Register</Button>
      </Form.Item>
      <Link to="/login">Already have an account? Login here</Link><br/>
    </Form>
    </div>
    
    
  )
}

export default Register
