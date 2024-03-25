import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { authentication } from '../authentication';
import { onAuthStateChanged } from 'firebase/auth';

const Categories = () => {
    const [data, setData] = useState([])
    const [confirmIndex, setConfirmIndex] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editedWeight, setWeight] = useState('')
    const [editedQuan, setQuan] = useState('')
    const [loading, setLoading] = useState(false)
    const [editedExpiry, setExpiry] = useState('')
    const [editedCondition, setCondition] = useState('')


    useEffect(() => {
        axios.get('http://localhost:8080/menuDetails')
            .then((res) => {
                setData(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }, [data]);

    const NachosData = data.filter((item) => item.Category === "Nachos");
    const snacksData = data.filter((item) => item.Category === "Snacks");
    const CrofflesData = data.filter((item) => item.Category === "Croffles");
    const BurgerData = data.filter((item) => item.Category === "Burger");

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
        setWeight(weight)
        setQuan(quantity)
    };

    const handleSaveEdit = async (productId) => {
        console.log(productId)
        try {
            await axios.put(`http://localhost:8080/editInventory/${productId}`, {
                ProductName: editValue,
                Weight: editedWeight,
                Quantity: editedQuan,
                Condition: editedCondition,
                ExpiryDate: editedExpiry,
                Date: Date.now()
            }).then(() => {
                console.log("edited")
            }).catch((err) => {
                console.log("error", err)
            })

            setEditIndex(null);
        } catch (error) {
            console.error("error editing item: ", error);
        }
    };
    const [uid, setUid] = useState('')
    const [getPos, setGetPos] = useState('')
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
        <div className="caterCon">
            <Swiper>
                <SwiperSlide>
                    <table className='drinksCon'>
                        <thead className='drinkTitles'>
                            <tr>
                                <th>Product Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Uploaded on</th>
                                <th>Condition</th>
                                <th>Expiry Date</th>
                                <th>Added by</th>
                                {getPos === "Manager" ? (<></>) : (<th>Actions</th>)}
                            </tr>
                        </thead>
                        <tbody className='drinksBody'>
                            {NachosData.map((item) => (
                                <tr className='tdForDrink' key={item._id}>
                                    <td>{editIndex === item._id ?
                                        <input value={editValue} className='ingInput' onChange={(e) => setEditValue(e.target.value)} /> : item.ProductName}</td>
                                    <td>{item.Category}</td>
                                    <td>{editIndex === item._id ?
                                        <input type='number' className='ingInput' required value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : item.Weight}</td>
                                    <td>{editIndex === item._id ?
                                        <input type='number' className='ingInput' required value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : item.Quantity}</td>
                                    <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>
                                    <td>{editIndex === item._id ?
                                        <select onChange={(e) => { setCondition(e.target.value) }} value={editedCondition}>
                                            <option value="">Enter product condition</option>
                                            <option value="Fresh">Fresh</option>
                                            <option value="Frozen">Frozen</option>
                                            <option value="Expired">Expired</option>
                                            <option value="Damaged">Damaged</option>
                                            <option value="Spoiled">Spoiled</option>
                                            <option value="Prepared">Prepared</option>
                                        </select>

                                        : item.Condition ? item.Condition : "N/A"}</td>

                                    <td>{editIndex === item._id ?
                                        <input type='Date' required value={editedExpiry} onChange={(e) => setExpiry(e.target.value)} /> : item.ExpiryDate ? item.ExpiryDate : "N/A"}</td>
                                    <td>{item.Fullname}</td>
                                    {getPos === "Manager" ? (<></>) : (
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
                            ))}
                        </tbody>
                    </table>
                </SwiperSlide>
                <SwiperSlide>
                    <table className='drinksCon'>
                        <thead className='drinkTitles'>
                            <tr>
                                <th>Product Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Uploaded on</th>
                                <th>Condition</th>
                                <th>Expiry Date</th>
                                <th>Added by</th>
                                {getPos === "Manager" ? (<></>) : (<th>Actions</th>)}
                            </tr>
                        </thead>
                        <tbody className='drinksBody'>
                            {snacksData.map((item) => (
                                <tr className='tdForDrink' key={item._id}>
                                    <td>{editIndex === item._id ?
                                        <input value={editValue} className='ingInput' onChange={(e) => setEditValue(e.target.value)} /> : item.ProductName}</td>
                                    <td>{item.Category}</td>
                                    <td>{editIndex === item._id ?
                                        <input type='number' className='ingInput' required value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : item.Weight}</td>
                                    <td>{editIndex === item._id ?
                                        <input type='number' className='ingInput' required value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : item.Quantity}</td>
                                    <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>
                                    <td>{editIndex === item._id ?
                                        <select onChange={(e) => { setCondition(e.target.value) }} value={editedCondition}>
                                            <option value="">Enter product condition</option>
                                            <option value="Fresh">Fresh</option>
                                            <option value="Frozen">Frozen</option>
                                            <option value="Expired">Expired</option>
                                            <option value="Damaged">Damaged</option>
                                            <option value="Spoiled">Spoiled</option>
                                            <option value="Prepared">Prepared</option>
                                        </select>

                                        : item.Condition ? item.Condition : "N/A"}</td>

                                    <td>{editIndex === item._id ?
                                        <input type='Date' required value={editedExpiry} onChange={(e) => setExpiry(e.target.value)} /> : item.ExpiryDate ? item.ExpiryDate : "N/A"}</td>
                                    <td>{item.Fullname}</td>
                                    {getPos === "Manager" ? (<></>) : (
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
                            ))}
                        </tbody>
                    </table>
                </SwiperSlide>
                <SwiperSlide>
                    <table className='drinksCon'>
                        <thead className='drinkTitles'>
                            <tr>
                            <th>Product Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Uploaded on</th>
                                <th>Condition</th>
                                <th>Expiry Date</th>
                                <th>Added by</th>
                                {getPos === "Manager" ? (<></>) : (<th>Actions</th>)}
                            </tr>
                        </thead>
                        <tbody className='drinksBody'>
                            {CrofflesData.map((item) => (
                                <tr className='tdForDrink' key={item._id}>
                                    <td>{editIndex === item._id ?
                                        <input value={editValue} className='ingInput' onChange={(e) => setEditValue(e.target.value)} /> : item.ProductName}</td>
                                    <td>{item.Category}</td>
                                    <td>{editIndex === item._id ?
                                        <input type='number' className='ingInput' required value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : item.Weight}</td>
                                    <td>{editIndex === item._id ?
                                        <input type='number' className='ingInput' required value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : item.Quantity}</td>
                                    <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>
                                    <td>{editIndex === item._id ?
                                        <select onChange={(e) => { setCondition(e.target.value) }} value={editedCondition}>
                                            <option value="">Enter product condition</option>
                                            <option value="Fresh">Fresh</option>
                                            <option value="Frozen">Frozen</option>
                                            <option value="Expired">Expired</option>
                                            <option value="Damaged">Damaged</option>
                                            <option value="Spoiled">Spoiled</option>
                                            <option value="Prepared">Prepared</option>
                                        </select>

                                        : item.Condition ? item.Condition : "N/A"}</td>

                                    <td>{editIndex === item._id ?
                                        <input type='Date' required value={editedExpiry} onChange={(e) => setExpiry(e.target.value)} /> : item.ExpiryDate ? item.ExpiryDate : "N/A"}</td>
                                    <td>{item.Fullname}</td>
                                    {getPos === "Manager" ? (<></>) : (
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
                            ))}
                        </tbody>
                    </table>
                </SwiperSlide>
                <SwiperSlide>
                    <table className='drinksCon'>
                        <thead className='drinkTitles'>
                            <tr>
                            <th>Product Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Uploaded on</th>
                                <th>Condition</th>
                                <th>Expiry Date</th>
                                <th>Added by</th>
                                {getPos === "Manager" ? (<></>) : (<th>Actions</th>)}
                            </tr>
                        </thead>
                        <tbody className='drinksBody'>
                            {BurgerData.map((item) => (
                                <tr className='tdForDrink' key={item._id}>
                                    <td>{editIndex === item._id ?
                                        <input value={editValue} className='ingInput' onChange={(e) => setEditValue(e.target.value)} /> : item.ProductName}</td>
                                    <td>{item.Category}</td>
                                    <td>{editIndex === item._id ?
                                        <input type='number' className='ingInput' required value={editedWeight} onChange={(e) => setWeight(e.target.value)} /> : item.Weight}</td>
                                    <td>{editIndex === item._id ?
                                        <input type='number' className='ingInput' required value={editedQuan} onChange={(e) => setQuan(e.target.value)} /> : item.Quantity}</td>
                                    <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>
                                    <td>{editIndex === item._id ?
                                        <select onChange={(e) => { setCondition(e.target.value) }} value={editedCondition}>
                                            <option value="">Enter product condition</option>
                                            <option value="Fresh">Fresh</option>
                                            <option value="Frozen">Frozen</option>
                                            <option value="Expired">Expired</option>
                                            <option value="Damaged">Damaged</option>
                                            <option value="Spoiled">Spoiled</option>
                                            <option value="Prepared">Prepared</option>
                                        </select>

                                        : item.Condition ? item.Condition : "N/A"}</td>

                                    <td>{editIndex === item._id ?
                                        <input type='Date' required value={editedExpiry} onChange={(e) => setExpiry(e.target.value)} /> : item.ExpiryDate ? item.ExpiryDate : "N/A"}</td>
                                    <td>{item.Fullname}</td>
                                    {getPos === "Manager" ? (<></>) : (
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
                            ))}
                        </tbody>
                    </table>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Categories
