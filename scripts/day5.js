import { readFile } from 'fs'
import { promisify } from 'util'

import { IntcodeComputer } from '../lib/programs/IntcodeComputer.js'

const parseInputFile = async (fileLocation) => {
  try {
    const input = await promisify(readFile)(fileLocation, 'utf8')
    return input.split(',').map(string => parseInt(string.trim(), 10))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  const processOutput = (new IntcodeComputer()).createAndRunProcess({
    program: input, inputs: [part === 1 ? 1 : 5],
  })

  return processOutput.writeOutputs[processOutput.writeOutputs.length - 1]
}
