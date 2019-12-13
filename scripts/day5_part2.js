import { readFile } from 'fs'
import { promisify } from 'util'

import { IntcodeComputer, IntcodeProgramMode } from '../lib/intcodeComputer.js'

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
    .setMode(IntcodeProgramMode.DIAGNOSTIC)
    .setProgram(input)
    .setUserInput([5])

  return computer.run()
}
