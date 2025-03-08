import React, { useState } from "react";
import { Card, Button, Form, Input, DatePicker, Select, InputNumber, Upload,message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import OrgLayout from "../../components/OrgLayout";
import Navbar from "../../components/Navbar";
import "../../styles/GoogleForm.css";
import FormBuilder from "../../components/FormBuilder";
import FormPreview from "../../components/FormPreview";
import dayjs from "dayjs";
import {showLoading,hideLoading} from '../../redux/features/alertSlice'
import { useDispatch } from "react-redux";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const { TextArea } = Input;
const { Option } = Select;

const CreateEvent = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({}); // New variable to accumulate data
  const [eventSponsor, setEventSponsor] = useState();
  const [eventFee,setEventFee]=useState();
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("create");
  const dispatch=useDispatch();
  const navigate=useNavigate();

  // Handle Next button click: Validate current fields, then merge page data into collectedData
  const handleNext = async () => {
    try {
      await form.validateFields();
      if (step === 1) {
        // Extract Page 1 data from the form
       
  
        const page1Data = form.getFieldsValue([
          "eventName",
          "eventDescription",
          "eventDate",
          "eventLastDate",
          "eventLocation",
          "eventCategory",
          "eventSponsor",
          "eventSponsorDescription",
          "eventMaxParticipants",
          "eventFee",
          "eventAmount",
          "eventBannerUrl",
        ]);
        setCollectedData((prev) => ({ ...prev, ...page1Data }));
      } else if (step === 2) {
        // In Page 2, assume the custom form data is managed via the 'questions' state.
        // Merge that data into collectedData.
        setCollectedData((prev) => ({ ...prev, questions }));
      }
      setStep((prev) => prev + 1);
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  // Handle Back button click
  const handlePrev = () => setStep((prev) => prev - 1);

  // On final submit (Step 3), optionally merge any additional Page 3 data.
  // Then log the final collected data.
  const handleSubmit = async () => {
    try {
      // Optionally, if you have any Page 3 form fields, extract them here.
      // For example:
      // const page3Data = form.getFieldsValue(["paymentDetails"]);
      // For now, we'll assume Page 3 doesn't have additional form fields.
      const finalData = {
        ...collectedData,
        // ...page3Data, // merge if available
      };

      console.log("Final Submitted Data:", finalData);
      // Optionally, send finalData to your backend:
      // await axios.post("http://localhost:5000/api/formdata", finalData);
      dispatch(showLoading());
      const formData = new FormData();
      formData.append('eventName', finalData.eventName);
      formData.append('eventDate', finalData.eventDate);
      formData.append('eventLastDate', finalData.eventLastDate);
      formData.append('eventLocation', finalData.eventLocation);
      formData.append('eventDescription', finalData.eventDescription);
      formData.append('eventCategory', finalData.eventCategory);
      formData.append('eventSponsor', finalData.eventSponsor);
      formData.append('SponsorDescription', finalData.eventSponsorDescription);
      formData.append('eventMaxParticipants', finalData.eventMaxParticipants);
      formData.append('eventFee', finalData.eventFee);
      formData.append('eventAmount', finalData.eventAmount);
      formData.append("questions", JSON.stringify(questions));

      if (finalData.eventSponser === 'Yes') {
        formData.append('eventSponserDescription', finalData.eventSponserDescription);
      }

      if (finalData.eventBannerUrl && finalData.eventBannerUrl[0]) {
        formData.append('eventBannerUrl', finalData.eventBannerUrl[0].originFileObj);
      } else {
        message.error('Please upload the Event Banner');
        return;
      }

      console.log(formData);

      const res = await axios.post(
        '/api/v1/organizer/create-event',
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
        //setHasSubmitted(true);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error in submission:", error);
      

    }
  };

  return (
    <OrgLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md p-6 space-y-4 shadow-xl">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {step === 1 && (
              <>
                <h2 className="text-xl font-bold mb-4">Step 1: Event Details</h2>
                <Form.Item
                  label="Event Name"
                  name="eventName"
                  rules={[{ required: true, message: "Please enter the event name" }]}
                 // initialValue={"Test Event 1"}
                >
                  <Input placeholder="Enter event name" />
                </Form.Item>

                <Form.Item
                  label="Event Description"
                  name="eventDescription"
                  rules={[{ required: true, message: "Please enter the description" }]}
                 // initialValue={"This is a demo Event"}
                >
                  <TextArea placeholder="Describe your event" rows={4} />
                </Form.Item>

                <Form.Item
                  label="Event Date and Time"
                  name="eventDate"
                  rules={[{ required: true, message: "Please select the date and time" }]}
                 // initialValue={dayjs("2025-02-15 10:00:00")}
                >
                  <DatePicker showTime />
                </Form.Item>

                <Form.Item
                  label="Last Date of Registration"
                  name="eventLastDate"
                  rules={[
                    { required: true, message: "Please select the date and time" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const eventDate = getFieldValue("eventDate");
                        if (!value || !eventDate || value.isBefore(eventDate)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Last Date of Registration should be before the Event Date"));
                      },
                    }),
                  ]}
                  //initialValue={dayjs("2025-02-12 10:00:00")}
                >
                  <DatePicker showTime />
                </Form.Item>

                <Form.Item
                  label="Event Location"
                  name="eventLocation"
                  rules={[{ required: true, message: "Please enter the location" }]}
                //  initialValue={"Dombivli"}
                >
                  <Input placeholder="Enter location or online link" />
                </Form.Item>

                <Form.Item
                  label="Event Category"
                  name="eventCategory"
                  rules={[{ required: true, message: "Please select a category" }]}
                 // initialValue="tech"
                >
                  <Select placeholder="Select category">
                    <Option value="tech">Technology</Option>
                    <Option value="art">Art</Option>
                    <Option value="sports">Sports</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Event Sponsor"
                  name="eventSponsor"
                  rules={[{ required: true, message: "Requires Sponsor For Event" }]}
                >
                  <Select placeholder="Required Sponsor" onChange={(value) => setEventSponsor(value)}>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                </Form.Item>

                {eventSponsor === "Yes" && (
                  <Form.Item
                    label="Sponsor Description"
                    name="eventSponsorDescription"
                    rules={[{ required: true, message: "Please enter the sponsor description" }]}
                    //initialValue={"We are open to sponsorships"}
                  >
                    <TextArea placeholder="Enter sponsor description" rows={4} />
                  </Form.Item>
                )}

                <Form.Item
                  label="Event Fee"
                  name="eventFee"
                  rules={[{ required: true, message: "Requires Fee For Event" }]}
                >
                  <Select placeholder="Required Fee" onChange={(value) => setEventFee(value)}>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                </Form.Item>

                {eventFee === "Yes" && (
                  <Form.Item
                    label="Amount"
                    name="eventAmount"
                    rules={[{ required: true, message: "Please enter the sponsor description" }]}
                    //initialValue={"We are open to sponsorships"}
                  >
                    {/* <TextArea placeholder="Enter sponsor description" rows={4} /> */}
                    <InputNumber placeholder="Enter Amount"></InputNumber>
                  </Form.Item>
                )}

                <Form.Item
                  label="Maximum Participants"
                  name="eventMaxParticipants"
                  rules={[{ required: true, message: "Please enter max participants" }]}
                //  initialValue={10}
                >
                  <InputNumber min={1} />
                </Form.Item>



                <Form.Item
                  name="eventBannerUrl"
                  label="Event Banner"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e && e.fileList}
                  rules={[{ required: true, message: "Please upload the Event Banner" }]}
                >
                  <Upload beforeUpload={() => false} maxCount={1} accept=".png,.jpg,.jpeg">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>

                <Button type="primary" onClick={handleNext} className="w-full">
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-bold mb-4">Step 2: Custom Filling Form</h2>
                <div className="FormCss">
                  <FormBuilder questions={questions} setQuestions={setQuestions} />
                  <FormPreview questions={questions} />
                </div>
                <div className="flex justify-between">
                  <Button onClick={handlePrev}>Back</Button>
                  <Button type="primary" onClick={handleNext}>
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-xl font-bold mb-4">Step 3: Payment Details</h2>
                {/* If you have any Page 3 fields, add them as Form.Item here.
                    For this example, we assume there are no additional fields on Page 3. */}
                <div className="flex justify-between">
                  <Button onClick={handlePrev}>Back</Button>
                  {/* Clicking this Submit button triggers the onFinish handler (handleSubmit) */}
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Card>
      </div>
    </OrgLayout>
  );
};

export default CreateEvent;
