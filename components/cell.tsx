import { useState } from 'react';
import { Cell } from '@/game/createBoard';
import type { GameData } from '@/components/board';
export default function DisplayCell({
  cell,
  gameData,
  onUpdateFlag,
  onOpen,
}: {
  cell: Cell;
  gameData: GameData;
  onUpdateFlag: (x: number, y: number) => void;
  onOpen: (x: number, y: number, data: GameData) => void;
}) {
  const [pressTimeout, setPressTimeout] = useState<NodeJS.Timeout | null>(null);

  const LONG_PRESS_TIME = 200;

  const handleMouseDown = () => {
    // 200ms後にクリックとみなす
    const timeout = setTimeout(() => {
      onUpdateFlag(cell.x, cell.y);
    }, LONG_PRESS_TIME);

    setPressTimeout(timeout);
  };

  // マウスアップでタイマーをクリア
  const handleMouseUp = () => {
    if (pressTimeout) {
      clearTimeout(pressTimeout);
    }
  };

  // マウスがセル外に出た場合もタイマーをクリア
  const handleMouseLeave = () => {
    if (pressTimeout) {
      clearTimeout(pressTimeout);
    }
  };

  return (
    <button
      className={`
        w-8 h-8 border border-gray-300 text-center leading-8 font-bold
        ${cell.revealed ? 'bg-gray-200' : 'bg-gray-500'}
        ${cell.flagged ? 'bg-gray-400' : ''}
        ${cell.revealed && cell.value === -1 ? 'bg-red-200' : ''}
        ${cell.value === 1 ? 'text-sky-500' : ''}
        ${cell.value === 2 ? 'text-lime-500' : ''}
        ${cell.value === 3 ? 'text-orange-500' : ''}
        ${cell.value >= 4 ? 'text-red-500' : ''}
        cursor-pointer
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(cell.x, cell.y, gameData)}
    >
      {/* セルが開かれている場合は地雷（💣）または隣接する地雷の数を表示 */}
      {cell.revealed ? (cell.value === -1 ? '💣' : cell.value || '') : ''}

      {cell.flagged ? '🚩' : ''}
    </button>
  );
}
