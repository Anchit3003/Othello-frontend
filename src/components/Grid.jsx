import React, { useState, useEffect, useRef } from "react";
import {
  BOARD_SIZE,
  CANVAS_SIZE,
  CELL_SIZE,
  BOARD_COLOR,
  GRID_COLOR,
} from "../constants/gameConstants";
import { drawDisc } from "./Disc";

import "./Grid.css";
const Grid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = BOARD_COLOR;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    for (let i = 0; i <= BOARD_SIZE; i++) {
      const pos = i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(CANVAS_SIZE, pos);
      ctx.stroke();
    }
    drawDisc(ctx, 3, 3, "white", CELL_SIZE);
    drawDisc(ctx, 3, 4, "black", CELL_SIZE);
    drawDisc(ctx, 4, 3, "black", CELL_SIZE);
    drawDisc(ctx, 4, 4, "white", CELL_SIZE);

  }, []);
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="othello-canvas"
    />
  );
};

export default Grid;
