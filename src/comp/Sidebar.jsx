import React, { useState } from 'react';
import Logout from './Logout';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTab = (tab) => {
    setActiveTab(tab);
  };
  

  return (
    <div className='sideBar'>
      <div className="sidebarFirst">
        <div className="logos">
          CE
        </div>
        <div className="buttons">
          <NavLink
            to="/system"
            onClick={() => handleTab('home')}
            className={`btns`}
          >
            <ion-icon name="home-outline"></ion-icon>
          </NavLink>
          <NavLink
            to="/system/inventory"
            onClick={() => handleTab('inventory')}
            className={`btns`}
          >
            <ion-icon name="newspaper-outline"></ion-icon>
          </NavLink>
          <NavLink
            to="/system/menu"
            onClick={() => handleTab('Menu')}
            className={`btns`}
          >
            <ion-icon name="list-outline" />
          </NavLink>
          <NavLink
            to="/system/report"
            onClick={() => handleTab('reports')}
            className={`btns`}
          >
            <ion-icon name="folder-open-outline" />
          </NavLink>
          <NavLink
            to="/system/security"
            onClick={() => handleTab('security')}
            className={`btns ${activeTab === 'security' ? 'actives' : ''}`}
          >
            <ion-icon name="lock-closed-outline" />
          </NavLink>
        </div>
      </div>
      <Logout />
    </div>
  );
};

export default Sidebar;
