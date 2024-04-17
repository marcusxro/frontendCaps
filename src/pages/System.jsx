import React, { useCallback, useEffect, useState } from 'react'
import Logout from '../comp/Logout'
import Sidebar from '../comp/Sidebar'
import { authentication } from '../authentication'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import logo from '../images/milkTea.png'
import PieCharts from '../comp/PieCharts'
import BarCharts from '../comp/BarCharts'
import { Swiper, SwiperSlide } from 'swiper/react';
import product from '../images/updateStock.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Inventory from './Inventory'
import { Link } from 'react-router-dom'
import LearnMore from '../comp/LearnMore'
import firebase from 'firebase/app';
import 'firebase/auth';
import Loading from '../comp/Loading'

const System = () => {
  document.title = "Cafe Eunoia | System"
  const [user, setUser] = useState('')
  const [uid, setUid] = useState('')
  const nav = useNavigate()
  const [firstname, setFirstname] = useState("")
  const [loading, setLoading] = useState(false)
  const [userInf, setUserInf] = useState('')
  const [ban, setBan] = useState(false)
  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.Uid === uid);
        setFirstname(filteredData[0].Firstname)
        setUserInf(filteredData[0])
        setLoading(true)
        setBan(filteredData[0].isBanned)
        console.log(ban)
        if (filteredData[0].isBanned) {
          alert("YOU ARE BANNED")
          signOut(authentication)
            .then(() => {
              console.log("logged out")
            }).catch((err) => {
              console.log(err)
            })
        }

      })
      .catch((error) => {
        setLoading(false)
      });
  }, [firstname, user, ban]);
  const [intAct, setAct] = useState([])
  const [nonFil, setNonFil] = useState([])
  const [menuData, setMenuData] = useState([])

  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/menuDetails') 
      .then((response) => {
        setNonFil(response.data)
        const filteredData = response.data.filter((item) => item.Uid === uid);
        const filteredDatas = response.data.filter((item) => item.EditedUid === uid);
        setMenuData(filteredDatas)
        setAct(filteredData)
      }).catch((err) => {
        console.log(err)
      })
  }, [intAct])
  const [newData, setNewData] = useState([])

  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/getIng')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.Uid === uid);
        setNewData(filteredData)
      }).catch((err) => {
        console.log(err)
      })
  }, [user])

  useEffect(() => {
    const unsub = onAuthStateChanged(authentication, (acc) => {
      if (acc) {
        setUser(acc.email);
        setUid(acc.uid);
        nav('/system');
        if (!acc.emailVerified) {
          console.log("not verified")
          nav('/login'); // Redirect to login if the user's email is not verified
        }
      } else {
        nav('/login'); // Redirect to login if there's no user authenticated
      }
    });
    return () => { unsub() };
  }, []);

  const [activeTab, setActiveTab] = useState('inventory');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [navChart, setNavChart] = useState('barChart')
  const itemsWithPercentage = nonFil.map(item => ({
    ...item,
    percentage: (item.Quantity / item.OverQuan) * 100
  }));
  const highestPercentageItem = itemsWithPercentage.reduce((maxItem, currentItem) => {
    return currentItem.percentage > maxItem.percentage ? currentItem : maxItem;
  }, itemsWithPercentage[0]);
  const filteredHighestPercentageItem = itemsWithPercentage.filter(item => item.percentage === highestPercentageItem.percentage);
  const [repData, setRepData] = useState([])

  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/getReports')
      .then((resp) => {
        const filteredData = resp.data.filter((item) => item.Uid === uid)
        setRepData(filteredData)
      }).catch((err) => {
        console.log(err)
      })
  }, [uid])

  const [showModal, setModal] = useState(false)
  const toggleModal = useCallback(() => {
    setModal(!showModal)
  }, [showModal])
  
  return (
    <div className='system'>
    {loading === true ? (
      <>
        {user ? (<>
        <Sidebar data={"home"} />
        <div className="contentCon">
          <div className="content">
            <div className="dashB">
              <div className="greetFirstText">
                Dashboard
              </div>
              <p>monitor your data here!</p>
            </div>
            <div className="greet">
              <div className="greetFirst">
                <div className="greetTextFirst">
                  Hello {loading ? firstname : <>loading...</>}
                </div>
                <div className="greetPosition">
                  position: {userInf.Position}
                </div>
                <p>It's good to see you again.</p>
              </div>

              <div className="greetImg">
                <img src={logo} alt="" />
              </div>
            </div>
            <div className="activities">
              <div className="actText">
                Your activity
              </div>
              <div className="tabs">
                <div
                  className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => handleTabClick('inventory')}
                >
                  Inventory
                </div>
                <div
                  className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
                  onClick={() => handleTabClick('menu')}
                >
                  Menu
                </div>
                <div
                  className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
                  onClick={() => handleTabClick('reports')}
                >
                  Reports
                </div>
              </div>

              <div className="tab-content">
                {activeTab === 'inventory' &&
                  <div className='tabContent'>
                    {loading ? (
                      <>
                        {intAct.length === 0 ? "No activity found!" : ""}
                        {intAct.map((item) => (
                          <div className="tabContentInt" key={item._id}>
                            <div className="tabContentIntText">
                              {item.ProductName}
                            </div>
                            <button className='actView' onClick={() => { nav('/system/Inventory', { state: { productName: item.ProductName } }) }}>
                              View Activity
                            </button>
                          </div>
                        ))}

                        {newData.map((item) => (
                          <div className="tabContentInt" key={item._id}>
                            <div className="tabContentIntText">
                              {item.IngName}
                            </div>
                            <button className='actView' onClick={() => { nav('/system/Inventory', { state: { firstValue: item.IngName, secondValue: true } }) }}>
                              View Activity
                            </button>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>loading...</>
                    )}

                  </div>}


                {activeTab === 'menu' &&
                  <>
                    {menuData.length === 0 ? "No activity found!" : ""}
                    < div className='tabContents'>
                      {menuData.map((item) => (
                        <div className="menuAct">
                          <div className="menuTabTitle">
                            you edited <span>{item.ProductName}</span>
                          </div>
                          <button className='actView' onClick={() => { nav('/system/menu', { state: { productName: item.ProductName } }) }}>
                            View Activity
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                }
                {activeTab === 'reports' && <div className='tabContent'>
                {repData.length === 0 ? "No activity found!" : ""}
                  {repData.map((item) => (
                    <div className="reportItems">
                      <div className="reportFirst">
                        <div className="reportItemTitle">
                          {item.Incident}
                        </div>
                        <div className="reportItemType">
                          type: {item.RepType}
                        </div>
                      </div>
                      <div className="reportLast">
                        <button onClick={() => { nav('/system/report') }}>Visit</button>
                      </div>
                    </div>
                  ))}
                </div>}
              </div>

            </div>
          </div>
          <div className="chartCon">
            <div className="chart">
              {navChart === 'barChart' ? <BarCharts /> : <PieCharts />}
            </div>
            <div className="lowerCont">
              <div className="wNew">
                <div className="wNewFirst">
                  <span>What's new?</span>
                  <p>Let's see the changes in our system!</p>
                </div>
                <button onClick={() => { toggleModal() }}>Learn more</button>
              </div>
              <div className="arrows">
                <div
                  onClick={() => { setNavChart('barChart') }}
                  className="arrow">
                  <ion-icon name="arrow-back-circle-outline"></ion-icon>
                </div>
                <div
                  onClick={() => { setNavChart('pieChart') }}
                  className="arrow">
                  <ion-icon name="arrow-forward-circle-outline"></ion-icon>
                </div>
              </div>
            </div>
            <div className="contentBot">
              <Swiper className='contentBotSwipe'>
                <SwiperSlide className='swiperForBot'>
                  {filteredHighestPercentageItem.map((item) => (
                    <div className="swiperForBot">
                      <div className="firstSwiper">
                        <img src={product} alt="" />
                      </div>
                      <div className="secSwiper">
                        <div className="productName">
                          {item.ProductName}
                        </div>
                        <div className="productReport">
                          {
                            parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 90 ?
                              <>WARNING (PLEASE UPDATE STOCK COUNTS)</> :
                              parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 80 ?
                                <>WARNING (UPDATE STOCK COUNTS)</> :
                                parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 60 ?
                                  <>consider updating</> :
                                  (parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 30 ?
                                    <>Good</> :
                                    (parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 5 ?
                                      <>Very Good</> :
                                      null
                                    )
                                  )
                          }
                        </div>
                        <p>add your stock counts to increase the availability</p>
                        <button onClick={() => { nav('/system/menu', { state: { productName: item.ProductName } }) }}>
                          update
                        </button>
                      </div>
                    </div>
                  ))}
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </>) : <></>
      }
      {showModal ? (<LearnMore func={toggleModal} />) : <></>}
      </>
    ) : ( <><Loading /> </> )}
    </div >
  )
}

export default System
