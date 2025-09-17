import React from 'react';
import './WinnerPopup.css';
import Button from './Button';

const WinnerPopup = ({ isVisible, winner, reason, score, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="winner-popup-overlay">
      <div className="winner-popup">
        <div className="winner-popup-content">
          <h2 className="winner-title">🎉 Game Over! 🎉</h2>
          <div className="winner-info">
            <h3 className="winner-text">{winner}</h3>
            <p className="winner-reason">{reason}</p>
            {score && (
              <div className="score-display">
                <p>⚫ Black: {score.black}</p>
                <p>⚪ White: {score.white}</p>
              </div>
            )}
          </div>
          <div className="winner-actions">
            <Button title="Back to Menu" handleClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerPopup;