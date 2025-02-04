export type Cell = {
  value: number; // -1: 地雷、0: 地雷なし、1~: 隣接する地雷の数
  revealed: boolean; // マスが開いているか否か
  x: number; // 行インデックス
  y: number; // 列インデックス
  flagged: boolean; // フラグがあるか否か
};

export default function createBoard(
  row: number,
  col: number,
  mines: number
): Cell[][] {
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

  // 周囲のマスに含まれている地雷数を求める
  for (let x = 0; x < row; x++) {
    for (let y = 0; y < col; y++) {
      if (board[x][y].value !== -1) {
        let count = 0;

        for (let y2 = Math.max(y - 1, 0); y2 < Math.min(y + 2, col); y2++) {
          for (let x2 = Math.max(x - 1, 0); x2 < Math.min(x + 2, col); x2++) {
            if (board[x2][y2].value === -1) {
              count++;
            }
          }
        }
        board[x][y].value = count;
      }
    }
  }

  return board;
}
