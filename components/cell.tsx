import type { Cell } from '@/game/createBoard';

export default function DisplayCell({ cell }: { cell: Cell }) {
  return (
    <div
      className={`
        w-10 h-10 border border-gray-300 text-center leading-10
        ${cell.revealed ? 'bg-gray-200' : 'bg-gray-500'}
        ${cell.flagged ? 'bg-yellow-200' : ''}
        cursor-pointer
      `}
    >
      {/* 必要に応じてセルの内容を表示 */}
      {cell.revealed ? (cell.value === -1 ? '💣' : cell.value) : ''}
    </div>
  );
}
