import React from 'react'

const LearnMore = ({func}) => {

  return (
    <div className='LearnMore'>
      <div className="learnFirst">
        s
      </div>
      <div className="learnSec">
        <div className="exit">
          <div className="exitIcon" onClick={func}>
          <ion-icon name="close-circle-outline" className="exitIcon"></ion-icon>
          </div>
        </div>
        <div className="learnTitle">
          What's New?
        </div>
        <div className="learnDesc">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem dolorem iste eius! Consectetur perferendis illo eveniet eos quos porro optio architecto adipisci, aliquam, error, doloribus nobis eligendi vitae atque repellendus.
        </div>
      </div>
    </div>
  )
}

export default LearnMore
