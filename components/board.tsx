'use client';

import { useState, useEffect } from 'react';
import type { Cell } from '@/game/createBoard';
import createBoard from '@/game/createBoard';
import DisplayCell from '@/components/cell';
export type GameData = {
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

  // フラグをアップデートする関数
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

  // マスを開ける関数
  const handleRevealCell = (x: number, y: number) => {
    if (!gameData) {
      // エラー
      throw new Error('Game data is null. Cannot update flag.');
    }

    if (gameData.board[x][y].revealed) return;

    const newBoard = [...gameData.board];

    // 爆弾だったら全部オープン
    if (newBoard[x][y].value === -1) {
      for (let x = 0; x < newBoard.length; x++) {
        for (let y = 0; y < newBoard[x].length; y++) {
          newBoard[x][y] = { ...newBoard[x][y], revealed: true };
        }
      }
      setGameData({
        ...gameData,
        board: newBoard,
        gameStatus: 'lose',
      });
    }

    // 複数マスオープン
    else if (newBoard[x][y].value === 0) {
      const newReveledData = revealEmpty(x, y, gameData);

      setGameData({
        ...gameData,
        board: newReveledData.board,
      });
    }

    // 1マスオープン
    else {
      newBoard[x][y] = { ...newBoard[x][y], revealed: true };

      setGameData({
        ...gameData,
        board: newBoard,
        cellsWithoutMines: gameData.cellsWithoutMines--,
      });
    }
  };

  // 複数オープン用の関数
  const revealEmpty = (x: number, y: number, data: GameData): GameData => {
    if (data.board[x][y].revealed) return data;

    data.board[x][y].revealed = true;
    data.cellsWithoutMines--;

    if (data.cellsWithoutMines === 0) {
      data.gameStatus = 'win';
    }

    if (data.board[x][y].value === 0) {
      for (let y2 = Math.max(y - 1, 0); y2 < Math.min(y + 2, col); y2++) {
        for (let x2 = Math.max(x - 1, 0); x2 < Math.min(x + 2, col); x2++) {
          if (x2 != x || y2 != y) {
            revealEmpty(x2, y2, data);
          }
        }
      }
    }

    return data;
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
              gameData={gameData}
              onUpdateFlag={handleUpdateFlag}
              onOpen={handleRevealCell}
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
