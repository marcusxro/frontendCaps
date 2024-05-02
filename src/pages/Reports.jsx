import React, { useEffect, useState } from 'react'
import Sidebar from '../comp/Sidebar'
import ReportsModal from '../comp/ReportsModal'
import axios from 'axios'
import moment from 'moment'
import { authentication } from '../authentication'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import IngRep from '../comp/IngRep'
import EquipRep from '../comp/EquipRep'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import redWarning from '../images/RedWarning.png'
import yellowWarning from '../images/YellowWarning.png'
import greenWarning from '../images/GreenWarning.png'
import gsap from 'gsap'

const Reports = () => {
  document.title = "Reports"
  const [showModal, setModal] = useState(false)
  const [click, setClick] = useState(0)
  const [repData, setRepData] = useState([])
  const [Uid, setUid] = useState('')

  const notif = (stats) => {
    toast.success(stats, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }

  const handleModal = () => {
    setModal(true)
    setClick(click + 1)
    if (click === 2) {
      setModal(false)
      setClick(0)
    }
  }
  const nav = useNavigate()
  useEffect(() => {
    const unsub = onAuthStateChanged(authentication, (acc) => {
      if (acc) {
        setUid(acc.uid)
        if (!acc.emailVerified) {
          nav('/login')
        }
      }
    })
    return () => { unsub() }
  }, [Uid])

  useEffect(() => { // for products
    axios.get('https://backendcaps-7zrx.onrender.com/getReports')
      .then((resp) => {
        setRepData(resp.data)


            const items = document.querySelectorAll('.reportItem');
            gsap.to(items, {
              opacity: 1, // Start with opacity 0
              duration: 1, // Animation duration
              stagger: 0.1, // Stagger the animations
              y: 0
            });
          



      }).catch((err) => {
        console.log(err)
      })
  }, [repData])

  const [IngData, setIngData] = useState([])

  useEffect(() => { // for ingredients
    axios.get('https://backendcaps-7zrx.onrender.com/getIngRep')
      .then((resp) => {
        setIngData(resp.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [IngData])


  const [EquipData, setEquipData] = useState([])

  useEffect(() => { // for equipment
    axios.get('https://backendcaps-7zrx.onrender.com/EquipReport')
      .then((resp) => {
        setEquipData(resp.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [EquipData])


  const [indexItm, setIndex] = useState('')
  const handleEdit = (item) => {
    setIndex(item)
  }


  const sendEdited = (item, prdName) => {
    axios.put(`https://backendcaps-7zrx.onrender.com/reportEdit/${item}`, {
      isResolved: true,
      Uid: Uid,
      Date: Date.now()
    }).then(() => {
      console.log("Report resolved")
      notif(`${prdName} has been successfully resolved!`);
    }).catch((err) => {
      console.log(err)
    })
  }



  const sendEditedIng = (item, prdName) => {
    axios.put(`https://backendcaps-7zrx.onrender.com/IngReport/${item}`, {
      isResolved: true,
      Uid: Uid,
      Date: Date.now()
    }).then(() => {
      console.log("Report resolved")
      notif(`${prdName} has been successfully resolved!`);
    }).catch((err) => {
      console.log(err)
    })
  }


  const sendEditedEquip = (item, prdName) => {
    axios.put(`https://backendcaps-7zrx.onrender.com/EquipReport/${item}`, {
      isResolved: true,
      Uid: Uid,
      Date: Date.now()
    }).then(() => {
      console.log("Report resolved")
      notif(`${prdName} has been successfully resolved!`);
    }).catch((err) => {
      console.log(err)
    })
  }
  //filtering out the isResolved booleans

  //for products
  const filteredFalse = repData.filter((item) => item.isResolved === false)
  const filteredTrue = repData.filter((item) => item.isResolved === true)

  //for ingredients 
  const filteredFalseForIng = IngData.filter((item) => item.isResolved === false)
  const filteredTrueForIng = IngData.filter((item) => item.isResolved === true)

  //for equipment
  const filteredFalseForEquip = EquipData.filter((item) => item.isResolved === false)
  const filteredTrueForEquuip = EquipData.filter((item) => item.isResolved === true)



  // for navigating tabs
  const [naviTab, setNavi] = useState('notR')
  const [navItem, setNavItem] = useState('Products')

  const [seeImg, setSeeImg] = useState(false)
  const [imgLink, setImgLink] = useState('')
  const handleDownload = async () => {
    try {
      // Fetch the image data
      const response = await fetch(`https://backendcaps-7zrx.onrender.com/images/${imgLink}`);
      const imageData = await response.blob();

      // Create a Blob object from the image data
      const blob = new Blob([imageData], { type: 'image/jpeg' });

      // Create an anchor element
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = imgLink; // Set the download filename

      // Trigger a click event on the anchor element
      anchor.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  const getSeverityClass = (repType) => {
    if (repType === 'Theft' || repType === 'Damaged' || repType === 'Expired') {
      return 'severity-high';
    } else if (repType === 'Missing' || repType === 'Spoiled') {
      return 'severity-medium';
    } else {
      return 'severity-low';
    }
  };
  const getSeverityClassForIng = (repType) => {
    switch (repType) {
      case 'Theft':
      case 'Damaged':
      case 'Expired':
        return 'severity-high';
      case 'Missing':
      case 'Spoiled':
        return 'severity-medium';
      case 'Miscount':
      case 'Lack of stocks':
      case 'Other':
        return 'severity-low';
      default:
        return ''; // Default case
    }
  };

  const getSeverityClassForEquip = (repType) => {
    switch (repType) {
      case 'Malfunctioning equipment':
      case 'Equipment breakdown':
      case 'Equipment maintenance required':
        return 'severity-high';
      case 'Missing equipment':
      case 'Damaged equipment':
      case 'Spoiled ingredients':
      case 'Inadequate equipment':
        return 'severity-medium';
      case 'Other issue':
        return 'severity-low';
      default:
        return ''; // Default case
    }
  };


  useEffect(() => {
    if (naviTab === 'Info') {
      gsap.to('.severeItem', {
        opacity: 1, // Start with opacity 0
        duration: 1, // Animation duration
        stagger: 0.1 // Stagger the animations
      })
    } else {
      gsap.to('.severeItem', {
        opacity: 0, // Start with opacity 0
        duration: 1, // Animation duration
        stagger: 0.1, // Stagger the animations
      })
    }
  }, [navItem, naviTab])





  useEffect(() => {
    if (naviTab === 'notR' && navItem) {
      gsap.to('.reportItem', {
        opacity: 1, // Start with opacity 0
        duration: .5, // Animation duration
        stagger: 0.1, // Stagger the animationsx
        y: 0
      })
    } else {
      gsap.to('.reportItem', {
        opacity: 1, // Start with opacity 0
        duration: .5, // Animation duration
        stagger: 0.1, // Stagger the animationsx
        y: 0
      })
    }
  }, [navItem, naviTab])

  return (
    <div className='reportsParent'>
      <Sidebar />
      <ToastContainer />
      <div className="reportsCon">
        <div className="firstHeader">
          <div className={`headerItem ${navItem === 'Products' && 'navi'}`} onClick={() => { setNavItem('Products') }}>
            Products
          </div>
          <div className={`headerItem ${navItem === 'Ingredients' && 'navi'}`} onClick={() => { setNavItem('Ingredients') }}>
            Ingredients
          </div>
          <div className={`headerItem ${navItem === 'Equipment' && 'navi'}`} onClick={() => { setNavItem('Equipment') }}>
            Equipment
          </div>
        </div>

        {navItem === 'Products' &&
          <>
            <div className="reportsHeader">
              <div className={`notR repItm ${naviTab === 'notR' ? "activatedTab" : ""}`} onClick={() => { setNavi("notR") }}>
                Not resolved
              </div>
              <div className={`resolved repItm ${naviTab === 'resolved' ? "activatedTab" : ""}`} onClick={() => { setNavi("resolved") }}>
                Resolved
              </div>
              <div className={`infoBox  ${naviTab === 'Info' ? "activatedTab" : ""}`} onClick={() => { setNavi("Info"); }}>
                <ion-icon name="information-circle-outline"></ion-icon>
              </div>
            </div>
            <div className="reportsChatCon">

              {seeImg !== false &&
                <div className="ev">
                  <div className="evidenceImg">
                    <img src={`http://localhost:8080/images/${imgLink}`} alt="" />
                  </div>
                  <div className="evCon">
                    <button onClick={() => { setSeeImg(!seeImg) }}>close</button>
                    <button onClick={() => { handleDownload() }}>save</button>
                  </div>
                </div>
              }
              {naviTab === 'notR' ? (
                <>
                  <div className="isRes">
                    {filteredFalse.length === 0 && 'No reports at the moment'}
                  </div>
                  {filteredFalse.map((item) => (
                    <div className={`reportItem ${getSeverityClass(item.RepType)}`} key={item._id}>

                      <div className="reportFirst">
                        <div className="reportTitle">
                          {item.Incident}
                        </div>
                        <div className="reportType">
                          Type: {item.RepType}
                        </div>
                        <div className="reportDate">
                          Date: {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                        </div>
                        <div className="reportStats">
                          Status: {item.isResolved ? 'resolved' : 'Unresolved'}
                        </div>
                        <div className="uniqueId">
                          Unique Id: {item._id}
                        </div>
                        <div className="reportDetails">
                          {item.RepDetails}
                        </div>
                      </div>
                      <div className="reportStatsBtn">
                        {indexItm !== item._id ? <button className='isThis' onClick={() => { handleEdit(item._id) }}>is this resolved?</button> : <></>}
                        {item.photoURL &&
                          <div className="imgConBtn">
                            {indexItm !== item._id ?
                              <button
                                className='isThis'
                                onClick={() => {
                                  setSeeImg(!seeImg);
                                  setImgLink(item.photoURL)
                                }}>Evidence</button> : <></>}
                          </div>}
                        {indexItm === item._id && !seeImg ? (
                          <div className="reportStatsBtnConfirm">
                            <button className='repConfirm' onClick={() => { handleEdit(null); sendEdited(item._id, item.Incident) }}>Yes</button>
                            <button className='repCancel' onClick={() => handleEdit(null)}>No</button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </>

              ) : naviTab === 'resolved' ? (
                <>
                  <div className="isRes">
                    {filteredTrue.length === 0 && 'No reports at the moment'}
                  </div>
                  {filteredTrue.map((item) => (
                    <div className={`reportItem ${getSeverityClass(item.RepType)}`} key={item._id}>
                      <div className="reportTitle">
                        {item.Incident}
                      </div>
                      <div className="reportType">
                        Type: {item.RepType}
                      </div>
                      <div className="reportDate">
                        Date: {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                      </div>
                      <div className="reportStats">
                        Status: {item.isResolved ? 'resolved' : ''}
                      </div>
                      <div className="reportDetails">
                        {item.RepDetails}
                      </div>
                      <div className="imgConBtn">
                        {item.photoURL && (
                          <button
                            className='isThis'
                            onClick={() => {
                              setSeeImg(!seeImg);
                              setImgLink(item.photoURL)
                            }}>Evidence</button>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="severityCon">
                  <div className="severeItem">

                    <div className="severeImg">
                      <img src={redWarning} alt="" />
                    </div>

                    <div className="severeType">
                      Severity-High
                    </div>

                    <div className="severeItems">
                      Severity-High reports represent the utmost level of concern and danger within any given context. These reports signify incidents or issues that pose significant threats, whether to physical safety, financial integrity, operational continuity, or reputational standing.
                    </div>

                  </div>

                  <div className="severeItem">
                    <div className="severeImg">
                      <img src={yellowWarning} alt="" />
                    </div>
                    <div className="severeType">
                      Severity-Medium
                    </div>
                    <div className="severeItems">


                      Reports categorized as Severity-Medium, such as instances of missing or spoiled items, require timely attention to prevent operational disruptions and maintain efficiency. These issues, while not as critical as high-severity incidents, can still impact productivity and require prompt resolution.
                    </div>
                  </div>
                  <div className="severeItem">
                    <div className="severeImg">
                      <img src={greenWarning} alt="" />
                    </div>
                    <div className="severeType">
                      Severity-Low
                    </div>
                    <div className="severeItems">

                      For cases involving "Miscount," "Lack of stocks," or categorized as "Other," the severity level is deemed low. These issues, while requiring attention, pose minimal risk or disruption compared to higher-severity incidents.                    </div>
                  </div>
                </div>
              )}

            </div>
            {showModal ? <ReportsModal /> : <></>}
            <div className="absoForm" onClick={() => { setModal(!showModal) }}>
              {showModal ? <>x</> : <div className='reds'>+</div>}
            </div>
          </>
        }

        {navItem === 'Ingredients' &&
          <>
            <div className="reportsHeader">
              <div className={`notR repItm ${naviTab === 'notR' ? "activatedTab" : ""}`} onClick={() => { setNavi("notR") }}>
                Not resolved
              </div>
              <div className={`resolved repItm ${naviTab === 'resolved' ? "activatedTab" : ""}`} onClick={() => { setNavi("resolved") }}>
                Resolved
              </div>
              <div className={`infoBox  ${naviTab === 'Info' ? "activatedTab" : ""}`} onClick={() => { setNavi("Info") }}>
                <ion-icon name="information-circle-outline"></ion-icon>
              </div>
            </div>
            {seeImg !== false &&
              <div className="ev">
                <div className="evidenceImg">
                  <img src={`https://backendcaps-7zrx.onrender.com/images/${imgLink}`} alt="" />
                </div>
                <div className="evCon">
                  <button onClick={() => { setSeeImg(!seeImg) }}>close</button>
                  <button onClick={() => { handleDownload() }}>save</button>
                </div>
              </div>
            }
            <div className="reportsChatCon">

              {naviTab === 'notR' ? (
                <>
                  <div className="isRes">
                    {filteredFalseForIng.length === 0 && 'No reports at the moment'}
                  </div>
                  {filteredFalseForIng.map((item) => (
                    <div className={`reportItem ${getSeverityClassForIng(item.RepType)}`} key={item._id}>
                      <div className="reportFirst">
                        <div className="reportTitle">
                          {item.Incident}
                        </div>
                        <div className="reportType">
                          Type: {item.RepType}
                        </div>
                        <div className="reportDate">
                          Date: {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                        </div>
                        <div className="reportStats">
                          Status: {item.isResolved ? 'resolved' : 'Unresolved'}
                        </div>
                        <div className="uniqueId">
                          Unique Id: {item._id}
                        </div>
                        <div className="reportDetails">
                          {item.RepDetails}
                        </div>
                      </div>
                      <div className="reportStatsBtn">
                        {indexItm !== item._id ? <button className='isThis' onClick={() => { handleEdit(item._id) }}>is this resolved?</button> : <></>}
                        {item.photoURL &&
                          <div className="imgConBtn">
                            {indexItm !== item._id ?
                              <button
                                className='isThis'
                                onClick={() => {
                                  setSeeImg(!seeImg);
                                  setImgLink(item.photoURL)
                                }}>Evidence</button> : <></>}
                          </div>}
                        {indexItm === item._id ? (
                          <div className="reportStatsBtnConfirm">
                            <button className='repConfirm' onClick={() => { handleEdit(null); sendEditedIng(item._id, item.Incident) }}>Yes</button>
                            <button className='repCancel' onClick={() => handleEdit(null)}>No</button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </>

              ) : naviTab === 'resolved' ? (
                <>
                  <div className="isRes">
                    {filteredTrueForIng.length === 0 && 'No reports have been resolved at the moment'}
                  </div>
                  {filteredTrueForIng.map((item) => (
                    <div className={`reportItem ${getSeverityClassForIng(item.RepType)}`} key={item._id}>
                      <div className="reportTitle">
                        {item.Incident}
                      </div>
                      <div className="reportType">
                        Type: {item.RepType}
                      </div>
                      <div className="reportDate">
                        Date: {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                      </div>
                      <div className="reportStats">
                        Status: {item.isResolved ? 'resolved' : ''}
                      </div>
                      <div className="reportDetails">
                        {item.RepDetails}
                      </div>
                      {item.photoURL &&
                        <div className="imgConBtn">
                          {indexItm !== item._id ?
                            <button
                              className='isThis'
                              onClick={() => {
                                setSeeImg(!seeImg);
                                setImgLink(item.photoURL)
                              }}>Evidence</button> : <></>}
                        </div>}
                    </div>
                  ))}
                </>
              ) : (
                <div className="severityCon">
                  <div className="severeItem">

                    <div className="severeImg">
                      <img src={redWarning} alt="" />
                    </div>

                    <div className="severeType">
                      Severity-High
                    </div>

                    <div className="severeItems">
                      Severity-High reports represent the utmost level of concern and danger within any given context. These reports signify incidents or issues that pose significant threats, whether to physical safety, financial integrity, operational continuity, or reputational standing.
                    </div>

                  </div>

                  <div className="severeItem">
                    <div className="severeImg">
                      <img src={yellowWarning} alt="" />
                    </div>
                    <div className="severeType">
                      Severity-Medium
                    </div>
                    <div className="severeItems">


                      Reports categorized as Severity-Medium, such as instances of missing or spoiled items, require timely attention to prevent operational disruptions and maintain efficiency. These issues, while not as critical as high-severity incidents, can still impact productivity and require prompt resolution.
                    </div>
                  </div>
                  <div className="severeItem">
                    <div className="severeImg">
                      <img src={greenWarning} alt="" />
                    </div>
                    <div className="severeType">
                      Severity-Low
                    </div>
                    <div className="severeItems">

                      In cases classified as "Other issue," the severity level is considered low. This designation implies that while the matter requires attention, it poses minimal risk or disruption compared to higher-severity incidents.
                    </div>
                  </div>
                </div>
              )}
            </div>
            {showModal ? <IngRep /> : <></>}
            <div className="absoForm" onClick={() => { setModal(!showModal) }}>
              {showModal ? <>x</> : <div className='reds'>+</div>}
            </div>
          </>
        }


        {navItem === 'Equipment' &&
          <>
            <div className="reportsHeader">
              <div className={`notR repItm ${naviTab === 'notR' ? "activatedTab" : ""}`} onClick={() => { setNavi("notR") }}>
                Not resolved
              </div>
              <div className={`resolved repItm ${naviTab === 'resolved' ? "activatedTab" : ""}`} onClick={() => { setNavi("resolved") }}>
                Resolved
              </div>
              <div className={`infoBox  ${naviTab === 'Info' ? "activatedTab" : ""}`} onClick={() => { setNavi("Info") }}>
                <ion-icon name="information-circle-outline"></ion-icon>
              </div>
            </div>
            {seeImg !== false &&
              <div className="ev">
                <div className="evidenceImg">
                  <img src={`https://backendcaps-7zrx.onrender.com/images/${imgLink}`} alt="" />
                </div>
                <div className="evCon">
                  <button onClick={() => { setSeeImg(!seeImg) }}>close</button>
                  <button onClick={() => { handleDownload() }}>save</button>
                </div>
              </div>
            }
            <div className="reportsChatCon">

              {naviTab === 'notR' ? (
                <>
                  <div className="isRes">
                    {filteredFalseForEquip.length === 0 && 'No reports at the moment'}
                  </div>
                  {filteredFalseForEquip.map((item) => (
                    <div className={`reportItem ${getSeverityClassForEquip(item.RepType)}`} key={item._id}>
                      <div className="reportFirst">
                        <div className="reportTitle">
                          {item.Incident}
                        </div>
                        <div className="reportType">
                          Type: {item.RepType}
                        </div>
                        <div className="reportDate">
                          Date: {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                        </div>
                        <div className="reportStats">
                          Status: {item.isResolved ? 'resolved' : 'Unresolved'}
                        </div>
                        <div className="uniqueId">
                          Unique Id: {item._id}
                        </div>
                        <div className="reportDetails">
                          {item.RepDetails}
                        </div>
                      </div>
                      <div className="reportStatsBtn">
                        {indexItm !== item._id ? <button className='isThis' onClick={() => { handleEdit(item._id) }}>is this resolved?</button> : <></>}
                        {item.photoURL &&
                          <div className="imgConBtn">
                            {indexItm !== item._id ?
                              <button
                                className='isThis'
                                onClick={() => {
                                  setSeeImg(!seeImg);
                                  setImgLink(item.photoURL)
                                }}>Evidence</button> : <></>}
                          </div>}
                        {indexItm === item._id ? (
                          <div className="reportStatsBtnConfirm">
                            <button className='repConfirm' onClick={() => { handleEdit(null); sendEditedEquip(item._id, item.Incident) }}>Yes</button>
                            <button className='repCancel' onClick={() => handleEdit(null)}>No</button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </>

              ) : naviTab === 'resolved' ? (
                <>
                  <div className="isRes">
                    {filteredTrueForEquuip.length === 0 && 'No reports have been resolved at the moment'}
                  </div>
                  {filteredTrueForEquuip.map((item) => (
                    <div className={`reportItem ${getSeverityClassForEquip(item.RepType)}`} key={item._id}>
                      <div className="reportTitle">
                        {item.Incident}
                      </div>
                      <div className="reportType">
                        Type: {item.RepType}
                      </div>
                      <div className="reportDate">
                        Date: {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                      </div>
                      <div className="reportStats">
                        Status: {item.isResolved ? 'resolved' : ''}
                      </div>
                      <div className="reportDetails">
                        {item.RepDetails}
                      </div>
                      {item.photoURL &&
                        <div className="imgConBtn">
                          {indexItm !== item._id ?
                            <button
                              className='isThis'
                              onClick={() => {
                                setSeeImg(!seeImg);
                                setImgLink(item.photoURL)
                              }}>Evidence</button> : <></>}
                        </div>}
                    </div>
                  ))}
                </>
              ) : (
                <div className="severityCon">
                  <div className="severeItem">

                    <div className="severeImg">
                      <img src={redWarning} alt="" />
                    </div>

                    <div className="severeType">
                      Severity-High
                    </div>

                    <div className="severeItems">
                      Includes reports of malfunctioning equipment, equipment breakdown, and instances requiring maintenance. These issues are critical and demand immediate attention.
                    </div>

                  </div>

                  <div className="severeItem">
                    <div className="severeImg">
                      <img src={yellowWarning} alt="" />
                    </div>
                    <div className="severeType">
                      Severity-Medium
                    </div>
                    <div className="severeItems">
                      Encompasses reports of missing equipment, damaged equipment, spoiled ingredients, and inadequate equipment. While not as urgent as high-severity incidents, they still require prompt resolution to prevent disruptions.
                    </div>
                  </div>
                  <div className="severeItem">
                    <div className="severeImg">
                      <img src={greenWarning} alt="" />
                    </div>
                    <div className="severeType">
                      Severity-Low
                    </div>
                    <div className="severeItems">
                      Designates other equipment-related issues that pose minimal risk or disruption. These may require attention but are not as critical as higher-severity incidents.
                    </div>
                  </div>
                </div>
              )}
            </div>
            {showModal ? <EquipRep /> : <></>}
            <div className="absoForm" onClick={() => { setModal(!showModal) }}>
              {showModal ? <>x</> : <div className='reds'>+</div>}
            </div>
          </>
        }


      </div>
    </div>
  )
}

export default Reports
