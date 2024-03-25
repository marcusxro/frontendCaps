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

const Reports = () => {
  const [showModal, setModal] = useState(false)
  const [click, setClick] = useState(0)
  const [repData, setRepData] = useState([])
  const [Uid, setUid] = useState('')
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
    axios.get('http://localhost:8080/getReports')
      .then((resp) => {
        setRepData(resp.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [repData])

  const [IngData, setIngData] = useState([])

  useEffect(() => { // for ingredients
    axios.get('http://localhost:8080/getIngRep')
      .then((resp) => {
        setIngData(resp.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [IngData])


  const [EquipData, setEquipData] = useState([])

  useEffect(() => { // for equipment
    axios.get('http://localhost:8080/EquipReport')
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


  const sendEdited = (item) => {
    axios.put(`http://localhost:8080/reportEdit/${item}`, {
      isResolved: true,
      Uid: Uid,
      Date: Date.now()
    }).then(() => {
      console.log("Report resolved")
    }).catch((err) => {
      console.log(err)
    })
  }



  const sendEditedIng = (item) => {
    axios.put(`http://localhost:8080/IngReport/${item}`, {
      isResolved: true,
      Uid: Uid,
      Date: Date.now()
    }).then(() => {
      console.log("Report resolved")
    }).catch((err) => {
      console.log(err)
    })
  }


  const sendEditedEquip = (item) => {
    axios.put(`http://localhost:8080/EquipReport/${item}`, {
      isResolved: true,
      Uid: Uid,
      Date: Date.now()
    }).then(() => {
      console.log("Report resolved")
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

  return (
    <div className='reportsParent'>
      <Sidebar />
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
            </div>
            <div className="reportsChatCon">

              {naviTab === 'notR' ? (
                <>
                  <div className="isRes">
                    {filteredFalse.length === 0 && 'No reports at the moment'}
                  </div>
                  {filteredFalse.map((item) => (
                    <div className="reportItem" key={item._id}>
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
                        {indexItm === item._id ? (
                          <div className="reportStatsBtnConfirm">
                            <button className='repConfirm' onClick={() => { handleEdit(null); sendEdited(item._id) }}>Yes</button>
                            <button className='repCancel' onClick={() => handleEdit(null)}>No</button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </>

              ) : (
                <>
                  <div className="isRes">
                    {filteredTrue.length === 0 && 'No reports at the moment'}
                  </div>
                  {filteredTrue.map((item) => (
                    <div className="reportItem" key={item._id}>
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
                    </div>
                  ))}
                </>
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
            </div>

            <div className="reportsChatCon">

              {naviTab === 'notR' ? (
                <>
                  <div className="isRes">
                    {filteredFalseForIng.length === 0 && 'No reports at the moment'}
                  </div>
                  {filteredFalseForIng.map((item) => (
                    <div className="reportItem" key={item._id}>
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
                        {indexItm === item._id ? (
                          <div className="reportStatsBtnConfirm">
                            <button className='repConfirm' onClick={() => { handleEdit(null); sendEditedIng(item._id) }}>Yes</button>
                            <button className='repCancel' onClick={() => handleEdit(null)}>No</button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </>

              ) : (
                <>
                  <div className="isRes">
                    {filteredTrueForIng.length === 0 && 'No reports have been resolved at the moment'}
                  </div>
                  {filteredTrueForIng.map((item) => (
                    <div className="reportItem" key={item._id}>
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
                    </div>
                  ))}
                </>
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
            </div>

            <div className="reportsChatCon">

              {naviTab === 'notR' ? (
                <>
                  <div className="isRes">
                    {filteredFalseForEquip.length === 0 && 'No reports at the moment'}
                  </div>
                  {filteredFalseForEquip.map((item) => (
                    <div className="reportItem" key={item._id}>
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
                        {indexItm === item._id ? (
                          <div className="reportStatsBtnConfirm">
                            <button className='repConfirm' onClick={() => { handleEdit(null); sendEditedEquip(item._id) }}>Yes</button>
                            <button className='repCancel' onClick={() => handleEdit(null)}>No</button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </>

              ) : (
                <>
                  <div className="isRes">
                    {filteredTrueForEquuip.length === 0 && 'No reports have been resolved at the moment'}
                  </div>
                  {filteredTrueForEquuip.map((item) => (
                    <div className="reportItem" key={item._id}>
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
                    </div>
                  ))}
                </>
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
