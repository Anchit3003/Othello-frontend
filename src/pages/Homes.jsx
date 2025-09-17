import React,{useEffect,useState} from "react";
import "./Home.css";
import OthelloMain from "../components/OthelloMain";
import othellooo from "../assets/othellooo.png";
import LoginSignup from "../components/LoginSignup";
import { initializeSocket, disconnectSocket,getSocket } from '../socket';
import Button from "../components/Button";
import Grid from "../components/Grid";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../features/auth/authSlice';
import UserCard from "../components/UserCard";
import WinnerPopup from "../components/WinnerPopup"; // Import the WinnerPopup component
import Sidebar from "../components/SideBar";

export default function Home() {
  const {isAuthenticated, user, loading} = useSelector(state =>state.auth)
  const [gameState, setGameState] = useState('menu');
  const [roomId, setRoomId] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  
  // Winner popup state
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState({ winner: '', reason: '' });
  
  const dispatch = useDispatch();
  
//initialize websocket on page load
useEffect(() => {
    // Initialize socket connection
    initializeSocket();
    
    const socket = getSocket();
    
    // Connection status
    socket.on('connect', () => {
      console.log('✅ Connected to server');
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnectionStatus('disconnected');
    });
    
    // Game events
    socket.on('room_joined', (data) => {
      console.log('🏠 Room joined:', data);
      setRoomId(data.roomId);
      setPlayerNumber(data.playerNumber);
      setGameState('searching');
    });

    socket.on('game_start', (data) => {
      console.log('🎮 Game starting:', data);
      const opponent = data.players.find(p => p.id !== socket.id);
      setOpponentName(opponent.name);
      setGameState('playing');
    });

    socket.on('waiting_for_opponent', () => {
      console.log('⏳ Waiting for opponent...');
      setGameState('searching');
    });

    socket.on('opponent_disconnected', () => {
      // Show winner popup instead of alert
      setWinnerInfo({
        winner: 'You Win! 🎉',
        reason: 'Your opponent has disconnected'
      });
      setShowWinnerPopup(true);
    });

    // Handle when opponent leaves the game intentionally
    socket.on('opponent_left', (data) => {
      console.log('🏆 Opponent left:', data);
      
      // Show winner popup instead of alert
      setWinnerInfo({
        winner: 'You Win! 🎉',
        reason: data.message || 'Your opponent has left the game'
      });
      setShowWinnerPopup(true);
    });

    socket.on('error', (message) => {
      alert(`Error: ${message}`);
      console.error('Socket error:', message);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleBackToMenu = () => {
    // If it's a multiplayer game and we're in an active room, notify the server
    if (isMultiplayer && roomId && gameState === 'playing') {
      const socket = getSocket();
      // Emit an event to notify the server that this player is leaving the game
      socket.emit('leave_game', { 
        roomId: roomId, 
        playerNumber: playerNumber 
      });
    }
    
    // Reset all local state
    setGameState("menu");
    setRoomId(null);
    setPlayerNumber(null);
    setOpponentName(null);
    setScores({ black: 2, white: 2 });
    setIsMultiplayer(false);
    
    // Hide winner popup if it's showing
    setShowWinnerPopup(false);
    setWinnerInfo({ winner: '', reason: '' });
  };
   const handleScoreUpdate = (newScores) => {
    setScores(newScores);
  };
  const handleFindGame =()=>{
    console.log('🔍 Looking for game as:', user);
    const socket = getSocket();
    setGameState('searching');
    setIsMultiplayer(true);
    socket.emit('find_game',{user});
  }
  const handleGameEnd = ({ winner, reason, score }) => {
  setWinnerInfo({ winner, reason, score });
  setShowWinnerPopup(true);
};

  const handleCancelSearch=()=>{
    const socket = getSocket();
    socket.emit('cancel_search');
    setGameState("menu")
    setRoomId(null)
    setPlayerNumber(null)
    setIsMultiplayer(false)
  }

  const handlePlayOffline = () => {
    console.log("Playing offline...");
    setGameState('playing')
    setIsMultiplayer(false);
  }

  const handleLogout = () => {
    dispatch(logout());
    console.log("User logged out");
  }

  // Handle winner popup close
  const handleWinnerPopupClose = () => {
    setShowWinnerPopup(false);
    setWinnerInfo({ winner: '', reason: '' });
    handleBackToMenu();
  };

  const buttons = [
    gameState === "menu"
      ? { title: "Find Game", handleClick: handleFindGame,  disabled: connectionStatus !== "connected" }
      : { title: "Cancel Search", handleClick: handleCancelSearch },
    { title: "Play Offline", handleClick: handlePlayOffline },
    { title: "How to Play", handleClick: () => window.open("https://en.wikipedia.org/wiki/Reversi", "_blank") },
  ];

  const renderGameArea = () => {
    switch(gameState) {
      case 'menu':
        return (
          <div className="static-game-display">
            <img 
              src={othellooo} 
              alt="Othello Game Board" 
              className="static-othello-image"
            />
            <h2>Welcome to Othello</h2>
            <p>Choose an option from the sidebar to start playing!</p>
          </div>
        );
      
      case 'searching':
        return (
          <div className="searching-display">
            <div className="loading-spinner"></div>
            <h2>Searching for opponent...</h2>
            <p>Please wait while we find you a match</p>
          </div>
        );
      
      case 'playing':
        return (
          <Grid 
            roomId={roomId}
            playerNumber={playerNumber}
            isMultiplayer={isMultiplayer} 
            onGameEnd={handleGameEnd}
            onScoreUpdate={handleScoreUpdate}
          />
        );
      
      default:
        return (
          <div className="static-game-display">
            <img 
              src={othellooo} 
              alt="Othello Game Board" 
              className="static-othello-image"
            />
          </div>
        );
    }
  }

  return (
    <div className="home-container">
      <Sidebar 
        gameState={gameState}
        playerNumber={playerNumber}
        opponentName={opponentName}
        scores={scores}
        buttons={buttons}
        handleBackToMenu={handleBackToMenu}
        isAuthenticated={isAuthenticated}
        user={user}
        loading={loading}
        handleLogout={handleLogout}
      />

      <div className="game-area">
        {renderGameArea()}
      </div>

      {/* Winner Popup */}
      <WinnerPopup
        isVisible={showWinnerPopup}
        winner={winnerInfo.winner}
        reason={winnerInfo.reason}
        score={winnerInfo.score}
        onClose={handleWinnerPopupClose}
      />
    </div>
  );
}