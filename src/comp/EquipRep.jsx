import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { authentication } from '../authentication'



const EquipRep = () => {
    const [incTitle, setTitle] = useState('')
    const [reportType, setType] = useState('')
    const [isResolved, setRes] = useState(false)
    const [Email, setEmail] = useState('')
    const [Fullname, setFullname] = useState('')
    const [Uid, setUid] = useState('')
    const [RepDetails, setRepDetails] = useState('')



    useEffect(() => {
        axios.get('http://localhost:8080/accInfos')
            .then((response) => {
                const filteredData = response.data.filter((item) => item.Uid === Uid);
                setFullname(filteredData[0].Firstname + " " + filteredData[0].Lastname)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [Fullname, Uid]);



    useEffect(() => {
        const unsub = onAuthStateChanged(authentication, (acc) => {
            if (acc) {
                setUid(acc.uid)
                setEmail(acc.email)
            }
        })
        return () => { unsub() }
    }, [Uid])



    const createReport = (e) => {
        e.preventDefault()
        if (!incTitle || !reportType || !RepDetails) {
            return alert("please type something")
        }
        axios.post('http://localhost:8080/EquipRep', {
            Incident: incTitle,
            RepType: reportType,
            isResolved: isResolved,
            RepDetails: RepDetails,
            Email: Email,
            Fullname: Fullname,
            Date: Date.now(),
            Uid: Uid

        }).then(() => {
            console.log("details sent")
            setTitle('')
            setType('')
            setRepDetails('')
        }).catch((err) => {
            console.log("errpr", err)
        })
    }

    return (
        <div className='reportsModal'>
            <div className="creRep">
                Create report for equipment
            </div>
            <form onSubmit={createReport}>
                <input value={incTitle} onChange={(e) => { setTitle(e.target.value) }} type="text" placeholder='Enter report title' />
                <select value={reportType} onChange={(e) => { setType(e.target.value) }}>
                    <option value="">Select report type</option>
                    <option value="Malfunctioning equipment">Malfunctioning equipment</option>
                    <option value="Equipment breakdown">Equipment breakdown</option>
                    <option value="Equipment maintenance required">Equipment maintenance required</option>
                    <option value="Missing equipment">Missing equipment</option>
                    <option value="Damaged equipment">Damaged equipment</option>
                    <option value="Spoiled ingredients">Spoiled ingredients</option>
                    <option value="Inadequate equipment">Inadequate equipment</option>
                    <option value="Other">Other issue</option>
                </select>
                <textarea placeholder='Enter product details' value={RepDetails} onChange={(e) => { setRepDetails(e.target.value) }} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default EquipRep
