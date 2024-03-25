import React, { useState, useEffect } from 'react'
import NewEquipment from '../comp/NewEquipment'
import { onAuthStateChanged } from 'firebase/auth'
import axios from 'axios'
import { authentication } from '../authentication'
import moment from 'moment'

const Equipment = () => {
    const [quer, setQuer] = useState('')
    const [pos, getPos] = useState('')
    const [newItem, setNewItem] = useState(false)


    const [uid, setUid] = useState('')
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
        axios.get('http://localhost:8080/accInfos')
            .then((response) => {
                const filteredData = response.data.filter((item) => item.Uid === uid);
                setFullname(filteredData[0].Firstname + " " + filteredData[0].Lastname)
                getPos(filteredData[0].Position)
            })
            .catch((error) => {
                //
            });
    }, [uid]);

    const [equipData, setEquipData] = useState([])

    useEffect(() => {
        setLoading(false)
        axios.get('http://localhost:8080/EquipGet')
            .then((response) => {
                setEquipData(response.data)
            })
            .catch((error) => {
                //
            });
    }, [equipData]);



    const [EquipName, setEquipName] = useState('');
    const [itemType, setType] = useState('');
    const [itemUsage, setUsage] = useState('');
    const [itemCondition, setCondition] = useState('');
    const [itemLocation, setLocation] = useState('');
    const [itemBrand, setBrand] = useState('');
    const [isEqual, setEqual] = useState(null)
    const [isDelete, setDelete] = useState('')

    const handleVal = (item) => {
        setEquipName(item.EquipmentName)
        setType(item.Type)
        setUsage(item.Usage)
        setLocation(item.Location)
        setBrand(item.Brand)
        setCondition(item.Condition)
    }

    const handleEdit = (itemId) => {
        axios.put(`http://localhost:8080/equipment/${itemId}`, {
            EquipmentName: EquipName,
            Type: itemType,
            Usage: itemUsage,
            Condition: itemCondition,
            Location: itemLocation,
            Brand: itemBrand,
            Date: Date.now(),
            Name: fullName,
        }).then(() => {
            console.log("details sent!")
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleConfirmDelete = (itemId) => {
        const newData = equipData.filter(item => item._id === itemId);
        axios.post(`http://localhost:8080/DeletedEquip`, {
            DeletedEquipmentName: newData[0].EquipmentName,
            DeletedType: newData[0].Type,
            DeletedUsage: newData[0].Usage,
            DeletedBrand: newData[0].Brand,
            DeletedCondition: newData[0].Condition,
            DeletedLocation: newData[0].Location,
            DeletedDate: Date.now(),
            DeletedFullname: newData[0].Name,
            CurrentUid: newData[0].Uid,
            userNameDel: fullName
        }).then(() => {
            console.log("details sent!")
            axios.delete(`http://localhost:8080/deleteEquipment/${itemId}`)
                .then(() => {
                    console.log("deleted")
                }).catch((err) => {
                    console.log(err)
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    const [fil, setFil] = useState([])
    useEffect(() => {
        const filteredItems = equipData.filter(item => item.EquipmentName.toLowerCase().includes(quer.toLowerCase()));
        setFil(filteredItems);
    }, [quer, equipData]);

    return (
        <div className='EquipmentCon'>
            <div className="searchBar">
                <input
                    value={quer}
                    type="text"
                    placeholder="🔍 find your item"
                    onChange={(e) => {
                        setQuer(e.target.value);
                    }}
                />
                {getPos === "Staff" ? (<></>) : (
                    <button onClick={() => { setNewItem(!newItem) }}>
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
            {newItem && <NewEquipment />}
            <div className="equipmentTable">
                <table>
                    <thead>
                        <tr>
                            <th>Equipment name</th>
                            <th>Type</th>
                            <th>Usage</th>
                            <th>Condition</th>
                            <th>Location</th>
                            <th>Brand</th>
                            <th>Uploaded on</th>
                            <th>Added by</th>
                            {pos === 'Manager' ? (
                                <></>
                            ) : (
                                <th>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {fil.slice().reverse().map((item) => (
                            <tr>
                                <td> {isEqual === item._id ?
                                    <input required type="text" placeholder='Enter equipment name' value={EquipName} onChange={(e) => { setEquipName(e.target.value) }} /> : item.EquipmentName}

                                </td>
                                <td>
                                    {isEqual === item._id ?
                                        <select required value={itemType} onChange={(e) => { setType(e.target.value) }}>
                                            <option value="">Choose equipment type</option>
                                            <option value="Cooking Equipment">Cooking Equipment</option>
                                            <option value="Refrigeration Equipment">Refrigeration Equipment</option>
                                            <option value="Food Preparation Equipment">Food Preparation Equipment</option>
                                            <option value="Storage Equipment">Storage Equipment</option>
                                            <option value="Cleaning Equipment">Cleaning Equipment</option>
                                            <option value="Serving Equipment">Serving Equipment</option>
                                            <option value="Safety  Equipment">Safety  Equipment</option>
                                        </select> : item.Type}
                                </td>
                                <td>
                                    {isEqual === item._id ?
                                        <select required value={itemUsage} onChange={(e) => { setUsage(e.target.value) }}>
                                            <option value="">Choose equipment usage</option>
                                            <option value="Daily use">Daily use</option>
                                            <option value="Weekly use">Weekly use</option>
                                            <option value="Occasional  use">Occasional  use</option>
                                        </select> : item.Usage}
                                </td>
                                <td>
                                    {isEqual === item._id ?
                                        <select required value={itemCondition} onChange={(e) => { setCondition(e.target.value) }}>
                                            <option value="">Choose equipment condition</option>
                                            <option value="New">New</option>
                                            <option value="Used">Used</option>
                                            <option value="Refurbished">Refurbished</option>
                                            <option value="Damaged">Damaged</option>
                                            <option value="Under Maintenance">Under Maintenance</option>
                                        </select> : item.Condition}
                                </td>
                                <td>
                                    {isEqual === item._id ?
                                        <select required value={itemLocation} onChange={(e) => { setLocation(e.target.value) }}>
                                            <option value="">Choose equipment location</option>
                                            <option value="Kitchen">Kitchen</option>
                                            <option value="Dining Area">Dining Area</option>
                                            <option value="Storage Room">Storage Room</option>
                                            <option value="Exterior ">Exterior </option>
                                        </select> : item.Location}
                                </td>
                                <td>
                                    {isEqual === item._id ?
                                        <input required type="text" placeholder='Enter equipment brand' value={itemBrand} onChange={(e) => { setBrand(e.target.value) }} /> : item.Brand}
                                </td>
                                <td>{moment(new Date(parseInt(item.Date, 10))).fromNow()}</td>
                                <td>{item.Name}</td>
                                {pos === 'Manager' ? (
                                    <></>
                                ) : (
                                    <td>
                                        {isEqual === item._id && isDelete !== item._id ? (
                                            <div className="buttonCon">
                                                <button className='save' onClick={() => { setEqual(null); setDelete(null); handleEdit(item._id) }}>Save</button>
                                                <button onClick={() => setEqual(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            isDelete === item._id ?
                                                null
                                                : <div className="buttonCon">
                                                    <button onClick={() => { setDelete(item._id) }}>Delete</button>
                                                    <button onClick={() => { setEqual(item._id); handleVal(item) }}>Edit</button>
                                                </div>

                                        )}


                                        {isDelete === item._id && isEqual !== item._id && (
                                            <div className="buttonCon">
                                                <button className='CDel' onClick={() => { handleConfirmDelete(item._id); setDelete(null) }}>Confirm</button>
                                                <button onClick={() => setDelete(null)}>Cancel</button>
                                            </div>
                                        )}

                                    </td>
                                )}


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Equipment
