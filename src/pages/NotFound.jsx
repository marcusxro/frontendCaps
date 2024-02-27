import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const nav = useNavigate()

  return (
    <div className='notFoundCon'>
      <div className="notFoundFirstText">
        404
      </div>
      <div className="notFoundBot">
        the link that you searched doesn't exist <span onClick={() => {nav('/')}}>go back</span>
      </div>
    </div>
  )
}

export default NotFound
