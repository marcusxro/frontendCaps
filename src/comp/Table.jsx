import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import NewItem from './NewItem';
import { authentication } from '../authentication';
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatusModal from './StatusModal';

const Table = ({ searchedItem }) => {
  const [data, setData] = useState([]);
  const [confirmIndex, setConfirmIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editedWeight, setWeight] = useState('');
  const [editedQuan, setQuan] = useState('');
  const [filtedItem, setFil] = useState(null);
  const [quer, setQuer] = useState('');
  const [newItem, setNewItem] = useState(false);
  const [setsearch, setSearchedItem] = useState()
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState('')
  const [getPos, setGetPos] = useState('')
  const location = useLocation()
  const [editedExpiry, setExpiry] = useState('')
  const [editedCondition, setCondition] = useState('')
  useEffect(() => {
    if (location) {
      console.log(location);
    }
  }, [location])
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
  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/menuDetails')
      .then((res) => {
        setData(res.data);
      }).catch((err) => {
        console.log(err);
      });
  }, [data]);

  useEffect(() => {
    const unsub = onAuthStateChanged(authentication, (acc) => {
      if (acc) {
        setUid(acc.uid)
        setLoading(true)
      }
    })
    return () => { unsub() }
  }, [uid])



  const [userName, setUsername] = useState('')
  useEffect(() => {
    setLoading(false)
    axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.Uid === uid);
        setGetPos(filteredData[0].Position)
        setUsername(filteredData[0].Firstname + " " + filteredData[0].Lastname)
        setLoading(true)
      })
      .catch((error) => {
        //
      });
  }, [data, getPos]);



  useEffect(() => {
    if (location.state) {
      setQuer(location.state.productName);
    }
  }, [location]);

  const handleDelete = (index) => {
    setConfirmIndex(index);
  };

  const handleConfirmDelete = (id) => {
    const newData = data.filter(item => item._id !== id);
    setData(newData);

    setConfirmIndex(null);
    const newDatas = data.filter(item => item._id === id);


    console.log(uid)
    axios.post(`https://backendcaps-7zrx.onrender.com/DeletedInv`, {
      DeletedProductName: newDatas[0].ProductName,
      DeletedCategory: newDatas[0].Category,
      DeletedWeight: newDatas[0].Weight,
      DeletedQuantity: newDatas[0].Quantity,
      DeletedOverQuan: newDatas[0].OverQuan,
      DeletedExpiryDate: newDatas[0].ExpiryDate,
      DeletedCondition: newDatas[0].Condition,
      DeletedEmail: newDatas[0].Email,
      DeletedFullname: newDatas[0].Fullname,
      DeletedDate: Date.now(),
      DeletedUid: newDatas[0].Uid,
      CurrentUid: uid,
      userNameDel: userName
    }).then(() => {
      console.log("SENT DELTED DATA")
      axios.delete(`https://backendcaps-7zrx.onrender.com/item/${id}`)
        .then(() => {
          console.log("deleted");
          notif(`${newDatas[0].ProductName} has been deleted successfully! `)
        }).catch((err) => {
          console.log("error", err);
        });
    }).catch((err) => {
      console.log("error", err)
    });
  };

  const handleEdit = (index, value, weight, quantity, Condition, Expiry) => {
    setEditIndex(index);
    setEditValue(value);
    setWeight(weight);
    setQuan(quantity);
    setCondition(Condition)
    setExpiry(Expiry)
  };



  //  useEffect(() => {
  //      const expiredItems = data.filter((item) => {
  //        return new Date(item.ExpiryDate).getTime() <= Date.now();
  //      });

  //      if (expiredItems.length > 0) {
  //        expiredItems.forEach((item) => {
  //          axios.put(`https:backendcaps-7zrx.onrender.com/editInventory/${item._id}`, {
  //            Condition: "Expired",
  //          }).catch((err) => {
  //            console.log("error", err);
  //          });
  //        });
  //      }
  //    }, [data]);

  const handleSaveEdit = async (productId) => {
    console.log("handleSaveEdit called with productId:", productId);

    if (!productId || !editedCondition) {
      console.log("Invalid productId or editedCondition");
      return;
    }

    try {
      const editedExpiryTime = new Date(editedExpiry).getTime();
      console.log("editedExpiryTime:", editedExpiryTime);

      if (editedExpiryTime < Date.now() && editedCondition !== "Expired") {
        const confirmed = window.confirm("Are you sure you want to change the condition and set the expiration date to the current date?");
        if (!confirmed) {
          console.log("User cancelled the operation");
          return;
        }
      }

      if (editedExpiryTime > Date.now() && editedCondition === "Expired") {
        alert("The condition cannot be set to 'Expired' for a future expiry date.");
        return;
      }

      const payload = {
        ProductName: editValue,
        Weight: editedWeight,
        Quantity: editedQuan,
        Condition: editedCondition,
        ExpiryDate: editedExpiry,
        EditedUid: userName,
        Date: Date.now()
      };

      console.log("Sending payload:", payload);

      await axios.put(`https://backendcaps-7zrx.onrender.com/editInventory/${productId}`, payload);

      console.log("edited");
      notif(`${editValue} has been edited successfully!`);
      setEditIndex(null);

    } catch (error) {
      console.error("error editing item: ", error);
    }
  };




  const [click, setClick] = useState(0);
  const viewModal = () => {
    setNewItem(true)
    setClick(click + 1)
    if (click === 1) {
      setNewItem(false)
      setClick(0)
    }
  };
  const [showItem, setShow] = useState(false)

  useEffect(() => {
    const filteredData = data.filter(item => {
      if (typeof quer === 'string') {
        return item.ProductName.toLowerCase().includes(quer.toLowerCase());
      } else {
        return false; // or any other appropriate handling for non-string values
      }
    });
    setFil(filteredData);
    if (filteredData.length === 0) {
      setShow(true);
    } else {
      setShow(false);
    }
    setLoading(true);
  }, [quer, data, showItem, location]);


  const bgOfCondition = (Condition, exDate) => {
    const editedExpiryTime = new Date(exDate).getTime();
    const currentTime = Date.now();

    if (editedExpiryTime <= currentTime) {
      return 'ExpiredItemOfInventory';
    }

    switch (Condition) {
      case "Expired":
        return 'ExpiredItemOfInventory';
      case "Damaged":
        return 'DamagedItemOfInventory';
      case "Spoiled":
        return 'SpoiledItemOfInventory';
      default:
        return '';
    }
  }

  const [showInfo, setShowInf] = useState(false)

  return (
    <div className="tableCon">
      <ToastContainer />
        {showInfo && <StatusModal setShowInf={setShowInf} />}
      {loading ? (
        <div className="searchBar">

          <div className="info" onClick={() => { setShowInf(prevClick => !prevClick) }} >
            <ion-icon name="information-circle-outline"></ion-icon>
          </div>
          <input
            value={quer}
            type="text"
            placeholder="🔍 find your item"
            onChange={(e) => {
              setQuer(e.target.value);
              setSearchedItem(null);
            }}
          />
          {getPos === "Staff" ? (<></>) : (
            <button onClick={viewModal}>
              {newItem ? (
                <span>
                  Close modal <div className="openModal">
                    <ion-icon name="close-circle-outline"></ion-icon>
                  </div>
                </span>
              ) : (
                <span>
                  Add new item <div className="exitModal">
                    <ion-icon name="add-circle-outline"></ion-icon>
                  </div>
                </span>
              )}
            </button>
          )}

        </div>
      ) : (
        <>loading...</>
      )}

      {loading ? (
        <>
          {newItem && <NewItem />}
          <table className='parentTable'>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Uploaded on</th>
                <th>Condition</th>
                <th>Expiry Date</th>
                <th>Added by</th>
                {getPos === "Manager" ? null : <th>Action</th>}
              </tr>
            </thead>
            <tbody className='tableBody'>
              {showItem == true ? "No items found!" : ""}
              {filtedItem ? (
                filtedItem.slice().reverse().map((item) => (
                  <tr className={`productList ${bgOfCondition(item.Condition, item.ExpiryDate)}`} key={item._id}>
                    <td>{editIndex === item._id ?
                      <input required value={editValue} onChange={(e) => setEditValue(e.target.value)} /> : item.ProductName}</td>
                    <td>{item.Category}</td>
                    <td>{editIndex === item._id ?
                      <input required type='number' value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : item.Weight}</td>
                    <td>{editIndex === item._id ?
                      <input required type='number' value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : item.Quantity}</td>
                    <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>

                    <td>{editIndex === item._id ?
                      <select onChange={(e) => {
                        console.log("Selected condition:", e.target.value);
                        setCondition(e.target.value);
                      }} value={editedCondition || item.Condition || ""}>

                        <option value="Frozen">Frozen</option>
                        <option value="Fresh">Fresh</option>
                        <option value="Expired">Expired</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Spoiled">Spoiled</option>
                        <option value="Prepared">Prepared</option>
                      </select>

                      : item.Condition ? item.Condition : "N/A"}</td>
                    <td>{editIndex === item._id ?
                      <input type='Date' required value={editedExpiry} onChange={(e) => setExpiry(e.target.value)} /> : item.ExpiryDate ?
                        (new Date(item.ExpiryDate).getTime() <= Date.now() ? "Expiry Date met" : item.ExpiryDate)
                        : "N/A"}</td>
                    <td>{item.Fullname}</td>
                    {getPos === "Manager" ? null : (
                      <td className='btnCon'>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                        {confirmIndex === item._id ? (
                          <>
                            <button className='confirmBtn' onClick={() => { handleConfirmDelete(item._id) }}>Confirm</button>
                            <button className='cancelBtn' onClick={() => setConfirmIndex(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            {editIndex === item._id ? (
                              <>
                                {editedExpiry === new Date().getTime() ?
                                  <button></button> : <button onClick={() => handleSaveEdit(item._id)}>Save</button>
                                }
                                <button onClick={() => handleEdit(null)}>Cancel</button>
                              </>
                            ) : <button onClick={() => handleEdit(item._id, item.ProductName, item.Weight, item.Quantity, item.Condition, item.ExpiryDate)}>Edit</button>}

                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                data.map((product, index) => (
                  <tr key={product._id}>
                    <td>{editIndex === index ? <input required value={editValue} onChange={(e) => setEditValue(e.target.value)} /> : product.ProductName}</td>
                    <td>{product.Category}</td>
                    <td>{editIndex === index ? <input required value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : product.Weight}</td>
                    <td>{editIndex === index ? <input required value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : product.Quantity}</td>
                    <td>{moment(new Date(parseInt(product.Date, 10))).fromNow()}</td>
                    <td className='btnCon'>
                      {confirmIndex === index ? (
                        <>
                          <button className='confirmBtn' onClick={() => { handleConfirmDelete(product._id) }}>Confirm</button>
                          <button className='cancelBtn' onClick={() => setConfirmIndex(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          {editIndex === index ? <button onClick={() => handleSaveEdit(product._id)}>Save</button> : <button onClick={() => handleEdit(product._id, product.ProductName, product.Weight, product.Quantity)}>Edit</button>}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      ) : (
        <>loading....</>
      )}
    </div>
  );
};

export default Table;
