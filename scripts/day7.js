import { readFile } from 'fs'
import { promisify } from 'util'

import { IntcodeComputer } from '../lib/programs/IntcodeComputer.js'
import { SoftwareAmplifierControl } from '../lib/programs/SoftwareAmplifierControl.js'

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split(',').map(string => Number(string.trim()))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  // const input = await parseInputFile(inputPath)
  const input = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5]

  const computer = new IntcodeComputer().setProgram(input)
  const runtimeArguments = {
    software: SoftwareAmplifierControl,
    softwareArgs: {
      amplifierCount: 5,
      // phaseRange: part === 1 ? [0, 4] : [5, 9],
      phaseSequence: [9, 8, 7, 5, 6],
    },
  }

  return computer.run(runtimeArguments)
}
