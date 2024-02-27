import React from 'react'
import { signOut } from 'firebase/auth'
import { authentication } from '../authentication'
import { useNavigate } from 'react-router-dom'

const Logout = () => {

    const nav = useNavigate()

    const handlesignOut = () => {
        signOut(authentication)
        .then(() => {
            console.log('comleted')
            nav('/')
        }).catch((err) => {
            console.log(err)
        })
    }
  return (
    <div className='logOutCon'>
      <button 
      className='logOut'
      onClick={handlesignOut}>
        <ion-icon name="log-out-outline"></ion-icon></button>
    </div>
  )
}

export default Logout
