import React, { useEffect, useRef, useState } from 'react';
import { authentication } from '../authentication';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import gsap from 'gsap'
const NewItem = () => {
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [weight, setWeight] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quanOver, setOver] = useState('');
    const [Expiry, setExpiry] = useState('')
    const [prodCondition, setCondition] = useState('')
    // acc info
    const [email, setEmail] = useState('');
    const [Uid, setUid] = useState('');
    const [name, setName] = useState('')
    const [data, setData] = useState([])

    const removeVal = () => {
        setProductName('');
        setWeight('');
        setCategory('');
        setQuantity('')
        setExpiry('')
        setOver('')
        setCondition('')
      }

    const [nameEqual, setNameEq] = useState(null)
    const pNameEl = useRef(null)
    useEffect(() => {
        const filtered = data.find((item) => item.ProductName.toLowerCase() === productName.toLowerCase());
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
    }, [data, productName])

    useEffect(() => {
        axios.get('https://backendcaps-7zrx.onrender.com/menuDetails')
            .then((res) => {
                setData(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }, [data]);

    useEffect(() => {
        axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
            .then((res) => {
                const filteredData = res.data.filter((item) => item.Uid === Uid);
                console.log(filteredData)
                const fullname = filteredData[0].Firstname + " " + filteredData[0].Lastname
                setName(fullname)
            }).catch((err) => {
                console.log("ERROR", err)
            })
    }, [Uid])



    useEffect(() => {
        const unsub = onAuthStateChanged(authentication, (user) => {
            if (user) {
                setEmail(user.email);
                setUid(user.uid);
                console.log(email)
            } else {
                setEmail('');
                setUid('');
            }
        });
        return () => unsub(); // Unsubscribe from onAuthStateChanged when component unmounts
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(name)
        const dateNOw = Date.now()

        axios.post('https://backendcaps-7zrx.onrender.com/postMenu', {
            ProductName: productName,
            Category: category,
            Weight: weight,
            Quantity: quantity,
            ExpiryDate: Expiry,
            Condition: prodCondition,
            OverQuan: quanOver,
            Email: email,
            Fullname: name,
            Date: dateNOw,
            Uid: Uid
        }).then(() => {
            removeVal()
            console.log('details sent')
        }).catch((err) => {
            console.log("theres some error", err)
        })
    };

    return (
        <div className='addModal'>
            <form className='modalForm' onSubmit={handleSubmit}>
                <div className="modalTitle">
                    Add a new product
                </div>
                <div className="firstModal">
                    <input
                        ref={pNameEl}
                        required
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        type="text"
                        placeholder='Enter product name'
                    />
                    <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        name="" id="">
                        <option value="">select product type</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Burger">Burger</option>
                        <option value="Croffles">Croffles</option>
                        <option value="Nachos">Nachos</option>
                    </select>
                    <input
                        required
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        type="number"
                        placeholder='Enter product Size'
                    />
                    <div className="dateModal">
                        <div className="dateText">
                            Enter expiry date
                        </div>
                        <input
                            required
                            value={Expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            type="Date"
                            placeholder='sdsd'
                        />
                    </div>
                    <select onChange={(e) => { setCondition(e.target.value) }} value={prodCondition}>
                        <option value="">Enter product condition</option>
                        <option value="Fresh">Fresh</option>
                        <option value="Frozen">Frozen</option>
                        <option value="Expired">Expired</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Spoiled">Spoiled</option>
                        <option value="Prepared">Prepared</option>
                    </select>
                    <div className="quanCon">
                        <input
                            required
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            type="number"
                            placeholder='Enter product Quantity'
                        />
                        <div className="slash">
                            /
                        </div>
                        <input
                            required
                            value={quanOver}
                            onChange={(e) => setOver(e.target.value)}
                            type="number"
                            placeholder='Enter over Quantity'
                        />
                    </div>
                </div>
                {nameEqual !== null ?
                    <button className='error' disabled={true} >ERROR</button>
                    :
                    <button type='submit'>Submit</button>
                }
            </form>
        </div>
    );
};

export default NewItem;
