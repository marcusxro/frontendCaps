import React from 'react'

const StatusModal = ({setShowInf}) => {

    return (
        <div className='StatusModal'>
            <div className="buttonCon">
                <button onClick={() => {setShowInf(prevClick => !prevClick)}}>
                    close
                </button>
            </div>
            <div className="colorCon">
                <div className="colorItem">
                    Expired: <div className='colorHex redCol'></div>
                </div>
                <div className="colorItem">
                    Spoiled: <div className='colorHex spolCol'></div>
                </div>
                <div className="colorItem">
                    Damaged: <div className='colorHex damCol'></div>
                </div>
                <div className="colorItem">
                Other: <div className='colorHex otherCol'></div>
                </div>
            </div>
        </div>
    )
}

export default StatusModal
