import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { authentication } from '../authentication'
import { onAuthStateChanged } from 'firebase/auth'


const AddNewIng = () => {
    const [ingName, setIng] = useState('')
    const [weight, setWeight] = useState('')
    const [catergory, setCater] = useState('')
    const [measurements, setMeas] = useState('')
    const [quantity, setQuan] = useState('')
    const [firstname, setFirst] = useState('')
    const [Email, setEmail] = useState('')
    const [Uid, setUid] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/accInfos')
          .then((response) => {
            const filteredData = response.data.filter((item) => item.Uid === Uid);
            setFirst(filteredData[0].Firstname + " " + filteredData[0].Lastname)
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, [Uid]);

    useEffect(() => {
        const unsub = onAuthStateChanged(authentication, (acc) => {
            if(acc) {
                setEmail(acc.email)
                setUid(acc.uid)
            }
        })
        return () => {unsub()}
    }, [])

    const sendIng = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8080/postIng', {
            IngName: ingName,
            Weight: weight,
            Measure: measurements,
            Category: catergory,
            Quantity: quantity,
            Email: Email,
            Fullname: firstname,
            Date: Date.now(),
            Uid: Uid
        }).then(() => {
            console.log("details sent")
        }).catch((err) => {
            console.log("error", err)
        })
    }

  return (
    <div className='AddNewIng'>
        <div className="AddNewIngtext">
            Add ingredient
        </div>
        <form action="submit" onSubmit={sendIng}>
            <input required value={ingName} type="text" placeholder='Enter ingredient name' onChange={(e) => {setIng(e.target.value)}}  />
            <input required  value={weight} type="number" placeholder='Enter ingredient weight' onChange={(e) => {setWeight(e.target.value)}} />
            <select required  value={catergory} onChange={(e) => {setCater(e.target.value)}}>
                <option value="">Enter ingredient catergory</option>
                <option value="Solid">Solid</option>
                <option value="Liquid">Liquid</option>
            </select>
            <input required  value={measurements} type="text" placeholder='Enter ingredient measurements' onChange={(e) => {setMeas(e.target.value)}} />
            <input required  value={quantity} type="number" placeholder='Enter ingredient Quantity' onChange={(e) => {setQuan(e.target.value)}} />
            <button type='submit'>submit</button>
        </form>
    </div>
  )
}

export default AddNewIng
