import { expect, test } from "vitest";
import _ from "lodash";
import { getDayInput } from "./god";

const exampleinput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

export interface TreeNode {
  dirs?: Dir[]; // type for a known property.
  files?: File[];
}

type File = { name: string; size: number };
type Dir = TreeNode;

test("part1example", () => {
  const tree: TreeNode = {};
  const currentPath: string[] = [];

  function setAt(path: string[], setObject: File | Dir) {
    expect(path[0]).toBe("/");
    let currentObject = tree;
    for (const pathSegment of path) {
      currentObject = currentObject.dirs[pathSegment];
    }
    currentObject = setObject;
  }

  const parsed = _.drop(exampleinput.split("$"));

  for (const commandString of parsed) {
    const splitCommand = commandString.trim().split("\n");
    const command = splitCommand.shift();
    if (command === "ls") {
      const output = splitCommand;
      for (const fileOrDir of splitCommand) {
        const shit = fileOrDir.split(" ");
        const dirOrSize = shit[0];
        const name = shit[1];

        if (dirOrSize === "dir") {
        } else if (isFinite(Number(dirOrSize))) {
        } else throw Error("shit hit the fan 1");
      }
    } else if (command?.split(" ")[0] === "cd") {
      const splitCdCommand = command?.split(" ");
      const path = splitCdCommand[1];
      if (path === "..") {
        currentPath.pop();
      }
      currentPath;
    } else throw Error("shit hit the fan 2");

    expect(command).toBe("shit");
  }
  expect(parsed).toBe("wow");

  // expect(exampleinput).toBe(-1);
});

test("part1", async () => {
  // expect(await getDayInput(1));
});
// test("part2Example", () => {expect(exampleinput).toBe(-1);});
// test("part2", async () => {expect(getDayInput(1));});
