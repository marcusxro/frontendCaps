import React, { useEffect, useState, useRef } from 'react'
import Sidebar from '../comp/Sidebar'
import { onAuthStateChanged } from 'firebase/auth'
import { authentication } from '../authentication'
import axios from 'axios'
import moment from 'moment'
import gsap from 'gsap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ChatPage = () => {
    document.title = "Communication"
    const [uid, setUid] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const [messageText, setMessage] = useState('')

    useEffect(() => {
        const unsub = onAuthStateChanged(authentication, (acc) => {
            if (acc) {
                setUid(acc.uid);
                
            }
        });
        return () => { unsub(); };
    }, [uid]);
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
                setUserDetails(filteredData[0])
            })
            .catch((error) => {
                console.log(error)
            });
    }, [userDetails]);
    const chatContainerRef = useRef(null);
    const [messageData, setMessageData] = useState([])
    useEffect(() => {
        axios.get('https://backendcaps-7zrx.onrender.com/getMessage')
            .then((res) => {
                setMessageData(res.data)
                gsap.to('.messageCon', {
                    opacity: 1,
                    duration: 0.3
                })
            }).catch((err) => {
                console.log(err)
            })
    }, [messageData])

    const handleDeleteMessage = (itemId, msg) => {
        axios.delete(`https://backendcaps-7zrx.onrender.com/deleteMessage/${itemId}`)
            .then(() => {
                console.log("message deleted")
                notif( `(${msg}) has been successfully unsent!`);
            }).catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (chatContainerRef.current) {
            setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight;
            }, 300);
        }
    }, [chatContainerRef.current]);

    const sendMessage = (e) => {
        e.preventDefault()
        axios.post('https://backendcaps-7zrx.onrender.com/message', {
            userName: userDetails.Firstname + " " + userDetails.Lastname,
            Message: messageText,
            Date: Date.now(),
            Uid: uid
        }).then(() => {
            console.log("message sent!")
            gsap.to(".rightMessage", {
                display: "flex",
                alignSelf: "flex-end",
                justifyContent: "flex-end",
                flexDirection: "column",
                width: "100%",
                maxWidth: "500px",
                backgroundColor: "#4f4cb0",
                padding: "20px",
                height: "auto",
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
                borderTopRightRadius: "20px",
                color: "white",
                position: "relative",
                boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.75)",
                ease: "power1.inOut" // easing function
            });
            setMessage('')
            setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight;
            }, 500);

        }).catch((err) => {
            console.log(err)
        })
    }
    const [showBtn, setShowBtn] = useState(false)
    const [equalID, setEqual] = useState('')


    const [peopleData, setDataPeople] = useState([])
    useEffect(() => {
        axios.get('https://backendcaps-7zrx.onrender.com/accInfos')
            .then((response) => {
                const filteredData = response.data.filter((item) => item.isBanned === false);
                setDataPeople(filteredData)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [peopleData]);



    return (
        <div className='chatPage'>
            <Sidebar />
            <ToastContainer />
            <div className="contactsForChat">
                <div className="contactsText">
                    Members
                </div>
                <div className="contactsCon">
                    {peopleData.map((item) => (
                        <div className="peopleItem" key={item._id}>
                            <div className="peoplePfp">
                                {item.Firstname.charAt(0)}
                            </div>
                            <div className="peopleName">
                                {(item.Firstname + " " + item.Lastname).substring(0, 15) + "..."}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatCon">
                <div className="chatTitle">
                    Communicate now with other employees!
                </div>
                <div className="chatContainer" ref={chatContainerRef}>
                    {messageData.map((item) => (
                        <div className={`messageCon ${item.Uid !== uid ? 'leftMessage' : 'rightMessage'}`} onClick={() => { setShowBtn(!showBtn); setEqual(item._id) }}>
                            <div className="chatName">
                                {item.userName}
                            </div>
                            <div className="chatMessage">
                                {item.Message}
                            </div>
                            <div className="chatDate">
                                {moment(new Date(parseInt(item.Date, 10))).fromNow()}
                            </div>
                            {item.Uid === uid ? (
                                showBtn && equalID === item._id ? (
                                    <div className="chatMessageButtons">
                                        <button onClick={() => { handleDeleteMessage(item._id,item.Message ) }} >unsent</button>
                                    </div>
                                ) : <></>
                            ) : (<></>)}
                        </div>
                    ))}

                </div>
                <form action="submit" onSubmit={sendMessage}>
                    <textarea placeholder='Aa' name="" id="" cols="30" rows="10" value={messageText} onChange={(e) => { setMessage(e.target.value) }} />
                    <button>send</button>
                </form>
            </div>
        </div>
    )
}

export default ChatPage
