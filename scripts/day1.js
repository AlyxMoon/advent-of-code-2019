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

const calculateFuelRequirements = (moduleMasses, fuelRequiresFuel = false) => {
  return fuelRequiresFuel
    ? moduleMasses.reduce((sum, mass) => {
      const currentFuelRequired = Math.floor(mass / 3) - 2
      return sum + (currentFuelRequired > 0 ? currentFuelRequired + calculateFuelRequirements([currentFuelRequired], true) : 0)
    }, 0)
    : moduleMasses.reduce((sum, mass) => sum + Math.floor(mass / 3) - 2, 0)
}

export const run = async ({ inputPath = '', part = 1 }) => {
  const input = await parseInputFile(inputPath)
  return calculateFuelRequirements(input, part !== 1)
}
