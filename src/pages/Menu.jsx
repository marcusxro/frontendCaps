import React, { useState, useEffect } from 'react'
import Sidebar from '../comp/Sidebar'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { authentication } from '../authentication';
import { onAuthStateChanged } from 'firebase/auth';
import BestMenu from '../images/bestSeller.png'


const Menu = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [Uid, setUid] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    if(location.state) {
      setQuer(location.state.productName)
    }
  }, [location])



  useEffect(() => {
    const unbsub = onAuthStateChanged(authentication, (acc) => {
      if(acc) {
        setUid(acc.uid)
        if(!acc.emailVerified) {
          nav('/login')
        }
      }
    })
    return () => {unbsub()}
  }, [Uid])

  const handleTab = (tab) => {
    setActiveTab(tab);
  }
  const [nonFil, setNonFil] = useState([])
  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/menuDetails')
      .then((response) => {
        setNonFil(response.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [nonFil])
  const [handleEdit, setHandle] = useState('')
  const [editQuan, setEdit] = useState('')
  const [editedQuantity, setEditedQuan] = useState('')
  const [editedOver, setEditedOver] = useState('')
  const [Fullname, setFullname] = useState("")
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(false)
    axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.Uid === Uid);
        setFullname(filteredData[0].Firstname + " " + filteredData[0].Lastname)
        setLoading(true)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [Fullname, Uid]);
  const handleEditQuan = (itemId) => {
    axios.put(`https://backendcaps-7zrx.onrender.com/editProduct/${itemId}`, {
      Fullname: Fullname,
      OverQuan: editedOver,
      Quantity: editedQuantity,
      EditedUid: Uid,
      Date: Date.now() 
    }).then(() => {
        console.log("quantity edited")
    }).catch((err) => {
      console.log("error", err)
    })
  }
  const editQuantity = (item, Quantity, OverQuan) => {
    setHandle(item)
    setEditedQuan(Quantity)
    setEditedOver(OverQuan)
  }
const [quer, setQuer] = useState('')
const [filteredItem, setFil] = useState([])
const [showItem, setShow] = useState(false)
useEffect(() => {
  const filteredData = nonFil.filter(item => {
    if(typeof quer === 'string') {
        return item.ProductName.toLowerCase().includes(quer.toLowerCase())
    } else {
      return false
    }
  })
  setFil(filteredData);
  if(filteredData.length === 0) {
      setShow(true)
  }else {
    setShow(false)
  }
}, [filteredItem, quer]);

const [getPos, setGetPos] = useState('')
useEffect(() => {
  setLoading(false)
  axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
    .then((response) => {
      const filteredData = response.data.filter((item) => item.Uid === Uid);
      setGetPos(filteredData[0].Position)
      setLoading(true)
      console.log(getPos)
    })
    .catch((error) => {
      //
    });
}, [Fullname]);

  return (
    <div className='menuInt'>
      <Sidebar activeTab={activeTab} handleTab={handleTab} />
      <div className="menuParent">

        <div className="menuDetails">
         <div className="datailsOne">
         <div className="menuDetailsOne">
            Menu
          </div>
          <div className="menuDetailsTwo">
            This is where we check the availability of a particular product and edit it!
          </div>
         </div>
         <div className="menuTwo">
          <input type="text" 
          value={quer}
          placeholder='🔍what you want to find?'
           onChange={(e) => {setQuer(e.target.value)}} />
         </div>
        </div>

      <div className="menuCont">
        {showItem === true ? "No items found!" : ""}
        {loading ? (
           filteredItem.map((item) => (
            <div className="menuItem" key={item.id}>
              <div className="menutitle">
                {item.ProductName}
              </div>
              {item.Quantity / item.OverQuan * 100 >= 95 &&
              <div className="best">
                <img src={BestMenu} alt="" />
              </div>
              }
              <div className="availability">
                {handleEdit === item._id ? <input type='number'
                 value={editedQuantity} 
                  onChange={(e) => { setEditedQuan(e.target.value) }} /> : <div className="firstQuan">
                  {item.Quantity}
                </div>}
                <div className="sl">
                  /
                </div>
                {handleEdit === item._id ? <input type='number' 
                value={editedOver}
                onChange={(e) => { setEditedOver(e.target.value ) }} /> : <div className="secondQuan">
                  {item.OverQuan}
                </div>}
              </div>
              <div className="menuDate">
                {moment(new Date(parseInt(item.Date, 10))).fromNow()}
              </div>
              <div className="inPerc">
                <div className="firstQuan">
                  {(item.Quantity / item.OverQuan * 100).toFixed(2) + "% " + "/ " + "100%"}
                </div>
                <div className="warning">
                  {
                parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 100 ?
                <div className='warningMenu' style={{ color: 'red' }}>Stock Count Exceeds Capacity (Please Update)</div> :
                parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 90 ?
                  <div className='warningMenu' style={{ color: 'orange' }}>Stock Running Dangerously Low (Please Update)</div> :
                  parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 80 ?
                    <div className='warningMenu' style={{ color: 'yellow' }}>Stock Level Low (Update Required)</div> :
                    parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 60 ?
                      <div className='warningMenu' style={{ color: 'green' }}>Consider Updating Stock</div> :
                      (parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 30 ?
                        <div className='warningMenu' style={{ color: 'blue' }}>Adequate Stock</div> :
                        (parseInt((item.Quantity / item.OverQuan * 100).toFixed(2)) > 0.000 ?
                          <div className='warningMenu' style={{ color: 'purple' }}>Stock in Abundance</div> :
                          null
              
                 
                            )
                       )
                  }
  
                </div>
              </div>
              {getPos === "Manager" ? (<button>you have no access</button>) : (
                handleEdit === item._id ? (<button onClick={() => { editQuantity(null); handleEditQuan(item._id) }}>save</button>) :
                (<button onClick={() => { setEdit(true); editQuantity(item._id,  item.Quantity, item.OverQuan)}}>edit</button>)
              )}
            </div>
          ))
        ) : (<div className='loadingMenu'>loading..</div>)}
      </div>
      </div>
    </div>
  )
}

export default Menu
