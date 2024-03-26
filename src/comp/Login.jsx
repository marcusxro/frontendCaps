import React, { useEffect, useRef, useState } from 'react'
import { authentication } from '../authentication'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import secondImg from '../images/second.jpg'
import logo from '../images/loader.png'
import Loading from './Loading'
import sideBg from '../images/sideBg.jpg'
import axios from 'axios'

const Login = () => {
    const [user, setUser] = useState(null)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [showPass, setShowPass] = useState(false)
    const passEl = useRef(null)
    const checkB = useRef(null)
    const [loading, setLoading] = useState(true);
    const nav = useNavigate()
    const errors = useRef(null)
    const [verified, setVerified] = useState(false)
    const notVerif = useRef(null)
    const [error, setErr] = useState(false)
    const [click, setClick] = useState(0)
    const [Uid, setUid] = useState('')
    useEffect(() => {
        const unSub = onAuthStateChanged(authentication, (user) => {
            if (user) {
                if (!user.emailVerified) {
                    setVerified(true)
                    gsap.to('.notVeri', {
                        display: 'block'
                    })
                    return;
                } else {
                    nav('/system'); // Navigate to system if email is verified
                    setVerified(false)
                    setUid(user.uid)
                }
            }
        });

        return () => unSub();
    }, [nav]);

    useEffect(() => {
        document.title = 'Sign in';
        const unsub = onAuthStateChanged(authentication, (user) => {
            if (user) {
                ///sdsdas
            } else {
                console.log("no user")
            }
        })

        return () => { unsub() }
    }, [])



    const SignIn = (e) => {
        e.preventDefault();

        if (password.length <= 5) {
            alert("Password should be at least 6 characters long");
            return;
        }

        signInWithEmailAndPassword(authentication, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user.uid);

                if (user && !user.emailVerified) {
                    alert("Your email is not verified. Please check your email and verify your account.");
                    return;
                } else if (user && user.emailVerified) { // Only navigate to system if email is verified
                    nav('/system');
                }

            }).catch((err) => {
                if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/too-many-requests' || err.code === 'auth/invalid-credential') {
                    setErr(true);
                    gsap.to(errors.current, {
                        display: "block"
                    });
                    gsap.to('.email', {
                        border: "1px solid red"
                    });
                    gsap.to(passEl.current, { // Fix: Reference passEl.current instead of password.current
                        border: "1px solid red"
                    });
                } else {
                    console.error('Authentication error:', err);
                }
            });
    }

    const showPassFunc = () => {
        passEl.current.type = showPass ? "password" : "text"; // Toggle password visibility
        setShowPass(!showPass);
    }

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
            {loading ? <Loading /> : (
                <div className="halfCon">
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
                                type={showPass ? "text" : "password"}
                                placeholder='Enter your password'
                                ref={passEl}
                                onChange={(e => { setPassword(e.target.value) })}
                            />
                            <div className="showPass">
                                <div
                                    onClick={showPassFunc}
                                    className='showBtn'>
                                    <input
                                        className='checks'
                                        type="checkbox"
                                        ref={checkB}
                                    />
                                    <div className="label">Show password</div>
                                </div>
                                <div 
                                onClick={() => {nav('/forgotPassword')}}
                                className="goToPw">
                                    Don't remember your password?
                                </div>
                            </div>
                            <div ref={errors} className="error">
                                {error && 'Kindly check your email and password'}
                            </div>
                            {verified ? <div className="notVeri">Your email is not verified!</div> : null}
                            <button type="submit">Login</button>
                        </form>
                        <div
                        onClick={() => {nav('/register')}}
                         className="bottomLog">
                            don't have an account? <span>register here!</span>
                        </div>
                    </div>
                    <div className="secondH">
                        <img src={secondImg} alt="" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login
