import React, { useEffect, useState } from 'react';
import { authentication } from '../authentication';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
const NewItem = () => {
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [weight, setWeight] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quanOver, setOver] = useState('');
    // acc info
    const [email, setEmail] = useState('');
    const [Uid, setUid] = useState('');
    const [name, setName] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/accInfos')
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
        axios.post('http://localhost:8080/postMenu', {
            ProductName: productName,
            Category: category,
            Weight: weight,
            Quantity: quantity,
            OverQuan: quanOver,
            Email: email,
            Fullname: name,
            Date: dateNOw,
            Uid: Uid
        }).then(() => {
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
                        <option value="">select product category</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Tea">Tea</option>
                    </select>
                    <input
                      required
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        type="number"
                        placeholder='Enter product Weight'
                    />
                    <div className="quanCon">
                    <input
                      required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        type="number"
                        placeholder='Enter product Quantity'
                    />
                     <input
                      required
                        value={quanOver}
                        onChange={(e) => setOver(e.target.value)}
                        type="number"
                        placeholder='Enter over Quantity'
                    />
                    </div>
                </div>
                <button type='submit'>Submit</button> {/* Changed action='submit' to type='submit' */}
            </form>
        </div>
    );
};

export default NewItem;
