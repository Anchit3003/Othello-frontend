import React from "react";
import Grid from "../components/Grid";
import "./Home.css";
import OthelloMain from "../components/OthelloMain";
import othellooo from "../assets/othellooo.png";
export default function Home() {
  return (
    <div className="home-container">
    
      <aside className="side-nav">
      <div className="header">
          <img src={othellooo} alt="Othello Logo" className="logo" />
          <h2>Othello Game</h2>
        </div>

      </aside>
      <div className="game-area">
        {/* <Grid /> */}
        <OthelloMain />
      </div>
    </div>
  );
}