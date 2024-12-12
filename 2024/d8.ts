import { differ } from "effect/RuntimeFlags";
import { ass, asseq } from "../2023/ts/common";
import { add, diff, div, negate, type Vector } from "./common";

const test = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
const real = `....K..........................8.................z
.....n..............r...........z.................
.......................w....8.............3...E...
.....Q.....U..4.........8.........................
...............rc...w........i....................
...........K.........i..2.........................
..................4.....i.........................
K.....n....................w...........z..........
..U......Q........................I...............
..........i.....I.....Q....g....................5E
..Q......................................5........
..........c............8......w...g..........5....
.............................I.O..................
.Z.............4....b.....................k.......
..n........4......r..g..6..c.............3........
....Z............c................................
...................................x..............
.......................................O..........
...............U...................E..........5...
.....f..........................OI3......k........
..m.......o......F.......R........x...............
m...........o..v6..3...............X..............
..............H6v.....F.g.....................W...
...........o....Fb....v...............E...........
...Z.............a................................
......U6.............V............................
.9.............b..............pTk.................
.......m........V.........H1....x.................
...m.................H....................MX......
............t.a............H......................
........Z...a............v.....1..T..p.W..X.......
.............................9...x.......p........
.....J.....................V..1................0..
...........r..j..........a............pT..........
.G..................J...N......f..................
...........G......T....B........W.e...........M...
..........j.............Rk.............M..........
.........q.............MB......R.F..1..P....X...f.
............................V....o...........h....
...........................................W......
......b......u............................e.......
.............................................0....
..CA....Gt..O........................7.....e....0.
C.u......A..9J..N........................h.....e..
uj....q..........N.2..................7...........
G....N.....uJ...............................0.....
.................B................P.......h.......
...C....q...........R.........P...................
.....q..tC....2.9.....B............P....f.........
...............2.................................7`;
const testT = `T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`;

asseq(p2(test), 34);
asseq(p2(testT), 9);
asseq(p2(real), 1182);

function p2(input: string): number {
  const frequenciesMap: Record<string, Vector[]> = {};

  const map = input.split("\n").map((row, y) =>
    row.split("").map((char, x) => {
      if (char === ".") return ".";
      let antennasForFreq = frequenciesMap[char];
      if (!antennasForFreq) {
        frequenciesMap[char] = [];
        antennasForFreq = frequenciesMap[char];
      }
      antennasForFreq.push({ x, y });
      return char;
    })
  );

  const antinodes: boolean[][] = [];
  let score = 0;

  const frequencies = Object.values(frequenciesMap);
  for (const frequency of frequencies) {
    const antennas = frequency;

    for (let i = 0; i < antennas.length; i++) {
      const firstAntenna = antennas[i];
      for (let j = i + 1; j < antennas.length; j++) {
        // console.log(i, j);
        const secondAntenna = antennas[j];
        ass(firstAntenna);
        ass(secondAntenna);

        const delta = diff(firstAntenna, secondAntenna);
        // console.log(delta);
        const commonDivisor = gcd(delta.x, delta.y);

        const smallDelta = div(delta, commonDivisor);

        const directions = [smallDelta, negate(smallDelta)];

        for (const direction of directions) {
          let currentPosition = firstAntenna;
          while (true) {
            const isInBounds = !!map[currentPosition.y]?.[currentPosition.x];
            // console.log("curpos:", currentPosition.x, currentPosition.y);
            if (!isInBounds) {
              // console.log("out of bounds");
              break;
            }

            // const curpos= { x: ian.x + difference.x, y: ian.y + difference.y };
            // console.log(antinode);
            let antinodeRow = antinodes[currentPosition.y];
            if (!antinodeRow) {
              antinodes[currentPosition.y] = [];
              antinodeRow = antinodes[currentPosition.y];
              ass(antinodeRow);
            }

            // // we could go through the antinodes and count instead of doing this logic. might be easier, but this is more perf?
            if (!antinodeRow[currentPosition.x]) {
              score++;
            }
            antinodeRow[currentPosition.x] = true;
            const row = map[currentPosition.y];
            ass(row);
            row[currentPosition.x] = "#";
            // console.table(map);

            currentPosition = add(currentPosition, direction);
            // break;
          }
        }
      }
    }
  }

  // console.table(antinodes);
  // console.table(shit);

  return score;
}

asseq(gcd(48, 18), 6);
asseq(gcd(3, 2), 1);

function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}