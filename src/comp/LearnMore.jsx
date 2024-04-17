import React from 'react'
import updatePng from '../images/Update.png'
const LearnMore = ({ func }) => {

  return (
    <div className='LearnMore'>
      <div className="learnFirst">
        <img src={updatePng} alt="" />
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
        <div className="learnVersion">
          Version: <span>1.0</span>
        </div>
        <div className="learnDesc">
          In the homepage, you can see the basic information and also interaction to the website. in the top side, you can see the header, you may choose to Sign in and Register. Once logged in, you'll be transfered to Dashboard where you can see all the
          your activity, Analytics, and many more.
          Locate the sidebar at the left side, you can navigate the pages on you choice. The system offers a great function and less bugs.
        </div>
        <div className="learnFeatures">
        <div className="learnItems">Features</div>
            <div className="learnItems">-Sign in and Register</div>
            <div className="learnItems">-Contact page</div>
            <div className="learnItems">-Dashboad</div>
            <div className="learnItems">-Inventory for Products, Ingredients, and Equipment</div>
            <div className="learnItems">-Search Engine</div>
            <div className="learnItems">-Analytcs</div>
            <div className="learnItems">-Categorization</div>
            <div className="learnItems">-Transaction report</div>
            <div className="learnItems">-Reports for Products, Ingredients, and Equipment</div>
            <div className="learnItems">-Security for owner</div>
            <div className="learnItems">-Notificaton</div>
            <div className="learnItems">-Communication (chat) </div>
        </div>
        <div className="learnRep">
          If you ever found a bug, Kindly reach out the developer to fix it immediately <br/>
          -Cafe Eunoia Dev
        </div>
      </div>
    </div>
  )
}

export default LearnMore
