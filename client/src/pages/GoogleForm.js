import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrgLayout from '../components/OrgLayout';
import Navbar from '../components/Navbar';
import '../styles/GoogleForm.css';
import FormBuilder from '../components/FormBuilder';
import FormPreview from '../components/FormPreview';
import { Button } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';

const GoogleForm = () => {
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks form submission
  const dispatch = useDispatch();
  const navigate = useNavigate(); // React Router navigation hook

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true)
   
    if (isSubmitted) {
      alert('You have already submitted the form!');
      return;
    }

    console.log('Questions:', questions); // Print questions to the console


    // try {
    //   dispatch(showLoading());
    //   const response = await axios.post(
    //     '/api/v1/user/questions',
    //     { questions: questions },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //       },
    //     }
    //   );
    //   dispatch(hideLoading());
    //   if (response.data.success) {
    //     alert('Form created successfully');
    //     setIsSubmitted(true); // Mark the form as submitted
    //     navigate('/organizer/CreateEvent'); // Redirect after submission
    //   } else {
    //     alert('Error creating form');
    //   }
    // } catch (err) {
    //   console.error(err); // Log error for debugging
    //   dispatch(hideLoading());
    //   alert('An error occurred while creating the form');
    // }
  };

  return (
    <OrgLayout>
      <h1>
        <Link to="/organizer/CreateEvent">Go back</Link>
      </h1>
      <div className="App">
        <h1>Custom Filling Form</h1>
        
        {/* <Navbar filterItem={handleTabChange} />
        {activeTab === 'create' && (
          <FormBuilder questions={questions} setQuestions={setQuestions} />
        )}
        {activeTab === 'preview' && <FormPreview questions={questions} />} */}
        {/* {activeTab === "response" && <FormResponse questions={questions} />} */}

        <div className="text-center">
          <Button onClick={handleSubmit} disabled={isSubmitted}>
            {isSubmitted ? 'Form Submitted' : 'Submit'}
          </Button>
          <br/><br/>

          <div className='FormCss'>
          <FormBuilder questions={questions} setQuestions={setQuestions} />
          <FormPreview questions={questions} />
          </div>
        </div>
      </div>
    </OrgLayout>
  );
};

export default GoogleForm;
