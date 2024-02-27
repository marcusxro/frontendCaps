import React, { useEffect, useState } from 'react'
import Logout from './Logout'
import { useNavigate } from 'react-router-dom'


const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('home')

  const handleTab = (tab) => {
    setActiveTab(tab)
  }

  const nav = useNavigate()

  return (
    <div className='sideBar'>
      <div className="sidebarFirst">
        <div className="logos">
          CE
        </div>

        <div className="buttons">
          <div 
          onClick={() => {
            handleTab('home')
          }}
          className={`btns ${activeTab === 'home' ? 'actives' : 'home'}`}>
            <ion-icon name="home-outline"></ion-icon>
          </div>
          <div 
          
          onClick={() => {
            handleTab('inventory')}
          }
          className={`btns ${activeTab === 'inventory' ? 'actives' : 'inventory'}`}>
            <ion-icon name="newspaper-outline"></ion-icon>
          </div>

          <div 
          onClick={() => {

            handleTab('Menu')}}
          className={`btns ${activeTab === 'Menu' ? 'actives' : 'Menu'}`}>
            <ion-icon name="list-outline" />
          </div>
          <div 
          
          onClick={() => {
            handleTab('reports')}}
          className={`btns ${activeTab === 'reports' ? 'actives' : 'reports'}`}>
            <ion-icon name="folder-open-outline" />
          </div>
          <div 
          onClick={() => {

            handleTab('security')}}
          className={`btns ${activeTab === 'security' ? 'actives' : 'security'}`}>
            <ion-icon name="lock-closed-outline" />
          </div>
        </div>

      </div>

      <Logout />
    </div>
  )
}

export default Sidebar
