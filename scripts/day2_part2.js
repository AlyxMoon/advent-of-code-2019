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
    .setMode(IntcodeProgramMode.INJECT_AND_FIND)
    .setDesiredFindValue(19690720)
    .setCodeInjectionRange([{ address: 1, min: 0, max: 99 }, { address: 2, min: 0, max: 99 }])
    .setProgram(input)

  const output = computer.run()

  return output ? 100 * output[0].value + output[1].value : 'No value found!'
}
