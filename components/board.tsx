'use client';

import { useState, useEffect } from 'react';
import type { Cell } from '@/game/createBoard';
import createBoard from '@/game/createBoard';
import DisplayCell from '@/components/cell';
type GameData = {
  board: Cell[][];
  gameStatus: string;
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
  }, [row, col, mines]); // 依存関係

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
          row.map((cell, y) => <DisplayCell key={`${x}-${y}`} cell={cell} />)
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
