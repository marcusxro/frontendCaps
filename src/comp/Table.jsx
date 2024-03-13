import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import NewItem from './NewItem';
import { authentication } from '../authentication';
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation } from 'react-router-dom';

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

  useEffect(() => {
    if (location) {
      console.log(location);
    }
  }, [location])

  useEffect(() => {
    axios.get('http://localhost:8080/menuDetails')
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
  
  useEffect(() => {
    setLoading(false)
    axios.get('http://localhost:8080/accInfos')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.Uid === uid);
        setGetPos(filteredData[0].Position)
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
    axios.delete(`http://localhost:8080/item/${id}`)
      .then(() => {
        console.log("deleted");
      }).catch((err) => {
        console.log("error", err);
      });
  };

  const handleEdit = (index, value, weight, quantity) => {
    setEditIndex(index);
    setEditValue(value);
    setWeight(weight);
    setQuan(quantity);
  };

  const handleSaveEdit = async (productId) => {

    console.log(productId);
    try {
      await axios.put(`http://localhost:8080/editInventory/${productId}`, {
        ProductName: editValue,
        Weight: editedWeight,
        Quantity: editedQuan,
        Date: Date.now()
      }).then(() => {
        console.log("edited")
      }).catch((err) => {
        console.log("error", err)
      });

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
  

  return (
    <div className="tableCon">
      {loading ? (
        <div className="searchBar">
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
                <th>Category</th>
                <th>Weight</th>
                <th>Quantity</th>
                <th>time</th>
                <th>Written by</th>
                {getPos === "Staff" ? null : <th>Action</th>}
              </tr>
            </thead>
            <tbody className='tableBody'>
            {showItem == true ? "No items found!" : ""}
              {filtedItem ? (
                filtedItem.map((item) => (
                  <tr className='productList' key={item._id}>
                    <td>{editIndex === item._id ?
                      <input value={editValue} onChange={(e) => setEditValue(e.target.value)} /> : item.ProductName}</td>
                    <td>{item.Category}</td>
                    <td>{editIndex === item._id ?
                      <input type='number' required value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : item.Weight}</td>
                    <td>{editIndex === item._id ?
                      <input type='number' required value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : item.Quantity}</td>
                    <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>
                    <td>{item.Fullname}</td>
                    {getPos === "Staff" ? null : (
                      <td className='btnCon'>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                        {confirmIndex === item._id ? (
                          <>
                            <button className='confirmBtn' onClick={() => { handleConfirmDelete(item._id) }}>Confirm</button>
                            <button className='cancelBtn' onClick={() => setConfirmIndex(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            {editIndex === item._id ? <button onClick={() => handleSaveEdit(item._id)}>Save</button> : <button onClick={() => handleEdit(item._id, item.ProductName, item.Weight, item.Quantity)}>Edit</button>}
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                data.map((product, index) => (
                  <tr key={product._id}>
                    <td>{editIndex === index ? <input value={editValue} onChange={(e) => setEditValue(e.target.value)} /> : product.ProductName}</td>
                    <td>{product.Category}</td>
                    <td>{editIndex === index ? <input value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : product.Weight}</td>
                    <td>{editIndex === index ? <input value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : product.Quantity}</td>
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
