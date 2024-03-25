import React, { useState, useEffect, useRef } from "react"
import { authentication } from "../authentication";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import gsap from "gsap";

const NewEquipment = () => {
    const [EquipName, setEquipName] = useState('');
    const [itemType, setType] = useState('');
    const [itemUsage, setUsage] = useState('');
    const [itemCondition, setCondition] = useState('');
    const [itemLocation, setLocation] = useState('');
    const [itemBrand, setBrand] = useState('');
    const [uid, setUid] = useState('')
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
        axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
            .then((response) => {
                const filteredData = response.data.filter((item) => item.Uid === uid);
                setFullname(filteredData[0].Firstname + " " + filteredData[0].Lastname)
                console.log(fullName)
            })
            .catch((error) => {
                //
            });
    }, [fullName, uid]);
    const removeValue = () => {
        setEquipName('')
        setType('')
        setUsage('')
        setCondition('')
        setLocation('')
        setBrand('')
    }
    const sendData = () => {
        if (!EquipName ||
            !itemType ||
            !itemUsage ||
            !itemCondition
            || !itemLocation
            || !itemBrand) {
            return alert("please fill up the details")
        }
        axios.post('https://backendcaps-7zrx.onrender.com/PostEquipement', {
            EquipmentName: EquipName,
            Type: itemType,
            Usage: itemUsage,
            Condition: itemCondition,
            Location: itemLocation,
            Uid: uid,
            Brand: itemBrand,
            Date: Date.now(),
            Name: fullName,
        }).then(() => {
            removeValue()
            console.log("details sent!")
        }).catch((err) => {
            console.log(err)
        })
    }
    const [data, setData] = useState([])
    const [nameEqual, setNameEq] = useState(null)
    const pNameEl = useRef(null)
    useEffect(() => {
        axios.get('https://backendcaps-7zrx.onrender.com/EquipGet')
            .then((res) => {
                setData(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }, [data]);
    useEffect(() => {
        const filtered = data.find((item) => item.EquipmentName.toLowerCase() === EquipName.toLowerCase());
        if (filtered) {
            setNameEq(filtered)
            gsap.to(pNameEl.current, {
                border: "2px solid red",
                duration: 0
            })
        } else {
            setNameEq(null)
            gsap.to(pNameEl.current, {
                border: "0px"
            })

        }
    }, [data, EquipName])


    return (
        <div className='newEquipmentCon'>
            <div className="newEquipmentText">
                Add new equipment
            </div>
            <input ref={pNameEl} required type="text" placeholder='Enter equipment name' value={EquipName} onChange={(e) => { setEquipName(e.target.value) }} />

            <select required value={itemType} onChange={(e) => { setType(e.target.value) }}>
                <option value="">Choose equipment type</option>
                <option value="Cooking Equipment">Cooking Equipment</option>
                <option value="Refrigeration Equipment">Refrigeration Equipment</option>
                <option value="Food Preparation Equipment">Food Preparation Equipment</option>
                <option value="Storage Equipment">Storage Equipment</option>
                <option value="Cleaning Equipment">Cleaning Equipment</option>
                <option value="Serving Equipment">Serving Equipment</option>
                <option value="Safety  Equipment">Safety  Equipment</option>
            </select>

            <select required value={itemUsage} onChange={(e) => { setUsage(e.target.value) }}>
                <option value="">Choose equipment usage</option>
                <option value="Daily use">Daily use</option>
                <option value="Weekly use">Weekly use</option>
                <option value="Occasional  use">Occasional  use</option>
            </select>

            <select required value={itemCondition} onChange={(e) => { setCondition(e.target.value) }}>
                <option value="">Choose equipment condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Damaged">Damaged</option>
                <option value="Under Maintenance">Under Maintenance</option>
            </select>
            <select required value={itemLocation} onChange={(e) => { setLocation(e.target.value) }}>
                <option value="">Choose equipment location</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Dining Area">Dining Area</option>
                <option value="Storage Room">Storage Room</option>
                <option value="Exterior ">Exterior </option>
            </select>
            <input required type="text" placeholder='Enter equipment brand' value={itemBrand} onChange={(e) => { setBrand(e.target.value) }} />

            {nameEqual !== null ?
                <button disabled={true}> ERROR</button> :
                <button onClick={() => { sendData() }}>Submit</button>
            }
        </div>
    )
}

export default NewEquipment
