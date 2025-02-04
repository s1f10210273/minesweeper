'use client';

import { useState, useEffect } from 'react';
import type { Cell } from '@/game/createBoard';
import createBoard from '@/game/createBoard';
import DisplayCell from '@/components/cell';
type GameData = {
  board: Cell[][];
  gameStatus?: string | undefined;
  cellsWithoutMines: number;
  numOfMines: number;
};

interface BoardProps {
  row: number;
  col: number;
  mines: number;
}

export default function Board({ row, col, mines }: BoardProps) {
  const [gameData, setGameData] = useState<GameData | null>(null);

  // useEffectでゲームボードを作成
  useEffect(() => {
    const newBoard = createBoard(row, col, mines);

    setGameData({
      board: newBoard,
      gameStatus: 'Game in Progress',
      cellsWithoutMines: row * col - mines,
      numOfMines: mines,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleUpdateFlag = (x: number, y: number) => {
  //   if (gameData?.board[x][y].revealed) return;

  //   setGameData((prev) => {
  //     if (!prev) {
  //       // エラー
  //       throw new Error('Game data is null. Cannot update flag.');
  //     }
  //     const newBoard = [...prev.board];
  //     const newNumOfMines = prev.numOfMines;
  //     const cell = newBoard[x][y];
  //     cell.flagged = !cell.flagged;
  //     console.log('clicked');
  //     console.log(newBoard);

  //     return {
  //       ...prev,
  //       numOfMines: newNumOfMines,
  //       board: newBoard,
  //     };
  //   });
  // };

  const handleUpdateFlag = (x: number, y: number) => {
    if (!gameData) {
      // エラー
      throw new Error('Game data is null. Cannot update flag.');
    }

    if (gameData.board[x][y].revealed) return;

    const newBoard = [...gameData.board];
    const newNumOfMines = gameData.numOfMines;
    const cell = newBoard[x][y];

    cell.flagged = !cell.flagged;

    setGameData({
      ...gameData,
      board: newBoard,
      numOfMines: newNumOfMines,
    });
  };

  if (!gameData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">MineSweeper</h1>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${col}, 40px)`,
        }}
      >
        {gameData.board.map((row, x) =>
          row.map((cell, y) => (
            <DisplayCell
              key={`${x}-${y}`}
              cell={cell}
              onUpdateFlag={handleUpdateFlag}
            />
          ))
        )}
      </div>

      <div className="mt-4">
        <p>Status: {gameData.gameStatus}</p>
        <p>Cells without mines: {gameData.cellsWithoutMines}</p>
        <p>Number of mines: {gameData.numOfMines}</p>
      </div>
    </div>
  );
}
