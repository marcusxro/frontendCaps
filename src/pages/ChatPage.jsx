import React, { useEffect, useState, useRef } from 'react'
import Sidebar from '../comp/Sidebar'
import { onAuthStateChanged } from 'firebase/auth'
import { authentication } from '../authentication'
import axios from 'axios'
import moment from 'moment'

const ChatPage = () => {
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

    useEffect(() => {
        axios.get('http://localhost:8080/accInfos')
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
        axios.get('http://localhost:8080/getMessage')
            .then((res) => {
                setMessageData(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [messageData])

    const handleDeleteMessage = (itemId) => {
        axios.delete(`http://localhost:8080/deleteMessage/${itemId}`)
            .then(() => {
                console.log("message deleted")
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
        axios.post('http://localhost:8080/message', {
            userName: userDetails.Firstname + " " + userDetails.Lastname,
            Message: messageText,
            Date: Date.now(),
            Uid: uid
        }).then(() => {
            console.log("message sent!")
            setMessage('')
            setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight;
            }, 300);

        }).catch((err) => {
            console.log(err)
        })
    }
    const [showBtn, setShowBtn] = useState(false)
    const [equalID, setEqual] = useState('')


    const [peopleData, setDataPeople] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8080/accInfos')
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
                                {item.Firstname + " " + item.Lastname}
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
                                        <button onClick={() => { handleDeleteMessage(item._id) }} >unsent</button>
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
