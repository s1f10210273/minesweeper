import { useState } from 'react';
import { Cell } from '@/game/createBoard';

export default function DisplayCell({
  cell,
  onUpdateFlag,
}: {
  cell: Cell;
  onUpdateFlag: (x: number, y: number) => void;
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
        w-10 h-10 border border-gray-300 text-center leading-10
        ${cell.revealed ? 'bg-gray-200' : 'bg-gray-500'}
        ${cell.flagged ? 'bg-gray-400' : ''}
        cursor-pointer
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* セルが開かれている場合は地雷（💣）または隣接する地雷の数を表示 */}
      {cell.revealed ? (cell.value === -1 ? '💣' : cell.value) : ''}

      {cell.flagged ? '🚩' : ''}
    </button>
  );
}
