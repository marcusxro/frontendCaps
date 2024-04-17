import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { authentication } from '../authentication'
const ReportsModal = () => {

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

    const [image, setImage] = useState(null);


    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        setImage(file)
        // if(file) {
        //    console.log(file)
        // }
    }

   const createReport = (e) => {
    e.preventDefault();
    if (!incTitle || !reportType || !RepDetails ) {
        return alert("Please fill in all required fields and upload an image.");
    }

    const formData = new FormData();
    formData.append("photoURL", image);
    formData.append("Uid", Uid);
    formData.append("Incident", incTitle);
    formData.append("RepType", reportType);
    formData.append("isResolved", isResolved);
    formData.append("RepDetails", RepDetails);
    formData.append("Email", Email);
    formData.append("Fullname", Fullname);
    formData.append("Date", Date.now());

    axios.post('http://localhost:8080/uploadAndReportCreate', formData)
      .then(response => {
          console.log("Details sent:", response.data);
          setTitle('');
          setType('');
          setRepDetails('');
      })
      .catch(error => {
          console.error("Error:", error);
      });
};

    return (
        <div className='reportsModal'>
            <div className="creRep">
                Create report for Products
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
                <input
                    name='files'
                    type='file'
                    lable="image"
                    accept="image/*"
                    onChange={(e) => { handleImageChange(e) }} />

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default ReportsModal
