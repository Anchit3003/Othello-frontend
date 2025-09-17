import React, { useState } from 'react';
import Button from './Button';
import UserCard from './UserCard';
import LoginSignup from './LoginSignup';
import othellooo from "../assets/othellooo.png";
import './SideBar.css';

const Sidebar = ({ 
  gameState, 
  playerNumber, 
  opponentName, 
  scores, 
  buttons, 
  handleBackToMenu,
  isAuthenticated,
  user,
  loading,
  handleLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Show hamburger only on mobile */}
      <button className="hamburger" onClick={handleToggle}>
        {isOpen ? "✖" : "☰"}
      </button>

      <aside className={`side-nav ${isOpen ? "open" : ""}`}>
        <div className="header">
          <img src={othellooo} alt="Othello Logo" className="logo" />
          <h2>Othello Game</h2>
        </div>

        {gameState === "playing" ? (
          <div className="game-info-card">
            <h3>Game in Progress</h3>
            <p>{playerNumber ? (<> <strong>You:</strong> Player {playerNumber} </>): null}</p>
            <p>{playerNumber === 1 ? "You are Black ⚫" : "You are White ⚪"}</p>
            <p><strong>Opponent:</strong> {opponentName || "Waiting..."}</p>
            <div className="scores">
              <p>⚫ Black: {scores.black}</p>
              <p>⚪ White: {scores.white}</p>
            </div>
            <Button title="Back to Menu" handleClick={() => {
              handleBackToMenu();
              setIsOpen(false); // close drawer after click
            }} />
          </div>
        ) : (
          <div className="sidebar-buttons">
            {buttons.map((button, index) => (
              <Button
                key={index}
                title={button.title}
                handleClick={() => {
                  button.handleClick();
                  setIsOpen(false); // close after action
                }}
                disabled={button.disabled || false}
              />
            ))}
          </div>
        )}

        <div className="sidebar-login">
          {isAuthenticated && user ? (
            <UserCard user={user} onLogout={() => {
              handleLogout();
              setIsOpen(false);
            }} />
          ) : (
            <>
              {loading && (
                <div className="auth-loading">
                  <div className="loading-spinner"></div>
                  Authenticating...
                </div>
              )}
              <div className={loading ? "login-disabled" : ""}>
                <LoginSignup />
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
