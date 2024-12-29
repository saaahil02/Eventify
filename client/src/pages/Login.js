import React from 'react';
import { Button, Form, Input,message } from 'antd';
import {Link,useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from "../redux/features/alertSlice"; 
import axios from 'axios';
import '../styles/ParticipantLogin.css';
const Login = () => {

  const navigate=useNavigate();
  const dispatch =useDispatch();
  // onfinishhandler 
  const onfinishHandler = async(values) => {
    try {
      dispatch(showLoading());
      const res=await axios.post('/api/v1/user/login',values);
      window.location.reload();
      dispatch(hideLoading());
      if(res.data.success){
        localStorage.setItem("token",res.data.token);
        message.success("Login Succesfully");
        navigate("/home");
      }
      else{
        message.error("Loign Failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong !!");
    }
  }
  return (
      <div className="outer-container">
    
    <Form layout="vertical"  onFinish={onfinishHandler} className='login-form'>
      <h3>Login Here !!</h3>
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
        <Button htmlType='submit'>Login</Button>
      </Form.Item>
      <Link to="/register"> Don't have an account ? Register here</Link> <br/>
    </Form>
    </div>
   

  )
}

export default Login
