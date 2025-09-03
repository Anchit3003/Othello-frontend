import React,{useEffect} from "react";
import "./Home.css";
import OthelloMain from "../components/OthelloMain";
import othellooo from "../assets/othellooo.png";
import LoginSignup from "../components/LoginSignup";
import { initializeSocket, disconnectSocket } from '../socket';
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../features/auth/authSlice';
import UserCard from "../components/UserCard";
export default function Home() {
  const {isAuthenticated, user, loading} = useSelector(state =>state.auth)
  const dispatch = useDispatch();
  const handleFindGame =()=>{
    console.log("Finding game...");
  }
  const handlePlayOffline = () => {
    console.log("Playing offline...");
  }
    const handleLogout = () => {
    dispatch(logout());
    console.log("User logged out");
  }
  const buttons = [
  { title: "Find Game", handleClick: handleFindGame },
  { title: "Play Offline", handleClick: handlePlayOffline },
  { title: "How to Play", handleClick: () => window.open("https://en.wikipedia.org/wiki/Reversi", "_blank") },

];
  return (
    <div className="home-container">
    
      <aside className="side-nav">
      <div className="header">
          <img src={othellooo} alt="Othello Logo" className="logo" />
          <h2>Othello Game</h2>
        </div>
        <div className="sidebar-buttons">
          {buttons.map((button, index) => (
            <Button key={index} title={button.title} handleClick={button.handleClick} />
          ))}
        </div>
        <div className="sidebar-login">
          {loading ? (
            <div className="auth-loading">Loading...</div>
          ) : isAuthenticated && user ? (
            <UserCard user={user} onLogout={handleLogout} />
          ) : (
            <LoginSignup />
          )}
        </div>
     

      </aside>
      <div className="game-area">
        {/* <Grid /> */}
        
        <OthelloMain />
      </div>
    </div>
  );
}