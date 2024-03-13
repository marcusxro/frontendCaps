import React, { useState, useEffect, useRef } from 'react'
import { authentication } from '../authentication';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link, json } from 'react-router-dom';

const Forgotpw = () => {
    const [email, setEmail] = useState('');
    const [resetStatus, setResetStatus] = useState(null);
    const [counter, setCounter] = useState(0)
    const [loading, setLoading] = useState('')
    const [cooldown, setCooldown] = useState(0);
    const cooldownHolder = useRef(null)
    document.title = "Forgot password"
    useEffect(() => { //if it reaches 3 requests
        if (counter >= 3) {
            setCooldown(3 * counter); //automatically adds a cooldown based on click
            setLoading('Cooling down...');
        }
    }, [counter]);

    useEffect(() => { //decrement effect
        const intervalId = setInterval(() => {
            if (cooldown > 0) {
                setCooldown(cooldown - 1);
                cooldownHolder.current.placeholder = `wait ${cooldown} to submit again`
                setEmail('')
            } else {
                cooldownHolder.current.placeholder = `Enter your email`
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [cooldown]);

    const resetPassword = (e) => {
        e.preventDefault();
        if (cooldown > 0) {
            console.log("You are in cooldown. Please wait.");
            return;
        }
        setCounter(counter + 1);
        setLoading('Loading...');
        sendPasswordResetEmail(authentication, email)
            .then(() => {
                const user = authentication.currentUser;
                if (!user.emailVerified) {
                    setResetStatus('Not verified');
                    setEmail('')
                } else {
                    setResetStatus('Password reset email sent');
                    setEmail('')
                }
                setLoading('');
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    setResetStatus('User does not exist');
                    setEmail('')
                } else {
                    console.error('Error sending password reset email:', error.message);
                    setEmail('')
                }
                setLoading('');
            });
    };

    return (
        <div className='pwPage'>
            <p>{loading}</p>
            {resetStatus && <p>{resetStatus}</p>}
            <form
                className='pwForm'
                onSubmit={resetPassword}>
                <h3>Forgot your password?</h3>
                <p>Enter your email address and we'll send the link to reset your password.</p>
                <input onChange={(e) => { setEmail(e.target.value) }}
                    value={email}
                    placeholder='Enter your email:'
                    type="email"
                    required
                    ref={cooldownHolder}
                />
                <button type='submit'>
                    reset password
                </button>
            </form>
            <Link
                style={{
                    textDecoration: "none",
                    color: "#4f4cb0",
                    fontWeight: "600",
                    fontSize: "1.2rem"
                }}
                to="/login">
                Back to login page
            </Link>
        </div>
    )
}
export default Forgotpw
