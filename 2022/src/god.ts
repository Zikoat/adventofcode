import { readFile } from 'fs-extra'

import { join } from 'path'

export async function getDayInput (day: number): Promise<string> {
  return (
    await readFile(join(__dirname, 'day', day, 'Input.txt'))
  ).toString()
}
