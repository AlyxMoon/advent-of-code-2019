import { readFile } from 'fs'
import { promisify } from 'util'

import { IntcodeComputer, IntcodeProgramMode } from '../lib/programs/IntcodeComputer.js'

const parseInputFile = async (fileLocation) => {
  try {
    const input = await promisify(readFile)(fileLocation, 'utf8')
    return input.split(',').map(string => parseInt(string.trim(), 10))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '' }) => {
  const input = await parseInputFile(inputPath)

  const computer = new IntcodeComputer()
    .setMode(IntcodeProgramMode.STANDARD)
    .setProgram(input)
    .setCodeInjection([[1, 12], [2, 2]])

  return computer.run()
}
