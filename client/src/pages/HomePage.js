import { Form,Button } from 'antd';
import React,{useEffect} from 'react'
import axios from 'axios'
import {useNavigate,Link} from 'react-router-dom'
import Layout from '../components/Layout';
const HomePage = () => {


  // login user data
  const getUserData =async() => {
    try {
      const res =await axios.post('api/v1/user/getUserData',{},{
        headers:{
          Authorization : "Bearer " + localStorage.getItem('token')
        }
      })
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(()=>{
    getUserData()
  },[])
  const Navigate=useNavigate();
  return (
    <div>
      <Layout>
        HomePage
      </Layout>
    </div>
  )
}

export default HomePage
