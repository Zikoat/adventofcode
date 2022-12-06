import { readFile } from "fs-extra";

export async function getDayInput(day: number): Promise<string> {
  return (await readFile(`${__dirname}/day${day}Input.txt`)).toString();
}
