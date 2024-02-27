import React, { useEffect, useRef, useState } from 'react'
import { authentication } from '../authentication'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Cursor from './Cursor'
import gsap from 'gsap'
import secondImg from '../images/second.jpg'
import Spline from '@splinetool/react-spline';
import logo from '../images/loader.png'
import Loading from './Loading'
import sideBg from '../images/sideBg.jpg'

const Login = () => {
    const [user, setUser] = useState(null)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [showPass, setShowPass] = useState(false)
    const passEl = useRef(null)
    const checkB = useRef(null)
    const [loading, setLoading] = useState(true);
    const nav = useNavigate()

    useEffect(() => {
        const unsub = onAuthStateChanged(authentication, (user) => {
            if (user) {
                console.log("hah")
            } else {
                console.log("nmo user")
            }
        })

        return () => { unsub() }
    }, [])

    const errors = useRef(null)
    const SignIn = (e) => {
        e.preventDefault()

        if (password.length <= 5) {
            alert("Password should be at least 6 characters long");
            return
        }
        signInWithEmailAndPassword(authentication, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user.uid)

                if (user) {
                    console.log('goodaftertoon')
                    nav('/system')
                }

            }).catch((err) => {
                if (err.code === 'auth/user-not-found') {
                    alert('User not found. Please register.');
                } else if (err.code === 'auth/wrong-password') {
                    alert("Wrong password, please try again.");
                } else if (err.code === 'auth/too-many-requests') {
                    alert("Account temporarily disabled due to too many requests.");
                } else if (err.code === 'auth/invalid-credential') {
                    gsap.to(errors.current, {
                        display: "block"
                    })
                    gsap.to('.email', {
                        border: "1px solid red"
                    })
                    gsap.to(password.current, {
                        border: "1px solid red"
                    })

                }
                else {
                    console.error('Authentication error:', err);
                }
            });
    }


    const [click, setClick] = useState(0)
    const showPassFunc = () => {
        passEl.current.type = "text"
        setClick(click + 1)
        checkB.current.checked = true

        if (click === 1) {
            checkB.current.checked = false
            passEl.current.type = "password"
            setClick(0)
        }
    }


    gsap.to('.cursor', {
        display: 'none',
    })
    document.querySelector('html').style.cursor = "auto";

    useEffect(() => {
        gsap.to('.cursor', {
            display: 'none',
        });
        document.querySelector('html').style.cursor = 'auto';
        gsap.to('.secondH', {
            opacity: 1,
            onComplete: () => setLoading(false), // Set loading state to false when animation is complete
        });
    }, []);

    return (
        <div>
            {loading ? <Loading /> : (<div className="halfCon">
                <div className="firstH">
                    <div className="absoBtn">
                        <button onClick={() => nav('/')}>Go back</button>
                    </div>
                    <form onSubmit={SignIn}>
                        <div className="signInText">Sign in</div>
                        <input
                            type="email"
                            value={email}
                            className='email'
                            placeholder='Enter your email'
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <input
                            value={password}
                            type="password"
                            placeholder='Enter your password'
                            ref={passEl}
                            onChange={(e => { setPassword(e.target.value) })}
                        />
                        <div className="showPass">
                            <input
                                className='checks'
                                type="checkbox"
                                ref={checkB}
                                onClick={showPassFunc}
                            />
                            <div className="label">show password</div>
                        </div>
                        <div
                            ref={errors}
                            className="error">
                            kindly check your email and password
                        </div>
                        <button
                            type="submit">Login</button>
                    </form>
                </div>
                <div className="secondH">
                   <img src={secondImg} alt="" />
                </div>
            </div>)}
        </div>
    )
}

export default Login
