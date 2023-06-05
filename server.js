const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    server.use(express.json());

// ฟังก์ชันสำหรับตรวจสอบชนะ
const checkWin = (board, player) => {
    const winningCombos = [
      // ตำแหน่งที่ชนะในแนวนอน
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // ตำแหน่งที่ชนะในแนวตั้ง
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // ตำแหน่งที่ชนะในแนวทะแยง
      [0, 4, 8],
      [2, 4, 6]
    ];
  
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return true;
      }
    }
  
    return false;
  };
  
  // ฟังก์ชันสำหรับทำการเดินของ Bot
  const makeBotMove = (board, player) => {
    const emptySquares = board.reduce((acc, val, index) => {
      if (val === '') {
        acc.push(index);
      }
      return acc;
    }, []);
  
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const botMove = emptySquares[randomIndex];
  
    return botMove;
  };
  
  server.post('/api/make-move', (req, res) => {
    const { board, player } = req.body;
  
    const isPlayerWinner = checkWin(board, player);
  
    if (isPlayerWinner) {
      res.status(200).json({ board, winner: player });
    } else {
      const botMove = makeBotMove(board, player);
      board[botMove] = player === 'X' ? 'O' : 'X';
      const isBotWinner = checkWin(board, board[botMove]);
  
      if (isBotWinner) {
        res.status(200).json({ board, winner: board[botMove] });
      } else {
        res.status(200).json({ board });
      }
    }
  });
  
    server.get('/api/data', (req, res) => {
      res.json({ message: 'Hello from Express!' });
    });

// ให้ Next.js จัดการเส้นทางที่ไม่ได้ถูกจัดการโดย Express.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});