type Cell = {
  value: number; // -1: 地雷、0: 地雷なし、1~: 隣接する地雷の数
  revealed: boolean; // マスが開いているか否か
  x: number; // 行インデックス
  y: number; // 列インデックス
  flagged: boolean; // フラグがあるか否か
};

export const createBoard = (
  row: number,
  col: number,
  mines: number
): Cell[][] => {
  const board: Cell[][] = [];

  // 各マスのデータは2次元配列として管理する
  for (let x = 0; x < row; x++) {
    const r: Cell[] = [];
    for (let y = 0; y < col; y++) {
      r.push({
        value: 0,
        revealed: false,
        x: x,
        y: y,
        flagged: false,
      });
    }
    board.push(r);
  }

  // 地雷を埋め込む
  let mineCount = 0;
  while (mineCount < mines) {
    const x = Math.floor(Math.random() * row);
    const y = Math.floor(Math.random() * col);
    if (board[x][y].value === 0) {
      board[x][y].value = -1; // 地雷を配置
      mineCount++;
    }
  }

  return board;
};
