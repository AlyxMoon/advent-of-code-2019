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
    .setMode(IntcodeProgramMode.DIAGNOSTIC)
    .setProgram(input)
    .setUserInput([1])

  return computer.run()
}
