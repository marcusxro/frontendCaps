import React, { useEffect, useState } from 'react'
import Logout from '../comp/Logout'
import Sidebar from '../comp/Sidebar'
import { authentication } from '../authentication'
import { onAuthStateChanged } from 'firebase/auth'
import logo from '../images/milkTea.png'
import PieCharts from '../comp/PieCharts'
import BarCharts from '../comp/BarCharts'
import { Swiper, SwiperSlide } from 'swiper/react';
import product from '../images/third.jpg'

const System = () => {

  document.title = "Cafe Eunoia | System"
  const [user, setUser] = useState('')
  const [uid, setUid] = useState('')
  useEffect(() => {
    const unsub = onAuthStateChanged(authentication, (acc) => {
      if (acc) {
        setUser(acc.email)
        setUid(acc.uid)
      }
    })
    return () => { unsub() }
  }, [user])

  const [activeTab, setActiveTab] = useState('inventory');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };




  const [navChart, setNavChart] = useState('barChart')

  return (
    <div className='system'>
      {user ? (<>
        <Sidebar />
        <div className="contentCon">
          <div className="content">
            <div className="greetFirstText">
              Dashboard
            </div>
            <div className="greet">
              <div className="greetFirst">
                <div className="greetTextFirst">
                  Hello {
                    user &&
                    (uid === '833zG9kIPiUlSIksfg9aIEaeAkZ2' ? <span className='owner'>Marilyn 👋 </span> :
                      uid === 'VquNk68fY6gYZomxUfQgD2MjuRw1' ? <span className='owner'>Alondra 👋 </span> :
                        uid === 'r7vZ5uITjtaBMJpZzKkVU8AUbc73' ? <span className='owner'>Carol 👋 </span> :
                          uid === '6W4fIbuFhVgbw4U5kxR3rLVt2Wd2' ? <span className='owner'>Elizabeth 👋 </span> :
                            <>{user}</>)
                  }

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

                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                    <div className="tabContentInt">
                      <div className="tabContentIntText">
                        Inventory content goes here
                      </div>
                      <button>View activity</button>
                    </div>
                  </div>}
                {activeTab === 'menu' && <div className='tabContent'>Menu content goes here</div>}
                {activeTab === 'reports' && <div className='tabContent'>Reports content goes here</div>}
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
                <button>Learn more</button>
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
                  <div className="swiperForBot">
                    <div className="firstSwiper">
                      <img src={product} alt="" />
                    </div>
                    <div className="secSwiper">
                      <div className="productName">
                        Waffles
                      </div>
                      <div className="productReport">
                        out of stock
                      </div>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio totam veritatis harum impedit ipsa cumque natus modi accusantium tempore asperiores maiores ducimus sapiente nam molestias iure possimus error, culpa esse.</p>
                      <button>
                        update
                      </button>
                    </div>
                  </div>
                </SwiperSlide>

              </Swiper>
            </div>
          </div>
        </div>
      </>) : <></>}
    </div>
  )
}

export default System
