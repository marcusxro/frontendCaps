import React, { useRef } from 'react'
import { gsap } from 'gsap'

const Cursor = () => {
    const cursor = useRef(null)

    document.onmousemove = (e) => {
      gsap.to(cursor.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
    });
    }
  return (
    <div>
      <div className='cursor' ref={cursor}></div>
    </div>
  )
}

export default Cursor