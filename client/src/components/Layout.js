import React from 'react';
import '../styles/LayoutStyles.css';
import { adminMenu, userMenu } from '../data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const Layout = ({ children }) => {
  const { user } = useSelector(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success('Logout Successfully');
    navigate('/login');
  };

  // Rendering menu list
  const SidebarMenu = user?.isAdmin ? adminMenu : userMenu;

  return (
    <div className="main">
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h1>Eventify</h1>
            <hr />
          </div>
          <div className="menu">
            {SidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`menu-item ${isActive && 'active'}`}
                  key={`${menu.name}-${menu.path}`} // Combine name and path for a unique key
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            <div className="menu-item" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div className="header-content">
              <i className="fa-solid fa-bell"></i>
              <Link to="/UserProfile">{user?.name}</Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
