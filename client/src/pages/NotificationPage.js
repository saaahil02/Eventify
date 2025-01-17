import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [unreadNotifications, setUnreadNotifications] = useState(user?.notification || []);
  const [readNotifications, setReadNotifications] = useState(user?.seennotification || []);

  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/get-all-notification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        setReadNotifications([...readNotifications, ...unreadNotifications]); // Move all unread to read
        setUnreadNotifications([]); // Clear unread notifications
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/delete-all-notification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        setReadNotifications([]); // Clear all read notifications
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong in notification');
    }
  };

  return (
    <Layout>
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="Unread" key="0">
          <div className="d-flex justify-content-end">
            <h4 className="p-2 text-primary" style={{ cursor: 'pointer' }} onClick={handleMarkAllRead}>
              Mark All Read
            </h4>
          </div>
          {unreadNotifications.map((notificationMsg) => (
            <div className="card" style={{ cursor: 'pointer' }} key={notificationMsg._id}>
              <div className="card-text" onClick={() => navigate(notificationMsg.onClickPath)}>
                {notificationMsg.message}
              </div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key="1">
          <div className="d-flex justify-content-end">
            <h4 className="p-2 text-primary" style={{ cursor: 'pointer' }} onClick={handleDeleteAllRead}>
              Delete All Read
            </h4>
          </div>
          {readNotifications.map((notificationMsg) => (
            <div className="card" style={{ cursor: 'pointer' }} key={notificationMsg._id}>
              <div className="card-text" onClick={() => navigate(notificationMsg.onClickPath)}>
                {notificationMsg.message}
              </div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
