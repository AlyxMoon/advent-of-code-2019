import { readFile } from 'fs'
import { promisify } from 'util'

const parseInputFile = async (fileLocation) => {
  try {
    const input = await promisify(readFile)(fileLocation, 'utf8')
    return input.split('\n').map(string => parseInt(string.trim(), 10))
  }
  catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const calculateFuelRequirements = (moduleMasses) => {
  return moduleMasses.reduce((sum, mass) => {
    return sum + Math.floor(mass / 3) - 2
  }, 0)
}

export const run = async ({ inputPath = '' }) => {
  const input = await parseInputFile(inputPath)
  return calculateFuelRequirements(input)
}
