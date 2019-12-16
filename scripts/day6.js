import { readFile } from 'fs'
import { promisify } from 'util'

import { OrbitMap } from '../lib/programs/OrbitMap.js'

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split('\n').map(string => string.trim())
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  const orbitalMap = new OrbitMap().setMap(input)

  return part === 1 ? orbitalMap.checksumMap() : orbitalMap.distanceToSanta()
}
