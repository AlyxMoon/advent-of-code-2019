const { readFile } = require('fs')
const { promisify } = require('util')

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
    if (!process.argv[2]) throw new Error('Location for the input file is required as the first argument!')
    const input = await parseInputFile(process.argv[2])
    console.log(calculateFuelRequirements(input))
  } catch (error) {
    console.error('BIG OL ERROR: ', error.message)
    process.exit()
  }
}

main()
