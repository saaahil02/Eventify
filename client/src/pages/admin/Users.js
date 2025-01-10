import React,{useEffect,useState} from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import { Table } from 'antd'

const Users = () => {
  const [users, setUsers] = useState([])

  //getUsers
  const getUsers =async () => {
    try {
      const res =await axios.get('/api/v1/admin/getAllUsers',{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      )
      if(res.data.success)
      {
        setUsers(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getUsers()
  },[])

  // antD table col
  const columns = [
    {
      title:'Name',
      dataIndex:'name',
    },
    {
      title:'Email',
      dataIndex:'email',
    },
    {
      title:'Organizer',
      dataIndex:'isOrganizer',
      render:(text,record) => (
        <span>{record.isOrganizer ?'Yes':'No'}</span>
      )
    },
    {
      title:'Sponsor',
      dataIndex:'isSponsor',
      render:(text,record) => (
        <span>{record.isSponsor ?'Yes':'No'}</span>
      )
    },
    {
      title:'Actions',
      dataIndex:'actions',
      render: (text, record) => (
        <div className='d-flex'>
          <button className='btn btn-danger'>Block</button>
        </div>
      )
    },
  ]
  
  return (
    <Layout>
      <h4 className='text-center m-2'>All Users List</h4>
      <Table columns={columns} dataSource={users}> </Table>
    </Layout>
  )
}

export default Users
