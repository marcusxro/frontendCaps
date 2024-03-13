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


    useEffect(() => {
        if (searchedItem) {
            setQuer(searchedItem)
        }
    }, [searchedItem])



    useEffect(() => {
        axios.get('http://localhost:8080/getIng')
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
        const newData = data.filter(item => item._id !== id);
        setData(newData);
        setConfirmId(null);
        axios.delete(`http://localhost:8080/ingItem/${id}`)
            .then(() => {
                console.log("deleted");
            })
            .catch((err) => {
                console.log("error", err);
            });
    };

    const handleEdit = (index, value, weight, quantity) => {
        setEditIndex(index);
        setEditValue(value);
        setWeight(weight);
        setQuan(quantity);
    };

    const handleSaveEdit = async (e, productId) => {
        e.preventDefault()
        console.log(productId);
        try {
            e.preventDefault()
            await axios.put(`http://localhost:8080/editIng/${productId}`, {
                IngName: editValue,
                Weight: editedWeight,
                Quantity: editedQuan,
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

    const [uid, setUid] = useState('')
    const [getPos, setGetPos] = useState('')
    const [loading, setLoading] = useState(false)


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
                {getPos === 'Staff' ? (<></>) : (
                    <button onClick={viewModal}>{newItem ?
                        <span>Close modal <div className="openModal">
                            <ion-icon name="close-circle-outline"></ion-icon></div></span> :
                        <span>Add new item <div className="exitModal">
                            <ion-icon name="add-circle-outline"></ion-icon></div></span>}
                    </button>)
                }
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Ingredients name</th>
                        <th>Category</th>
                        <th>Weight</th>
                        <th>Quantity</th>
                        <th>Time</th>
                        <th>Written by</th>
                        {getPos === 'Staff' ? (<></>) : (
                        <th>Actions</th>
                        )}
                    </tr>
                </thead>
                {newItem ? <AddNewIng /> : null}
                <tbody>
                    {showItem == true ? "No items found!" : ""}
                    {filtered && filtered.map((item, index) => (
                        <tr key={item._id}>
                            <td>{editIndex === index ? <input className='ingInput' value={editValue} onChange={(e) => setEditValue(e.target.value)} /> : item.IngName}</td>
                            <td>{item.Category}</td>
                            <td>{editIndex === index ? <input className='ingInput' type='number' value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : item.Weight}</td>
                            <td>{editIndex === index ? <input className='ingInput' type='number' value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : item.Quantity}</td>
                            <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>
                            <td>{item.Fullname}</td>
                            {getPos === 'Staff' ? (<></>) : (
                            <td className='btnCon'>
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                                {confirmId === item._id ? (
                                    <>
                                        <button className='confirmBtn' onClick={() => handleConfirmDelete(item._id)}>Confirm</button>
                                        <button className='cancelBtn' onClick={() => setConfirmId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        {editIndex === index ? <button onClick={(e) => handleSaveEdit(e, item._id)}>Save</button> : <button onClick={() => handleEdit(index, item.IngName, item.Weight, item.Quantity)}>Edit</button>}

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
