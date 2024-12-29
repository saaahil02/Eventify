import React from 'react'
import Layout from '../components/Layout'
import { Form,Input,Button } from 'antd'
import "../styles/OrganizerRegister.css"

const SponsorDashboard = () => {
  const handlefinish = (values) => {
    console.log(values)
}
  return (
    <div>
      <Layout>
      <div className="form-wrapper">
        <div className="form-container">
        <h3 className="text-center">Sponsor Dashboard</h3>
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
        required: true,
        message: 'Organization Email is required',
      },
      {
        type: 'email',
        message: 'Please provide a valid email address',
      },
    ]}
  >
    <Input />
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

  {/* Organization Affiliation Certificate */}
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

  {/* Organization Proof of Address */}
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

  {/* Representative Contact No */}
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

  {/* Username */}
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

  {/* Password */}
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

 
        <Form.Item >
        <Button htmlType='submit'>Register</Button>
      </Form.Item>
        </Form>
        <hr/><br/>
        </div>
      </div>
      </Layout>
    </div>
  )
}

export default SponsorDashboard
