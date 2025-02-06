'use client';

import { useState, useEffect } from 'react';
import type { Cell } from '@/game/createBoard';
import createBoard from '@/game/createBoard';
import DisplayCell from '@/components/cell';
import Loading from '@/components/Loading';

export type GameData = {
  board: Cell[][];
  gameStatus?: string | undefined;
  cellsWithoutMines: number;
  numOfMines: number;
  numOfFlags: number;
};

interface BoardProps {
  row: number;
  col: number;
  mines: number;
}

export default function Board({ row, col, mines }: BoardProps) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null); // ゲーム開始時間
  const [elapsedTime, setElapsedTime] = useState<number>(0); // 経過時間
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    // 右クリックを無効にするイベントリスナー
    const disableRightClick = (e: MouseEvent) => {
      if (e.button === 2) {
        // 右クリック（button === 2）
        e.preventDefault();
      }
    };

    // ボード内で右クリックを無効にする
    document.addEventListener('contextmenu', disableRightClick);

    // クリーンアップ
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
    };
  }, []);

  useEffect(() => {
    const newBoard = createBoard(row, col, mines);

    setGameData({
      board: newBoard,
      gameStatus: 'Game in Progress',
      cellsWithoutMines: row * col - mines,
      numOfMines: mines,
      numOfFlags: mines,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // ゲームが進行中であれば経過時間を更新
    if (gameData?.gameStatus === 'Game in Progress') {
      const interval = setInterval(() => {
        if (startTime) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); // 秒単位で経過時間
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    // ゲームが終了したらタイマーを止める
    return () => {};
  }, [gameData?.gameStatus, startTime]);

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

    // フラグの数に応じて残りのフラグを設定
    if (cell.flagged === false) {
      gameData.numOfFlags--;
    } else {
      gameData.numOfFlags++;
    }

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
    // フラグを立ててたら開けられない
    if (gameData.board[x][y].flagged) return;

    const newBoard = [...gameData.board];

    // 爆弾だったら全部オープン
    if (newBoard[x][y].value === -1) {
      for (let x = 0; x < newBoard.length; x++) {
        for (let y = 0; y < newBoard[x].length; y++) {
          newBoard[x][y] = {
            ...newBoard[x][y],
            revealed: true,
            flagged: false,
          };
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
      gameData.cellsWithoutMines--;

      if (gameData.cellsWithoutMines === 0) {
        gameData.gameStatus = 'win';
      }

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
    data.board[x][y].flagged = false;
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

  const handleReset = () => {
    // window.location.href を使って遷移
    window.location.href = '/';
  };

  const handleStart = () => {
    setIsStart(!isStart);

    // ゲーム開始時間を記録
    setStartTime(Date.now());
  };

  if (!gameData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      {isStart ? (
        <>
          <div className="px-6 grid grid-cols-2 gap-4 w-full max-w-xs mx-auto mb-4 text-xl">
            {/* 地雷数 */}
            <div className="flex items-center space-x-2">
              <span>💣</span>
              <span>{gameData.numOfFlags}</span>
            </div>

            {/* ゲーム経過時間 */}
            <div className="flex items-center space-x-2 justify-end">
              <span>🕰️</span>
              <span>{elapsedTime}</span>
            </div>
          </div>

          {/* グリッドコンテナ */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${col}, minmax(20px, 1fr))`,
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

          {/* ゲーム情報 */}
          {(gameData.gameStatus === 'win' ||
            gameData.gameStatus === 'lose') && (
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
          )}
          {/* ステータスメッセージ */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-center">
            {(gameData.gameStatus === 'win' ||
              gameData.gameStatus === 'lose') && (
              <>
                <p className="text-3xl font-semibold mb-4">
                  {gameData.gameStatus === 'win' ? 'You Win!' : 'Game Over!'}
                </p>
                {/* リセットボタン */}
                <button
                  className="bg-gray-700 text-white py-2 px-6 rounded-full shadow-md"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-center">
            <>
              <p className="text-3xl font-semibold mb-4">Game Start</p>
              {/* リセットボタン */}
              <button
                className="bg-gray-700 text-white py-2 px-6 rounded-full shadow-md"
                onClick={handleStart}
              >
                Start
              </button>
            </>
          </div>
        </>
      )}
    </div>
  );
}
