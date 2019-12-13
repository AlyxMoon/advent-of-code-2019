import { readFile } from 'fs'
import { promisify } from 'util'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { IntcodeComputer, IntcodeProgramMode } from '../lib/intcodeComputer.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const parseInputFile = async (fileLocation) => {
  try {
    const input = await promisify(readFile)(fileLocation, 'utf8')
    return input.split(',').map(string => parseInt(string.trim(), 10))
  } catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '' }) => {
  const inputFilePath = inputPath || join(__dirname, './input.txt')
  const input = await parseInputFile(inputFilePath)

  const computer = new IntcodeComputer()
    .setMode(IntcodeProgramMode.INJECT_AND_FIND)
    .setDesiredFindValue(19690720)
    .setCodeInjectionRange([{ address: 1, min: 0, max: 99 }, { address: 2, min: 0, max: 99 }])
    .setProgram(input)

  const output = computer.run()

  if (output) {
    console.log('Raw output:', output, '\n')
    return 100 * output[0].value + output[1].value
  } else {
    console.log('No value found!')
  }
}
