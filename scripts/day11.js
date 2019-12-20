import { readFile } from 'fs'
import { promisify } from 'util'

import { HullPainterRobot } from '../lib/programs/intcodeHardware/HullPainterRobot.js'

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split(',').map(string => parseInt(string.trim(), 10))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  if (part === 1) {
    const robot = new HullPainterRobot()
    return robot.applyProgram(input).run().getPainted()
  }
  if (part === 2) {
    return null
  }
}
