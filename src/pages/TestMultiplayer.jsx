// TestMultiplayer.jsx - A simple component to test multiplayer without any dependencies
import React, { useEffect, useState } from "react";
import Grid from "../components/Grid";
import { initializeSocket, disconnectSocket, getSocket } from '../socket';

export default function TestMultiplayer() {
  const [gameState, setGameState] = useState('menu');
  const [roomId, setRoomId] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // Generate a random player name for testing
  const [playerName] = useState(`TestPlayer_${Math.random().toString(36).substring(2, 6)}`);

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
      setOpponentName(opponent?.name || 'Anonymous');
      setGameState('playing');
    });

    socket.on('waiting_for_opponent', () => {
      console.log('⏳ Waiting for opponent...');
      setGameState('searching');
    });

    socket.on('opponent_disconnected', () => {
      alert('Your opponent has disconnected');
      handleBackToMenu();
    });

    socket.on('error', (message) => {
      alert(`Error: ${message}`);setConnectionStatus
      console.error('Socket error:', message);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleFindGame = () => {
    console.log('🔍 Looking for game as:', playerName);
    const socket = getSocket();
    setGameState('searching');
    socket.emit('find_game', { playerName });
  };

  const handleCancelSearch = () => {
    const socket = getSocket();
    socket.emit('cancel_search');
    setGameState('menu');
    setRoomId(null);
    setPlayerNumber(null);
  };

  const handleBackToMenu = () => {
    const socket = getSocket();
    if (roomId) {
      socket.emit('leave_room', roomId);
    }
    setGameState('menu');
    setRoomId(null);
    setPlayerNumber(null);
    setOpponentName(null);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5' 
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: '300px', 
        background: 'white', 
        padding: '20px', 
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>🎯 Othello Test</h2>
        
        {/* Connection Status */}
        <div style={{ 
          padding: '10px', 
          borderRadius: '8px', 
          background: connectionStatus === 'connected' ? '#d4edda' : '#f8d7da',
          color: connectionStatus === 'connected' ? '#155724' : '#721c24',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {connectionStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
        </div>

        {/* Player Info */}
        <div style={{ 
          background: '#e9ecef', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>Your Name:</strong> {playerName}
        </div>

        {/* Game Controls */}
        {gameState === 'menu' && (
          <div>
            <button 
              onClick={handleFindGame}
              disabled={connectionStatus !== 'connected'}
              style={{
                width: '100%',
                padding: '15px',
                background: connectionStatus === 'connected' ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
                marginBottom: '15px'
              }}
            >
              🎮 Find Game
            </button>
            <div style={{ 
              background: '#fff3cd', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #ffeaa7'
            }}>
              <h4 style={{ margin: '0 0 10px 0' }}>How to Test:</h4>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Open this page in two browser tabs</li>
                <li>Click "Find Game" in both tabs</li>
                <li>Watch them get matched automatically!</li>
              </ol>
            </div>
          </div>
        )}
        
        {gameState === 'searching' && (
          <div style={{ textAlign: 'center' }}>
            <p>🔍 Searching for opponent...</p>
            <div style={{
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px auto'
            }}></div>
            <button 
              onClick={handleCancelSearch}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ❌ Cancel
            </button>
            <p style={{ 
              fontSize: '12px', 
              color: '#666', 
              fontStyle: 'italic',
              marginTop: '15px' 
            }}>
              Open another tab to test instantly!
            </p>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div>
            <div style={{ 
              background: '#d1ecf1', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <p><strong>🏠 Room:</strong> {roomId}</p>
              <p><strong>🎯 You:</strong> {playerNumber === 1 ? 'Black ⚫' : 'White ⚪'}</p>
              <p><strong>👤 Opponent:</strong> {opponentName}</p>
            </div>
            <button 
              onClick={handleBackToMenu}
              style={{
                width: '100%',
                padding: '10px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🏠 Back to Menu
            </button>
          </div>
        )}
      </div>
      
      {/* Game Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        {gameState === 'playing' ? (
          <Grid 
            roomId={roomId}
            playerNumber={playerNumber}
            isMultiplayer={true}
          />
        ) : (
          <div style={{ 
            textAlign: 'center',
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            {gameState === 'menu' && (
              <div>
                <h3 style={{ color: '#333' }}>🎯 Ready to Play?</h3>
                <p style={{ color: '#666' }}>
                  Click "Find Game" to get matched with another player!
                </p>
              </div>
            )}
            {gameState === 'searching' && (
              <div>
                <h3 style={{ color: '#667eea' }}>🔍 Finding Your Opponent...</h3>
                <p style={{ color: '#666' }}>
                  We're looking for another player for you.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}