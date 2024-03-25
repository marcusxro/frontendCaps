import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { authentication } from '../authentication'



const IngRep = () => {
    const [incTitle, setTitle] = useState('')
    const [reportType, setType] = useState('')
    const [isResolved, setRes] = useState(false)
    const [Email, setEmail] = useState('')
    const [Fullname, setFullname] = useState('')
    const [Uid, setUid] = useState('')
    const [RepDetails, setRepDetails] = useState('')



    useEffect(() => {
        axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
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
        if(!incTitle || !reportType ||  !RepDetails) {
            return alert("please type something")
        }
        axios.post('https://backendcaps-7zrx.onrender.com/IngReport', {
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
                Create report for Ingredients
            </div>
            <form onSubmit={createReport}>
                <input value={incTitle} onChange={(e) => { setTitle(e.target.value) }} type="text" placeholder='Enter report title' />
                <select value={reportType} onChange={(e) => { setType(e.target.value) }}>
                    <option value="">Select report type</option>
                    <option value="Theft">Theft</option>
                    <option value="Missing">Missing stocks</option>
                    <option value="Miscount">Miscount</option>
                    <option value="Lack of stocks">Lack of stocks</option>
                    <option value="Other">Other</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Spoiled">Spoiled</option>
                    <option value="Expired">Expired</option>
                </select>
                <textarea placeholder='Enter product details' value={RepDetails} onChange={(e) => { setRepDetails(e.target.value) }} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default IngRep
