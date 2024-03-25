import React, { useEffect, useState } from 'react';
import AddNewIng from '../comp/AddNewIng';
import axios from 'axios';
import moment from 'moment';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from '../authentication';

const Ingredients = ({ searchedItem }) => {
    const [data, setData] = useState([]);
    const [confirmId, setConfirmId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editedWeight, setWeight] = useState('');
    const [editedQuan, setQuan] = useState('');
    const [redo, setRedo] = useState('')
    const [Brand, setBrand] = useState('')
    const [ExpiryDate, setExpiryDate] = useState('')
    const [itemType, setItemType] = useState('')
    const [uid, setUid] = useState('')
    const [getPos, setGetPos] = useState('')
    const [loading, setLoading] = useState(false)
    const [fullName, setFullname] = useState('')


    useEffect(() => {
        const unsub = onAuthStateChanged(authentication, (acc) => {
            if (acc) {
                setUid(acc.uid)
            }
        })
        return () => { unsub() }
    }, [uid])

    useEffect(() => {
        setLoading(false)
        axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
            .then((response) => {
                const filteredData = response.data.filter((item) => item.Uid === uid);
                setGetPos(filteredData[0].Position)
                setFullname(filteredData[0].Firstname + " " + filteredData[0].Lastname)
                setLoading(true)
            })
            .catch((error) => {
                //
            });
    }, [data, getPos]);

    useEffect(() => {
        if (searchedItem) {
            setQuer(searchedItem)
        }
    }, [searchedItem])



    useEffect(() => {
        axios.get('https://backendcaps-7zrx.onrender.com/getIng')
            .then((info) => {
                setData(info.data);
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    }, [data]);

    const [quer, setQuer] = useState('');
    const [click, setClick] = useState(0);
    const [newItem, setNewItem] = useState(false);

    const viewModal = () => {
        setNewItem(!newItem);
        setClick(click + 1);
    };
    const [filtered, setFil] = useState([]);

    const handleDelete = (id) => {
        setConfirmId(id);
    };

    const handleConfirmDelete = (id) => {
        const newData = data.filter(item => item._id === id);
        setData(newData);
        setConfirmId(null);

        axios.post(`https://backendcaps-7zrx.onrender.com/DeletedIng`, {
            DeletedIngName: newData[0].IngName,
            DeletedWeight: newData[0].Weight,
            DeletedCategory: newData[0].Category,
            DeletedMeasure: newData[0].Measure,
            DeletedQuantity: newData[0].Quantity,
            DeletedEmail: newData[0].Email,
            DeletedDate: newData[0].Date,
            DeletedFullname: newData[0].Fullname,
            userNameDel: fullName
        }).then(() => {
            console.log("SENT")
            axios.delete(`https://backendcaps-7zrx.onrender.com/ingItem/${id}`)
                .then(() => {
                    console.log("deleted");
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }).catch((err) => {
            console.log(err)
        })
    };

    const handleEdit = (index, value, weight, quantity, brand, date) => {
        setEditIndex(index);
        setEditValue(value);
        setWeight(weight);
        setQuan(quantity);
        setExpiryDate(date)
        setBrand(brand)
    };

    const handleSaveEdit = async (e, productId) => {
        e.preventDefault()
        console.log(productId);
        try {
            e.preventDefault()
            await axios.put(`https://backendcaps-7zrx.onrender.com/editIng/${productId}`, {
                IngName: editValue,
                Weight: editedWeight,
                Quantity: editedQuan,
                Brand: Brand,
                Category: itemType,
                ExpiryDate: ExpiryDate,
                Date: Date.now()
            });
            console.log("edited");
            setEditIndex(null);
        } catch (error) {
            console.error("error editing item: ", error);
        }
    };
    const [showItem, setShowItem] = useState(false)
    
    useEffect(() => {
        const filteredItems = data.filter(item => item.IngName.toLowerCase().includes(quer.toLowerCase()));
        if (filteredItems.length > 0) {
            setRedo(filteredItems[0].IngName);
            setShowItem(false)
        } else {
            setRedo(null);
            setShowItem(true)
        }
        setFil(filteredItems);
    }, [quer, data]);



    return (
        <div className='ingredientsCon'>
            <div className="searchBar">
                <input
                    value={quer}
                    type="text"
                    placeholder={'🔍 find your item'}
                    onChange={(e) => {
                        setQuer(e.target.value);
                        setRedo(null);
                    }}
                />

                    <button onClick={viewModal}>{newItem ?
                        <span>Close modal <div className="openModal">
                            <ion-icon name="close-circle-outline"></ion-icon></div></span> :
                        <span>Add new item <div className="exitModal">
                            <ion-icon name="add-circle-outline"></ion-icon></div></span>}
                    </button>
                
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Ingredients name</th>
                        <th>Brand</th>
                        <th>Expiry date</th>
                        <th>Type</th>
                        <th>Weight</th>
                        <th>Quantity</th>
                        <th>Uploaded on</th>
                        <th>Added by</th>
                        {getPos === 'Manager' ? (<></>) : (
                            <th>Actions</th>
                        )}
                    </tr>
                </thead>
                {newItem ? <AddNewIng /> : null}
                <tbody>
                    {showItem == true ? "No items found!" : ""}
                    {filtered && filtered.slice().reverse().map((item, index) => (
                        <tr key={item._id}>
                            <td>{editIndex === index ? <input className='ingInput' value={editValue} onChange={(e) => setEditValue(e.target.value)} /> : item.IngName}</td>
                            <td>{editIndex === index ? <input className='ingInput' value={Brand} onChange={(e) => { setBrand(e.target.value) }} /> : item.Brand ? item.Brand : "N/A"}</td>

                            <td>{editIndex === index ? <input className='ingInput' type='Date' value={ExpiryDate} onChange={(e) => setExpiryDate(e.target.value)} /> : item.ExpiryDate ? item.ExpiryDate : "N/A"}</td>


                            <td>
                                {editIndex == index ? <select required value={itemType} onChange={(e) => { setItemType(e.target.value) }}>
                                    <option value="">Enter ingredient type</option>
                                    <option value="Fresh">Fresh</option>
                                    <option value="Frozen">Frozen</option>
                                    <option value="Dried">Dried</option>
                                    <option value="Powdered">Powdered</option>
                                    <option value="Sliced">Sliced</option>
                                </select> : item.Category}
                            </td>
                            <td>{editIndex === index ? <input className='ingInput' type='number' value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : item.Weight}</td>



                            <td>{editIndex === index ? <input className='ingInput' type='number' value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : item.Quantity}</td>
                            <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>
                            <td>{item.Fullname}</td>
                            {getPos === 'Manager' ? (<></>) : (
                                <td className='btnCon'>
                                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                                    {confirmId === item._id ? (
                                        <>
                                            <button className='confirmBtn' onClick={() => handleConfirmDelete(item._id)}>Confirm</button>
                                            <button className='cancelBtn' onClick={() => setConfirmId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            {editIndex === index ? <button onClick={(e) => handleSaveEdit(e, item._id)}>Save</button> : <button onClick={() => handleEdit(index, item.IngName, item.Weight, item.Quantity, item.Brand, item.ExpiryDate)}>Edit</button>}

                                        </>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Ingredients;
