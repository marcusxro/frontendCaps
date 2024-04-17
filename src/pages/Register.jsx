import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { authentication } from '../authentication'
import gsap from 'gsap'
import milkTea from '../images/register.jpg'
import filipinoBadwords from "filipino-badwords-list"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const nav = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [position, setPosition] = useState('')
    const [lastname, setLastname] = useState('')
    const [status, setStatus] = useState('')
    const [error, setError] = useState('')
    const [repeat, setRepeat] = useState('')
    document.title = "Create new account"


const notif = () => {
    toast.success('Account Created! Please verify your account now.', {
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
const notifError = () => {
    toast.error('Error occured please check your input', {
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
    const createAccount = (e) => {
        e.preventDefault()  
        if (password.length <= 5) {
            alert("make it longer!")
        } else if (filipinoBadwords.array.some(word => firstname.includes(word)) || filipinoBadwords.array.some(word => lastname.includes(word))) {
            setStatus("bad words are prohibited!")
            gsap.to('.accountStatus', {
                backgroundColor: "red"
            })
        }
        else if (password !== repeat) {
            setStatus("password are not the same")
            gsap.to('.accountStatus', {
                backgroundColor: "red"
            })
        }
        else {
            createUserWithEmailAndPassword(authentication, email, password)
                .then((userCred) => {
                    if (userCred) {
                        sendEmailVerification(authentication.currentUser) //verifiy users so they can't spam accounts to server
                            .then(() => {
                                const user = authentication.currentUser;
                                if (user && !user.emailVerified) {
                                 
                                    notif()
                                    console.log(position)
                                    axios.post('https://backendcaps-7zrx.onrender.com/GetAcc', {
                                        Email: email,
                                        Firstname: firstname,
                                        Lastname: lastname,
                                        Position: position,
                                        Password: password,
                                        Uid: user.uid,
                                        isBanned: false
                                    }).then(() => {
                                        console.log("details sent")
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                } else {
                                    nav('/')
                                }
                            }).catch((err) => {
                                console.log("errors: " + err)
                            })
                    } else {
                        nav("/")
                    }
                }).catch((err) => {
                    if (err.code === 'auth/email-already-in-use') {
                        notifError();
                    } else {
                        console.error('Error:', err.message);
                        notifError();
                    }
                })
        }

    }


    useEffect(() => {
        if (status) {
            gsap.to('.accountStatus', {
                display: 'block'
            })
            setTimeout(() => {
                gsap.to('.accountStatus', {
                    display: 'none'
                })
            }, 2000);
        }
    }, [status])

    const [click, setCLick] = useState(0)
    const firstPass = useRef(null)
    const secPass = useRef(null)

    const showPassword = () => {
        firstPass.current.type = "text"
        secPass.current.type = "text"
        setCLick(click + 1)

        if (click === 1) {
            firstPass.current.type = "password"
            secPass.current.type = "password"
            setCLick(0)
        }
    }

    return (
        <div className='register'>
          <ToastContainer />
            <div className="registerLeft">
                <div className="registerImg">
                    <img src={milkTea} alt="" />
                </div>
            </div>
            <div className="registerRight">
                <div className="registerText">
                    Create account
                </div>
                <form
                    onSubmit={createAccount}
                    className='createAcc'
                    action="submit">
                    <div className="accountStatus">
                        {status}
                    </div>
                    <input
                        value={firstname}
                        required
                        onChange={(e) => { setFirstname(e.target.value) }}
                        type="text" className='firstname' placeholder='Enter your first name' />
                    <input
                        value={lastname}
                        required
                        onChange={(e) => { setLastname(e.target.value) }}
                        type="text" className='lastnme' placeholder='Enter your last name' />
                    <input
                        value={email}
                        required
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email" placeholder='Enter your email' />
                    <input
                        ref={firstPass}
                        value={password}
                        required
                        onChange={(e) => { setPassword(e.target.value) }}
                        type="password" placeholder='Set your password' />
                    <input
                        ref={secPass}
                        value={repeat}
                        required
                        onChange={(e) => { setRepeat(e.target.value) }}
                        type="password" placeholder='Repeat your password' />
                    <div
                        onClick={showPassword}
                        className="show">
                        <input type="checkbox" name='check' />
                        <label htmlFor="check">Show password</label>
                    </div>
                    <select
                    className='registerSelect'
                        value={position}
                        required
                        onChange={(e) => setPosition(e.target.value)}
                        name="" id="">
                        <option value="">Select a position</option> {/* Add a default option */}
                        <option value="Barrista">Barrista</option>
                        <option value="Staff">Manager</option>
                        <option value="Owner">Owner</option>
                    </select>

                    <div className="already">
                        Already have account? <span onClick={() => { nav('/login') }}>Sign in</span>
                    </div>
                    <button onClick={createAccount} >Sign up</button>
                </form>
            </div>
        </div>
    )
}

export default Register
