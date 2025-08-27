import React from 'react'
import "./WinnerPopup.css";
const WinnerPopup = ({ winner , score,  onRestart}) => {
  return (
    <div className="winner-overlay">
        <div className="winner-popup">
            <h2>Game Over!</h2>
            <p>Winner:<strong>{winner}</strong></p>
            <p>Score - Black: {score.black} | White: {score.white}</p>
            <button onClick={onRestart}>Restart</button>
        </div>
    </div>
  )
}

export default WinnerPopup