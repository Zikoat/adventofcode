import { ass, asseq, nonNull } from "./common";

const test = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const real = `.#......................................#................#....#.......##..........................#.....#......#..................
......#...#...................................#......#...#........#...........................................#.#.................
.....................................................#.......#.............#................#...............#...#...........#.....
..........#...#.......#...........#.......................................#..............#.......#.#......#...............#.......
...#.......................................................................#.................................................#....
.......#.....#................#.......#..................#......#...........#...............................#.....................
.........#.......#..#...........................#........#.........................#..#.....#.....................................
..........#.......##....................#..............##..##..#...#........................................................#.....
................#............................................................#.......................#...#........................
...............................................................................................#...........................#......
#.....#..............#...............#.........#................................................................#........#........
.....#..#.................................#......................................................................#................
............................................#.....................................................................................
.............#....................................#.................#...##........#....#....#.....................................
.............#.............#...........##..............#.........#....#................#....................#.....................
..#..#...#.............#....................................#.........................................................#...........
........................#......#...........#.....#....................#.........................#.................................
.................#................................................................................................................
.........#.......#..........#...............#................................#........................#.........#......#..........
.........................................#.........#..........#.........#........................#......................#.........
.#.....................#.............................#.....................#.............................................#........
...#..#........#...............#......................#..................#........................................#...#...........
..#...........#..........#......#...............#...............................................................#.................
......#..#.............................#.#..............#......#..................................................................
......#..........#....#...#.........#...................................................................#...........#.............
............#....#.....#..............................................#.......#..............#........................#...........
......#.................#...............................................................................#...................#.....
................#................#............................................................................#.....##............
.........#......................................#....#......#.......................................#........##..........#........
#........#.........................................#..........#..............#.......#............................................
.#..........##....................#......................................................................#................#..#....
...........................................#............................#..........................#....................#.........
......#.......................#.............#......................................................................#..............
..#.#.....#...#....#....#......#..................................#...................#...........................................
..#................................#...................................#...#..................................#.......#...........
....#...............#....................................#..#..............#.........#.........#.#..............................#.
..........#......#.........................#.#.................................#...........................................#.....#
..................##.................#...........#................................#.............................................#.
.....#......#................#....................................................#..............#.........................#......
#..............#........#..............................#...........#...............#.....#.............................#..........
..............#.........................#........................................................#..........................#..##.
...............................................................#..............................................#...................
......................#.............................................................##.........#...........................#.#....
.......#................................#................#...........................#...................#.........#..............
.................................................................#...#.............#.....#...............#........................
..............................................................#..#...............................#.......#...............#.#......
.....#.................#......................#..........................................#........................................
..............................#...............#......#..........#........................#................#......#................
.............................................#.........#..................................................................#.......
......#..........................#.............#....................................................#................#............
..................#..............................................#..........................................#.....................
..#.........................................#..............................#...#........................................#..#......
........#........................#................................................................................................
...............#...............................#.............#...........................#........................................
...............................................................................................#....#.............................
............#.....................#...........#.............#.......#..............#.....#.............................#...#......
..........#..........................................................#.#.......#..................................................
...#................................#.....................................................................#...................#...
...#..#...........................#............................#........#.......#.#..........#.......#............................
...................##......................................#..................##..............................#........#..........
................##.....................................................................#....................................#.....
....#......................................................#..............#....#.................................#................
......................#...#............................................................................................#..........
..#......................#.................................................#.....#.....................................##.........
....................##.......................#............#.#....#......#...........#.............#..#................#...#....##.
.....................................................................................#....#..........#............................
..................#...............................................#.....#..#............#.....................##.............#....
......#.................................................................#.....#........#..#.......................................
......#..............................................#........#................#..................................................
........#........#...........#....................#...............................#..........................................#....
.##............................................................#............#..............................................#......
........................#............................#.....#....................#............#....................................
...#......#.............#..#..#........#...............................................................................#..#....#..
#.....#...............................................#...#....#................#....#....................................#.......
.................................#..#...........................................................................................#.
..........#.........................#.....................#............................................#..........................
..............................#........#...................................#..#................................#...#.............#
...#....................#.............................#..............................#..#..#......................................
..........#...................#....................#.....##............................#.....................#....................
.................#..........#.........................##.....................................................#.........#..........
..........................................................#....................................#..........#.......................
.........................................................#.....#..#.................#..............................#..............
................#..................#...............#.............#......#............#.................#...................##.....
...................#.....#...............................#.................................#.........##...........................
......................#..........#..........#...................................#..............#......#...........................
...........................................................#......#...#.....................#.....#.......................#....#..
.....................#.........................#.......#.........#................................#.#....................#......#.
...............................#..............................................#......#.................................#........#.
........#...........................................#...#.........................................#.........................#..#..
..............#............................#.....#.....#.......#...^...........................#................#.........#.......
..........#.#..............#.........#.............#............................................................#.................
.......#..#......#.......................................................................#........................................
..........#..........................##.............#.....#..........#.............................................#..............
................#............#.....#................#....#......................................................#........#........
..#......................##.......................##.....#.....#.............................................#....................
....#...........#.................................................##........................#...#..#..............................
...........#..........................#..........................................#...#............................................
##......#.........#...........#...#................................##................#...................##......#................
.....................#...............#.............#..........#.#..................#....................#.......#.................
...#..#.....#............#.....#......#.#.........................................................................................
...#..............................................................................................................#.........#.....
..................#..........................#.................................................#..................................
..........#...................................#.......#..#.....#.................#............##.#......#........#...#............
.......#....#............................................................................#.......................#................
.......................#...................#..#.......#..#.............#................#.........................................
........#......................#.......#...........#......##................##..#......#.#....#........#..........................
...#..................................#........................#.....#..#.........................................................
..#.......#...........#.........#.##..........#...........................................#...........................#...........
...................#........................................#...........#.................#.#......................#.#............
#......................#.............................#................................#.............#....#...........#............
.........#...........................................#.....#......................................#.......................#.......
.......................#.#...............................#........................................................................
...........................#...............................................................#..............#.......................
.......##..................#..........#......#.....................#.#.............................##..#.................#........
#.#...........#..........................................................#.....#...##......#......................#..#............
..#.............................#................#.#.........##..........................................................#........
.......................................#.......................................#...#.........#.............#......................
....#.##................................................#....................................................#.#...........#......
...#............................#.....#............#..................................#..........................................#
.........#...#..................................#.................#................................#...#..........................
.....................................#.............................#...#..........#.................#........#.......#............
.........##........#.#.....................................................................................................#......
...............................#....#.......#............#......#...................................#...............#.............
....##.#.............................##..........#....#...................#..........................#......#.#.#.................
............#.........#.....#..............................#......................................................................
..........#...#...#.......................#.............#...................#.##.......#.................#......#.................
..#..#..#...............................#.............#.................................................................#...#.....
.......................#..#.......................#..............#............#..........#........#..............................#
.....#...............#...##...........#..................#........................................#.....#.....#...................
....#.....................................#..........#..........#..#.....#...#....#...#...............#..........................#`;

type Tile = {
  obstacle: boolean;
  visited: Dir[];
  placedObstacle: boolean;
  started: boolean;
};

const dirs = ["up", "right", "down", "left"] as const;

type Dir = (typeof dirs)[number];

function checkMap(
  input: string,
  placedobstaclex: number | undefined,
  placedobstacley: number | undefined
): { totalVisited: number; map: Tile[][]; hasLoop: boolean } {
  let guardx: number;
  let guardy: number;
  let guarddir: Dir;

  let totalVisited = 0;

  const map: Tile[][] = input.split("\n").map((row, i) => {
    return row.split("").map((cellChar, j) => {
      let obstacle = false;
      let placedObstacle = false;
      let visited: Dir[] = [];
      let started = false;
      // const tile: Tile = {
      //   obstacle: false,
      //   placedObstacle: false,
      //   visited: [],
      // };

      if (j === placedobstaclex && i === placedobstacley) {
        asseq(cellChar, ".");
        placedObstacle = true;
        obstacle = true;
      }

      if (cellChar === "^") {
        guardx = j;
        guardy = i;
        guarddir = "up" as const;
        visited.push(guarddir);
        totalVisited++;
        started = true;
      } else if (cellChar === ".") {
      } else if (cellChar === "#") {
        obstacle = true;
      } else {
        throw Error("shit");
      }

      return {
        obstacle,
        placedObstacle,
        visited,
        started,
      };
    });
  });
  // console.table(map);

  //@ts-expect-error we assert that it has been assigned
  ass(guardx);
  //@ts-expect-error we assert that it has been assigned
  ass(guardy);
  //@ts-expect-error we assert that it has been assigned
  ass(guarddir);

  while (true) {
    // console.log(guardx, guardy, guarddir);
    let nextx: number;
    let nexty: number;

    if (guarddir === "up") {
      nextx = guardx;
      nexty = guardy - 1;
    } else if (guarddir === "down") {
      nextx = guardx;
      nexty = guardy + 1;
    } else if (guarddir === "left") {
      nextx = guardx - 1;
      nexty = guardy;
    } else if (guarddir === "right") {
      nextx = guardx + 1;
      nexty = guardy;
    } else {
      throw Error("shit");
    }
    ass(typeof nextx === "number", `${nextx}`);
    ass(typeof nexty === "number", `${nexty}`);

    const nextTile = map[nexty]?.[nextx];
    const isObstacle = nextTile?.obstacle;
    // console.log("next", nextx, nexty);
    if (!nextTile) break;

    // shit use this as main thing. could also inline to have x and y delta.
    const directions = ["up", "right", "down", "left"] as const;
    if (isObstacle) {
      guarddir = nonNull(
        directions[
          (directions.findIndex((dir) => dir === guarddir) + 1) %
            directions.length
        ]
      );
      const currentTile = map[guardy]?.[guardx];
      ass(currentTile);

      if (currentTile.visited.includes(guarddir)) {
        return { totalVisited, map, hasLoop: true };
      }

      currentTile.visited.push(guarddir);
    } else {
      guardx = nextx;
      guardy = nexty;
      if (nextTile.visited.length === 0) {
        totalVisited++;
      }

      if (nextTile.visited.includes(guarddir)) {
        return { totalVisited, map, hasLoop: true };
      }

      nextTile.visited.push(guarddir);
    }
  }

  return { totalVisited, map, hasLoop: false };
}

function printMap(map: Tile[][]): void {
  console.log(
    map
      .map((r) =>
        r
          .map((c) => {
            const space = "";
            if (c.placedObstacle) return "O" + space;
            if (c.obstacle) return "#" + space;
            const horizontal =
              c.visited.includes("left") || c.visited.includes("right");
            const vertical =
              c.visited.includes("up") || c.visited.includes("down");
            if (horizontal && vertical) return "+";
            if (horizontal) return "-" + space;
            if (vertical) return "|" + space;
            return "." + space;
          })
          .join("")
      )
      .join("\n")
  );
}

// shit performance by reusing and resetting map. maybe create a new array for visited,

function p(input: string): { p1: number; p2: number } {
  const { map, hasLoop, totalVisited } = checkMap(input, undefined, undefined);
  asseq(hasLoop, false);
  // printMap(map);
  let score = 0;

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    ass(row);
    for (let j = 0; j < row.length; j++) {
      const tile = row[j];
      ass(tile);
      if (tile.visited.length > 0 && !tile.started) {
        const shit = checkMap(input, j, i);
        if (shit.hasLoop) {
          // printMap(shit.map);
          score++;
        }
      }
    }
  }

  return { p2: score, p1: totalVisited };
}

ass(checkMap(test, 3, 6).hasLoop);

asseq(p(test), { p1: 41, p2: 6 });
asseq(p(real), { p1: 4696, p2: 1443 });
