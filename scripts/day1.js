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

/*
Drat, never could figure out a formula for not requiring recursion to calculate fuel
Couldn't quite get the rounding right, off by 1 at various values

const logOfBase = (n, base) => Math.log(n) / Math.log(base)
const getFinalIndex = (startVal) => Math.floor(logOfBase(startVal / 2, 3) + logOfBase(0.5, 3))
const getValAtIndex = (start, n) => Math.floor( start / (3 ** n) ) - Math.floor( (2 ** n) / (3 * n) )
moduleMasses.reduce((sum, mass) => {
  for (let i = 1, end = getFinalIndex(mass) + 1; i < end; i++) {
    console.log(i, getValAtIndex(mass, i))
    sum += getValAtIndex(mass, i)
  }
  return sum
*/

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
