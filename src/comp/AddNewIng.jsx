import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { authentication } from '../authentication'
import { onAuthStateChanged } from 'firebase/auth'
import gsap from 'gsap'

const AddNewIng = () => {
    const [ingName, setIng] = useState('')
    const [weight, setWeight] = useState('')
    const [catergory, setCater] = useState('')
    const [measurements, setMeas] = useState('')
    const [quantity, setQuan] = useState('')
    const [firstname, setFirst] = useState('')
    const [Email, setEmail] = useState('')
    const [Uid, setUid] = useState('')
    const [Brand, setBrand] = useState('')
    const [ExpiryDate, setExpiry] = useState('')

    
    const removeValue = () => {
        setIng('')
        setWeight('')
        setCater('')
        setMeas('')
        setQuan('')
        setBrand('')
        setExpiry('')
        setBrand('')
    }

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
            if (acc) {
                setEmail(acc.email)
                setUid(acc.uid)
            }
        })
        return () => { unsub() }
    }, [Uid])

    const sendIng = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8080/postIng', {
            IngName: ingName,
            Weight: weight,
            Measure: measurements,
            Category: catergory,
            ExpiryDate: ExpiryDate,
            Brand: Brand,
            Quantity: quantity,
            Email: Email,
            Fullname: firstname,
            Date: Date.now(),
            Uid: Uid
        }).then(() => {
            console.log("details sent")
            removeValue()
        }).catch((err) => {
            console.log("error", err)
        })
    }

    const [data, setData] = useState([])

    const [nameEqual, setNameEq] = useState(null)
    const pNameEl = useRef(null)
    useEffect(() => {
        axios.get('http://localhost:8080/getIng')
            .then((res) => {
                setData(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }, [data]);

    useEffect(() => {
        const filtered = data.find((item) => item.IngName.toLowerCase() === ingName.toLowerCase());
        console.log(filtered)
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
    }, [data, ingName])

    return (
        <div className='AddNewIng'>
            <div className="AddNewIngtext">
                Add ingredient
            </div>
            <form action="submit" onSubmit={sendIng}>
                <input ref={pNameEl} required value={ingName} type="text" placeholder='Enter ingredient name' onChange={(e) => { setIng(e.target.value) }} />
                <input required value={weight} type="number" placeholder='Enter ingredient weight' onChange={(e) => { setWeight(e.target.value) }} />
                <input type="text" placeholder='Enter ingredient brand' value={Brand} onChange={(e) => { setBrand(e.target.value) }} />
                <div className="date">
                    <div className="dateText">
                        Enter expiry date
                    </div>
                    <input type="Date" value={ExpiryDate} onChange={(e) => { setExpiry(e.target.value) }} />
                </div>
                <select required value={catergory} onChange={(e) => { setCater(e.target.value) }}>
                    <option value="">Enter ingredient type</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Dried">Dried</option>
                    <option value="Powdered">Powdered</option>
                    <option value="Sliced">Sliced</option>
                </select>
                <input required value={measurements} type="text" placeholder='Enter ingredient measurements' onChange={(e) => { setMeas(e.target.value) }} />
                <input required value={quantity} type="number" placeholder='Enter ingredient Quantity' onChange={(e) => { setQuan(e.target.value) }} />

                {nameEqual !== null ?
                    <button type='submit' disabled={true}>ERROR</button>
                    :
                    <button type='submit'>submit</button>
                }
            </form>
        </div>
    )
}

export default AddNewIng
