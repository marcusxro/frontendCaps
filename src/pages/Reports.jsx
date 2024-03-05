import React, { useEffect, useState } from 'react'
import Sidebar from '../comp/Sidebar'
import ReportsModal from '../comp/ReportsModal'
import axios from 'axios'
import moment from 'moment'
import { authentication } from '../authentication'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
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
        if(!acc.emailVerified) {
          nav('/login')
        }
      }
    })
    return () => { unsub() }
  }, [Uid])

  useEffect(() => {
    axios.get('http://localhost:8080/getReports')
      .then((resp) => {
        setRepData(resp.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [repData])

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
  const filteredFalse = repData.filter((item) => item.isResolved === false)
  const filteredTrue = repData.filter((item) => item.isResolved === true)


  const [naviTab, setNavi] = useState('notR')

  return (
    <div className='reportsParent'>
      <Sidebar />
      <div className="reportsCon">
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
            filteredFalse.map((item) => (
              <div className="reportItem" key={item._id}>
                  <div className="reportFirst">
                  <div className="reportTitle">
                  {item.Incident}
                </div>
                <div className="reportType">
                  Type: {item.RepType}
                </div>
                <div className="reportDate">
                  {moment(new Date(parseInt(item.Date, 10))).fromNow()}
                </div>
                <div className="reportStats">
                  {item.isResolved ? 'resolved' : ''}
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
            ))
          ) : (
            filteredTrue.map((item) => (
              <div className="reportItem" key={item._id}>
                <div className="reportTitle">
                  {item.Incident}
                </div>
                <div className="reportType">
                  Type: {item.RepType}
                </div>
                <div className="reportDate">
                  {moment(new Date(parseInt(item.Date, 10))).fromNow()}
                </div>
                <div className="reportStats">
                  {item.isResolved ? 'resolved' : ''}
                </div>
                <div className="reportDetails">
                  {item.RepDetails}
                </div>
              </div>
            ))
          )}
        </div>
        {showModal ? <ReportsModal /> : <></>}
        <div className="absoForm" onClick={() => { handleModal() }}>
        {showModal ? <>x</> : <div className='reds'>+</div>}
        </div>

      </div>
    </div>
  )
}

export default Reports
