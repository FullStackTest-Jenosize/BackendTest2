import { useState, useRef } from "react";
import styles from "../styles/xogame.module.css";
import Image from "next/image";

const xIconPath = "/penguinX.png";
const oIconPath = "/penguinO.png";

export default function Home() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [player, setPlayer] = useState("X"); //ให้ user เป็น X
  const [winner, setWinner] = useState("");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const timeoutRef = useRef(null);

  const handleClick = async (index) => {
    if (!isPlayerTurn || board[index] !== "" || winner) {
      return;
    }

    setIsPlayerTurn(false);

    const updatedBoard = [...board];
    updatedBoard[index] = player;

    setBoard(updatedBoard);

    const response = await fetch("/api/make-move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ board: updatedBoard, player }),
    });

    const data = await response.json();
    setBoard(data.board);

    if (data.winner) {
      setWinner(data.winner);
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsPlayerTurn(true);
      }, 1000);
    }
  };

  const resetGame = () => {
    clearTimeout(timeoutRef.current);
    setBoard(Array(9).fill(""));
    setPlayer("X");
    setWinner("");
    setIsPlayerTurn(true);
  };

  const renderSquare = (index) => {
    const iconPath = board[index] === "X" ? xIconPath : oIconPath;
    const icon = (
      <Image src={iconPath} alt={board[index]} width={60} height={60} />
    );
    return (
      <div className={styles.square} onClick={() => handleClick(index)}>
        {board[index] && icon}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1>Game XO</h1>
      <div className={styles.board}>
        {Array.from(Array(3), (_, row) => (
          <div className={styles.row} key={row}>
            {Array.from(Array(3), (_, col) => {
              const index = row * 3 + col;
              return renderSquare(index);
            })}
          </div>
        ))}
      </div>
      {winner && (
        <div className={styles.winner}>
          {winner !== "Draw" ? (
            <p>Winner: {winner}</p>
          ) : (
            <p>{"It's a draw!"}</p>
          )}
          <button className={styles.button} onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
