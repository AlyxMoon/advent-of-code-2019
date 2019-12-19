import { readFile } from 'fs'
import { promisify } from 'util'

import { findBestLocation } from '../lib/programs/MonitoringStationLocationFinder.js'

const parseInputFile = async (fileLocation) => {
  try {
    return (await promisify(readFile)(fileLocation, 'utf8'))
      .split('\n').map(string => string.trim().split(''))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)

  return findBestLocation(input)
}
