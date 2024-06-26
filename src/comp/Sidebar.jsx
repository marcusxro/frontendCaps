import React, { useState, useEffect } from 'react';
import Logout from './Logout';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from '../authentication';
const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [uid, setUid] = useState('')
  const [loading, setLoad] = useState(false)


  useEffect(() => {
    const unsub = onAuthStateChanged(authentication, (acc) => {
      if (acc) {
        setUid(acc.uid)
      }
    })
    return () => { unsub() }
  }, [uid])


  const [userPos, setUserPos] = useState({ Position: '' });

  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
      .then((response) => {
        const isManager = response.data.filter((item) => item.Uid === uid);
        setUserPos(isManager[0].Position);
        setLoad(true)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [uid]);



  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const [inv, setInv] = useState([])
  const [menu, setMenu] = useState([])
  const [reports, setRep] = useState([])
  const [edited, setEdited] = useState([])
  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/getReports')
      .then((resp) => {
        const filteredData = resp.data.filter((item) => item.Uid === uid)
        setRep(filteredData)

      }).catch((err) => {
        console.log(err)
      })
  }, [uid])
  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/getIng')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.Uid === uid);
        setMenu(filteredData)
      }).catch((err) => {
        console.log(err)
      })
  }, [uid])

  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/menuDetails')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.Uid === uid);
        const filteredDatas = response.data.filter((item) => item.EditedUid === uid);
        setEdited(filteredDatas)
        setInv(filteredData)
      }).catch((err) => {
        console.log(err)
      })
  }, [uid])




  return (
    <div className='sideBar'>
      <div className="sidebarFirst">
        <div className="logos">
          CE
        </div>

        {loading ?
          <div className="buttons">
            
            <NavLink
              to="/system"
              onClick={() => handleTab('home')}
              className={`btns ${activeTab === 'home' && 'activatedTab'}`}
            >
              <ion-icon name="home-outline"></ion-icon>
              <span> {reports.length + inv.length + menu.length + edited.length}</span>
            </NavLink>
            <NavLink
              to="/system/inventory"
              onClick={() => handleTab('inventory')}
              className={`btns ${activeTab === 'inventory' && 'activatedTab'}`}
            >
              <ion-icon name="newspaper-outline"></ion-icon>
            </NavLink>
            <NavLink
              to="/system/menu"
              onClick={() => handleTab('Menu')}
              className={`btns ${activeTab === 'Menu' && 'activatedTab'}`}
            >
              <ion-icon name="list-outline" />
            </NavLink>
            <NavLink
              to="/system/report"
              onClick={() => handleTab('reports')}
              className={`btns ${activeTab === 'reports' && 'activatedTab'}`}
            >
              <ion-icon name="folder-open-outline" />
            </NavLink>
            {userPos === "Staff" ?
              (<></>) :
              <>
                <NavLink
                  to="/system/security"
                  onClick={() => handleTab('security')}
                  className={`btns ${activeTab === 'security' && 'activatedTab'}`}
                >
                  <ion-icon name="lock-closed-outline" />
                </NavLink>
              </>
            }
            <NavLink
              to="/system/notification"
              onClick={() => handleTab('notification')}
              className={`btns ${activeTab === 'notification' && 'activatedTab'}`}
            >
              <ion-icon name="notifications-outline"></ion-icon>
            </NavLink>

            <NavLink
              to="/system/Chat"
              onClick={() => handleTab('chat')}
              className={`btns ${activeTab === 'chat' && 'activatedTab'}`}
            >
              <ion-icon name="chatbox-ellipses-outline"></ion-icon>
            </NavLink>
          </div> :
          <div className="loads">
            Loading..
          </div>
        }
      </div>
      <Logout />
    </div>
  );
};

export default Sidebar;
