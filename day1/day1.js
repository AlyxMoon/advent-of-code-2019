import { readFile } from 'fs'
import { promisify } from 'util'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const parseInputFile = async (fileLocation) => {
  try {
    const input = await promisify(readFile)(fileLocation, 'utf8')
    return input.split('\n').map(string => parseInt(string.trim(), 10))
  } catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const calculateFuelRequirements = (moduleMasses) => {
  return moduleMasses.reduce((sum, mass) => {
    return sum + Math.floor(mass / 3) - 2
  }, 0)
}

const main = async () => {
  try {
    const inputFilePath = process.argv[2] || join(__dirname, './input.txt')
    const input = await parseInputFile(inputFilePath)
    console.log(calculateFuelRequirements(input))
  } catch (error) {
    console.error('BIG OL ERROR: ', error.message)
    process.exit()
  }
}

main()
