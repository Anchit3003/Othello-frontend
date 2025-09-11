import React, { useState, useEffect, useRef } from "react";
import {
  BOARD_SIZE,
  BOARD_COLOR,
  GRID_COLOR,
} from "../constants/gameConstants";
import { drawDisc } from "./Disc";
import WinnerPopup from "./WinnerPopup";
import { getSocket } from "../socket";
import "./Grid.css";

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1],  [1, 0], [1, 1],
];

const Grid = ({ roomId, playerNumber, isMultiplayer = false, onGameEnd, onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(400); // Default size
  const [board, setBoard] = useState(() => {
    const initial = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0));
    initial[3][3] = 2;
    initial[3][4] = 1;
    initial[4][3] = 1;
    initial[4][4] = 2;
    return initial;
  });

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [validMoves, setValidMoves] = useState([]);
  const [score, setScore] = useState({ black: 2, white: 2 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  // Responsive canvas size
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const size = Math.min(
          containerRef.current.offsetWidth,
          window.innerHeight * 0.8
        );
        setCanvasSize(size);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMultiplayer) {
      setIsMyTurn(currentPlayer === playerNumber);
    } else {
      setIsMyTurn(true);
    }
  }, [currentPlayer, playerNumber, isMultiplayer]);

  useEffect(() => {
    if (gameOver && winner && onGameEnd) {
      const finalScore = calculateScore(board);
      onGameEnd({
        winner: winner === "Draw" ? "Draw" : `${winner} Wins!`,
        reason: "Game completed",
        score: finalScore,
      });
    }
    // eslint-disable-next-line
  }, [gameOver, winner]);

  useEffect(() => {
    if (isMultiplayer) {
      const socket = getSocket();
      const handleMoveReceived = (data) => {
        if (data.playerId !== socket.id) {
          setBoard(data.board);
          setCurrentPlayer(data.currentPlayer);
        }
      };
      const handleGameEnded = (data) => {
        setGameOver(true);
        setWinner(data.winner);
      };
      socket.on('move_made', handleMoveReceived);
      socket.on('game_ended', handleGameEnded);
      return () => {
        socket.off('move_made', handleMoveReceived);
        socket.off('game_ended', handleGameEnded);
      }
    }
  }, [isMultiplayer]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    let animationFrameId;
    let t = 0;
    const cellSize = canvasSize / BOARD_SIZE;

    const animate = () => {
      drawBoard(ctx, canvasSize, cellSize);
      drawPieces(ctx, cellSize);

      if (!gameOver && isMyTurn) {
        const alpha = (Math.sin(t) + 1) / 2;
        highlightMoves(ctx, cellSize, alpha);
      }

      t += 0.05;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [board, validMoves, gameOver, isMyTurn, canvasSize]);

  useEffect(() => {
    if (gameOver) return;
    const moves = getValidMoves(board, currentPlayer);
    if (moves.length === 0) {
      const otherPlayer = currentPlayer === 1 ? 2 : 1;
      const otherMoves = getValidMoves(board, otherPlayer);

      if (otherMoves.length > 0) {
        setCurrentPlayer(otherPlayer);
        setValidMoves(otherMoves);
      } else {
        setGameOver(true);
        const finalScore = calculateScore(board);
        let gameWinner;
        if (finalScore.black > finalScore.white) gameWinner = "Black";
        else if (finalScore.white > finalScore.black) gameWinner = "White";
        else gameWinner = "Draw";
        setWinner(gameWinner);

        if (isMultiplayer) {
          const socket = getSocket();
          socket.emit('game_over', {
            roomId,
            winner: gameWinner,
            score: finalScore,
          });
        }
      }
    } else {
      setValidMoves(moves);
    }

    updateScore(board);
  }, [board, currentPlayer, gameOver, isMultiplayer, roomId]);

  const calculateScore = (board) => {
    let black = 0, white = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === 1) black++;
        if (board[r][c] === 2) white++;
      }
    }
    return { black, white };
  };

  const drawBoard = (ctx, size, cellSize) => {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = BOARD_COLOR;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 2;

    for (let i = 0; i <= BOARD_SIZE; i++) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }
  };

  const updateScore = (board) => {
    const newScore = calculateScore(board);
    setScore(newScore);
    onScoreUpdate(newScore);
  };

  const drawPieces = (ctx, cellSize) => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === 1) {
          drawDisc(ctx, r, c, "black", cellSize);
        }
        if (board[r][c] === 2) {
          drawDisc(ctx, r, c, "white", cellSize);
        }
      }
    }
  };

  const highlightMoves = (ctx, cellSize, alpha) => {
    const baseAlpha = 0.5;
    const variation = 0.5;
    ctx.fillStyle = `rgba(128, 128, 128, ${baseAlpha + alpha * variation})`;
    validMoves.forEach(([r, c]) => {
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(x, y, cellSize / 8, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const handleClick = (e) => {
    if (gameOver) return;
    if (isMultiplayer && !isMyTurn) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const cellSize = canvasSize / BOARD_SIZE;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    if (!validMoves.some(([r, c]) => r === row && c === col)) return;

    const newBoard = board.map(rowArr => [...rowArr]);
    newBoard[row][col] = currentPlayer;

    flipDiscs(newBoard, row, col, currentPlayer);

    let nextPlayer = currentPlayer === 1 ? 2 : 1;
    const nextValidMoves = getValidMoves(newBoard, nextPlayer);

    if (nextValidMoves.length === 0) {
      nextPlayer = currentPlayer;
      const currentValidMoves = getValidMoves(newBoard, currentPlayer);
      if (currentValidMoves.length === 0) {
        setGameOver(true);
        const finalScore = calculateScore(newBoard);
        let gameWinner;
        if (finalScore.black > finalScore.white) gameWinner = "Black";
        else if (finalScore.white > finalScore.black) gameWinner = "White";
        else gameWinner = "Draw";
        setWinner(gameWinner);

        if (isMultiplayer) {
          const socket = getSocket();
          socket.emit('game_over', {
            roomId,
            winner: gameWinner,
            score: finalScore
          });
        }
        return;
      }
    }

    setBoard(newBoard);
    setCurrentPlayer(nextPlayer);

    if (isMultiplayer) {
      const socket = getSocket();
      socket.emit('make_move', {
        roomId,
        row,
        col,
        board: newBoard,
        currentPlayer: nextPlayer
      });
    }
  };

  const flipDiscs = (newBoard, row, col, player) => {
    const opponent = player === 1 ? 2 : 1;
    directions.forEach(([dr, dc]) => {
      let r = row + dr, c = col + dc;
      const discsToFlip = [];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (newBoard[r][c] === opponent) {
          discsToFlip.push([r, c]);
          r += dr;
          c += dc;
        } else if (newBoard[r][c] === player) {
          discsToFlip.forEach(([fr, fc]) => newBoard[fr][fc] = player);
          break;
        } else {
          break;
        }
      }
    });
  };

  const getValidMoves = (board, player) => {
    const opponent = player === 1 ? 2 : 1;
    const moves = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] !== 0) continue;
        let valid = false;
        for (let [dr, dc] of directions) {
          let nr = r + dr, nc = c + dc;
          let foundOpponent = false;
          while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
            if (board[nr][nc] === opponent) {
              foundOpponent = true;
              nr += dr;
              nc += dc;
            } else if (board[nr][nc] === player && foundOpponent) {
              valid = true;
              break;
            } else break;
          }
          if (valid) break;
        }
        if (valid) moves.push([r, c]);
      }
    }
    return moves;
  };

  const resetGame = () => {
    const initial = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0));
    initial[3][3] = 2;
    initial[3][4] = 1;
    initial[4][3] = 1;
    initial[4][4] = 2;
    setBoard(initial);
    setCurrentPlayer(1);
    setScore({ black: 2, white: 2 });
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="othello-container" ref={containerRef}>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className={`othello-canvas ${isMultiplayer && !isMyTurn ? 'disabled' : ''}`}
        onClick={handleClick}
        style={{
          cursor: isMultiplayer && !isMyTurn ? 'not-allowed' : 'pointer',
          opacity: isMultiplayer && !isMyTurn ? 0.7 : 1,
          maxWidth: "100%",
          height: "auto"
        }}
      />
    </div>
  );
};

export default Grid;