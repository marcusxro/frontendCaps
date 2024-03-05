import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { authentication } from '../authentication'
import gsap from 'gsap'
import milkTea from '../images/milkTea.png'

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

    const createAccount = (e) => {
        e.preventDefault()
        if (password.length <= 5) {
            alert("make it longer!")
        }else if(password != repeat) {
            setStatus("password are not the same")
            gsap.to('.accountStatus', {
                backgroundColor: "red"
            })
            return
        }
         else {
            createUserWithEmailAndPassword(authentication, email, password)
                .then((userCred) => {
                    if (userCred) {
                        sendEmailVerification(authentication.currentUser) //verifiy users so they can't spam accounts to server
                            .then(() => {
                                const user = authentication.currentUser;
                                if (user && !user.emailVerified) {
                                    setStatus("Account created! please verify your account")
                                    console.log(position)
                                    axios.post('http://localhost:8080/GetAcc', {
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
                                console.log("error: " + err)
                            })
                    } else {
                        nav("/")
                    }
                }).catch((err) => {
                    if (err.code === 'auth/email-already-in-use') {
                        setError(err.errFour);
                    } else {
                        console.error('Error:', err.message);
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

        if(click === 1) {
            firstPass.current.type = "password"
            secPass.current.type = "password"
            setCLick(0)
        }
    }

    return (
        <div className='register'>
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
                        value={position}
                        required
                        onChange={(e) => setPosition(e.target.value)}
                        name="" id="">
                        <option value="">Select a position</option> {/* Add a default option */}
                        <option value="Barrista">Barrista</option>
                        <option value="Staff">Staff</option>
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
