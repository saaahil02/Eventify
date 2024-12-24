
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
    <>
    <div className="form-container">
    <Form layout="vertical"  onFinish={onfinishHandler} className='register-form'>
      <h3>Register Here !!</h3>
      <Form.Item label="Username" name="name">
        <Input type='text' required></Input>
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input type='email' required></Input>
      </Form.Item>
      <Form.Item label="Contact Number" name="contact">
        <Input type='number' required></Input>
      </Form.Item>
      <Form.Item label="Password" name="password">
        <Input type='password' required></Input>
      </Form.Item>
      <Form.Item >
        <Button htmlType='submit'>Register</Button>
      </Form.Item>
      <Link to="/login">Already have an account? Login here</Link><br/>
    </Form>
    </div>
    </>
  )
}

export default Register
