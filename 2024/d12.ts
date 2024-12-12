import { ass } from "./common";

const test = `AAAA
BBCD
BBCC
EEEC `;

const areas: number[][] = [];
const map = test.split("\n").map((row) => row.split(""));

let maxId = 0;
for (let y = 0; y < map.length; y++) {
  const row = map[y];
  ass(row);
  for (let x = 0; x < row.length; x++) {
    const cell = row[x];
    ass(cell);

    let id: number | undefined;
    if (map[y + 1]?.[x] === cell) {
      id = areas[y + 1]?.[x];
    } else if (map[y - 1]?.[x] === cell) {
      id = areas[y - 1]?.[x];
    } else if (map[y]?.[x + 1] === cell) {
      id = areas[y]?.[x + 1];
    } else if (map[y]?.[x - 1] === cell) {
      id = areas[y]?.[x - 1];
    }

    if (id === undefined) {
      id = maxId;
      maxId++;
    }

    let areasRow = areas[y];
    if (areasRow === undefined) {
      areasRow = [];
      areas[y] = areasRow;
    }
    areasRow[x] = id;
  }
}
