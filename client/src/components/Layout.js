import React, { useState } from 'react';
import '../styles/LayoutStyles.css';
import { adminMenu, userMenu } from '../data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success('Logout Successfully');
    navigate('/');
  };

  // Toggle sidebar collapse/expand
  const toggleSidebar = () => setSidebarCollapsed(prevState => !prevState);

  // Determine Sidebar menu based on user role
  const SidebarMenu = user?.isAdmin ? adminMenu : userMenu;

  // Check if menu item is active based on current pathname
  const isActiveMenuItem = (path) => location.pathname === path;

  // Render menu item with conditional active class
  const renderMenuItem = (menu) => {
    const isActive = isActiveMenuItem(menu.path);
    return (
      // <div className={`menu-item ${isActive ? 'active' : ''}`} key={`${menu.name}-${menu.path}`}>
      //   <i className={menu.icon}></i>
      //   {!isSidebarCollapsed && <span>{menu.name}</span>} {/* Show name only when not collapsed */}
      //   <Link to={menu.path}>{menu.name}</Link>
      // </div>
//       <div 
//   className={`menu-item ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`} 
//   key={`${menu.name}-${menu.path}`} 
//   role="menuitem" 
//   aria-label={menu.name}
// >
//   <Link to={menu.path}>
//     <i className={menu.icon}></i>
//     {!isSidebarCollapsed && <span>{menu.name}</span>} {/* Show name only when not collapsed */}
//   </Link>
// </div>
<div 
  className={`menu-item ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`} 
  key={`${menu.name}-${menu.path}`} 
  role="menuitem" 
  aria-label={menu.name}
>
  <Link to={menu.path} className="menu-link">
    <div className="menu-icon">
      <i className={menu.icon}></i>
    </div>
    {!isSidebarCollapsed && <span className="menu-text">{menu.name}</span>}
  </Link>
</div>


    );
  };

  return (
    <div className="main">
      <div className="layout">
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="logo">
            {/* Hide logo when sidebar is collapsed */}
            {!isSidebarCollapsed && <h1>Eventify</h1>}
            <hr />
          </div>

          {/* Hamburger Icon to toggle sidebar */}
          <div className="hamburger" onClick={toggleSidebar}>
            &#9776; {/* Hamburger Icon */}
          </div>

          {/* Menu */}
          <div className="menu">
            {SidebarMenu.map(renderMenuItem)}

            {/* Logout Menu Item */}
            <div className="menu-item" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              {!isSidebarCollapsed && <span>Logout</span>} {/* Show name only when not collapsed */}
            </div>
          </div>
        </div>

        {/* Main Content */}
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
