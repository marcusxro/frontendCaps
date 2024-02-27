import React from 'react'
import Logo from '../images/loader.png'
import gsap from 'gsap'

const Loading = () => {
const tl = gsap.timeline()

tl.to('.logoForSystem', {
    y: '-20px'
}).to('.logoForSystem', {
    y: '0px',
}).repeat(-1);


  return (
    <div className='loadingForSystem'>
        <div className="logoForSystem">
            <img src={Logo} alt="" />
        </div>
        <div className="loadingForSystemText">
            Loading...
        </div>
    </div>
  )
}

export default Loading
