import React, { useEffect, useState } from 'react'
import Sidebar from '../comp/Sidebar'
import lock from '../images/lock.png'
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { authentication } from '../authentication'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Security = () => {
    document.title = "Security"
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [uid, setUid] = useState('')
    const [isOwner, setOwner] = useState(null)
    const [boolBan, setBoolBan] = useState(false)
     
    const notif = (stats) => {
        toast.success(stats, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }
    useEffect(() => {
        axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
            .then((response) => {
                const filteredData = response.data.filter((item) => item.Uid === uid);
                setLoading(true)
                setData(response.data)
                if (!loading) {
                    if (filteredData[0].Position !== "Owner") {
                        alert("ONLY OWNER CAN ACCESS THIS")
                    } else {
                        setOwner(filteredData[0].Position === "Owner")
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }, [data, uid, loading, boolBan]);

    useEffect(() => {
        const unsub = onAuthStateChanged(authentication, (acc) => {
            if (acc) {
                setUid(acc.uid)
            }
        })
        return () => { unsub() }
    }, [uid])

    const [specUid, setSpecUid] = useState('')
    const handleBan = (item) => {
        setSpecUid(item)
    }


    const banUser = (userUid, usrName) => {
        axios.put(`https://backendcaps-7zrx.onrender.com/ban/${userUid}`, {
            isBanned: boolBan
        }).then(() => {
            console.log("successfully banned")
            if(boolBan) {
                notif( `${usrName} has been successfully archived!`);
            } else {
                notif( `${usrName} has been successfully restored!`);
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (

        <div className='securityCon'>
            <Sidebar />
            <ToastContainer />
            {loading ? (
                isOwner ? <>
                    <div className="securityContent">
                        <div className="firstSecCon">
                            <div className="lock">
                                <img src={lock} alt="" />
                            </div>
                            <div className="firstSecurityCon">
                                SECURITY
                            </div>
                            <div className="secPar">
                                Only owners are allowed to enter and make changes here
                            </div>
                            <div className="secGrid">

                                <div className="secGridItem">
                                    <div className="secTitle">
                                        Lorem Ipsum
                                    </div>
                                    <div className="secDesc">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis est autem dolorum, corrupti repellendus nam minima voluptatem cumque distinctio exercitationem fugit eaque libero sit corporis deserunt a labore explicabo adipisci!
                                    </div>
                                </div>
                                <div className="secGridItem">
                                    <div className="secTitle">
                                        Lorem Ipsum
                                    </div>
                                    <div className="secDesc">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis est autem dolorum, corrupti repellendus nam minima voluptatem cumque distinctio exercitationem fugit eaque libero sit corporis deserunt a labore explicabo adipisci!
                                    </div>
                                </div>
                                <div className="secGridItem">
                                    <div className="secTitle">
                                        Lorem Ipsum
                                    </div>
                                    <div className="secDesc">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis est autem dolorum, corrupti repellendus nam minima voluptatem cumque distinctio exercitationem fugit eaque libero sit corporis deserunt a labore explicabo adipisci!
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="securitySecCon">
                            <div className="securitySecTitle">
                                Account management
                            </div>
                            <div className="firstSecPar">
                                You can ban users here. If you do, they will automatically transfered to login page
                            </div>
                            <div className="accountsCon">
                                {loading ? (
                                    data.map((item) => (
                                        <div className="accounts" key={item._id}>
                                            <div className="accountName">
                                                {item.Firstname + " " + item.Lastname}
                                            </div>
                                            <div className="accountEmail">
                                                {item.Email}
                                            </div>
                                            <div className="accountPos">
                                                {item.Position}
                                            </div>
                                            <div className="accountAction">
                                                {item.isBanned === true && boolBan === false? (
                                                    <button className='Unban' onClick={() => { banUser(item._id, item.Firstname + " " + item.Lastname); setBoolBan(false) }}>Restore</button>
                                                ) : (
                                                    specUid !== item._id && <button onClick={() => handleBan(item._id)}>Archive</button>
                                                )}

                                                {specUid === item._id ?
                                                    (<div className="accountActionCon">
                                                        <button onClick={() => { handleBan(null); banUser(item._id, item.Firstname + " " + item.Lastname); setBoolBan(true) }}>confirm</button>
                                                        <button onClick={() => { handleBan(null) }}>cancel</button>
                                                    </div>) : (<></>)
                                                }
                                            </div>
                                        </div>
                                    ))
                                ) : (<>loading...</>)}

                            </div>
                        </div>
                    </div></> : <>YOU ARE NOT ALLOWED HERE</>
            ) : (<>loading..</>)}
        </div>
    )
}

export default Security
