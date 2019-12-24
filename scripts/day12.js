import { readFile } from 'fs'
import { promisify } from 'util'

import {
  calculateVectorAtNthStep,
  getTotalEnergyFromMoons,
  findFirstRepeatVector,
} from '../lib/programs/standalone/MoonPositionSimulator.js'

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8')).split('\n')
      .map(line => line.replace(/[<>xyz=]|\s/g, '').split(',').map(Number))
      .map(pos => ({ pos: { x: pos[0], y: pos[1], z: pos[2] } }))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  if (part === 1) {
    return getTotalEnergyFromMoons(calculateVectorAtNthStep(input, 1000))
  }
  if (part === 2) {
    return findFirstRepeatVector(input)
  }
}
