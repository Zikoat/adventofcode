import { Schema } from "effect";
import { add, ass, asseq, nonNull, type Vector } from "./common";
import { update } from "effect/Differ";

const width = 11;
const height = 7;
const shit = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;
// const shit = `p=2,4 v=2,-3`;
const shit2 = shit.matchAll(/^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/gm).toArray();
const mySchema = Schema.Array(
  Schema.Tuple(
    Schema.String,
    Schema.NumberFromString,
    Schema.NumberFromString,
    Schema.NumberFromString,
    Schema.NumberFromString
  )
);
const shit3 = Schema.decodeUnknownSync(mySchema)(shit2);

type Robot = {
  position: Vector;
  velocity: Vector;
};

const robots: Robot[] = shit3.map((s) => {
  return { position: { x: s[1], y: s[2] }, velocity: { x: s[3], y: s[4] } };
});
asseq(robots.length, 12);

function updatePosition(robot: Robot | undefined): Robot {
  ass(robot);
  robot.position = calculateNewPosition(robot);
  return robot;
}
// const robot = robots[10];
// ass(robot);
// asseq(robot.position, { x: 2, y: 4 });

// asseq(updatePosition(robot).position, { x: 4, y: 1 });
// asseq(updatePosition(robot).position, { x: 6, y: 5 });
// asseq(updatePosition(robot).position, { x: 8, y: 2 });
// asseq(updatePosition(robot).position, { x: 10, y: 6 });
// asseq(updatePosition(robot).position, { x: 1, y: 3 });
// printMap();
printMap();
for (const robot of robots) {
  let shit4 = 0;
  for (let i = 0; i < 100; i++) {
    updatePosition(robot);
    shit4++;
    // robot.position = calculateNewPosition(robot);
  }
  asseq(shit4, 100);
}
printMap();
// console.log(JSON.stringify(robots));
function printMap() {
  let map = "";
  let totalRobotCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let robotCount = 0;
      for (const robot of robots) {
        ass(robot.position.x >= 0);
        ass(robot.position.y >= 0);
        ass(robot.position.x <= width);
        ass(robot.position.y <= height);

        if (robot.position.x === x && robot.position.y === y) {
          robotCount++;
          totalRobotCount++;
        }
      }
      if (robotCount === 0) map += ".";
      else map += robotCount.toString();
    }
    map += "\n";
  }

  console.log(map);
  asseq(totalRobotCount, 12);
}

asseq(robots.length, 12);

function calculateNewPosition({ position, velocity }: Robot): Vector {
  const newPosition = add(position, velocity);

  if (newPosition.x > width) {
    ass(!(newPosition.x < 0));
    newPosition.x = newPosition.x % width;
  }
  if (newPosition.x < 0) newPosition.x = newPosition.x + width;

  if (newPosition.y > height) {
    ass(
      !(newPosition.y < 0),
      JSON.stringify({ position, newPosition, velocity })
    );
    newPosition.y = newPosition.y % height;
  }
  if (newPosition.y < 0) newPosition.y = newPosition.y + height;

  return newPosition;
}

// .split("\n").map(robotString=>{
//     const regex = new RegExp(/^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/gm)

//     const [pString,vString]= robotString.split(" ").map(([pString, vString])=>{
//         return [pString?.split("=")[1]?.split(",")]
//     })
//     const
//     return {position:}
// });
