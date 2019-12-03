const { readFile } = require('fs')
const { promisify } = require('util')

const parseInputFile = async (fileLocation) => {
  try {
    const input = await promisify(readFile)(fileLocation, 'utf8')
    return input.split(',').map(string => parseInt(string.trim(), 10))
  } catch (error) {
    throw new Error(`Error when reading the input file: ${error.message}`)
  }
}

const codeInjection = (input) => {
  let injectedCode = input.slice()
  injectedCode[1] = 12, injectedCode[2] = 2
  return injectedCode
}

const runIntcodeProgram = (input) => {
  let programCode = input.slice()

  for (let i = 0, bound = programCode.length; i < bound; i += 4) {
    const opcode = programCode[i]
    const [valIndex1, valIndex2, outputIndex] = [programCode[i + 1], programCode[i + 2], programCode[i + 3]]

    if (opcode === 99) break
    switch (opcode) {
      case 1: programCode[outputIndex] = programCode[valIndex1] + programCode[valIndex2]; break
      case 2: programCode[outputIndex] = programCode[valIndex1] * programCode[valIndex2]; break
      default: throw new Error(`Unrecognized intcode opcode!: ${programCode[i]}`)
    }
  }

  return programCode
}

const main = async () => {
  try {
    const inputFilePath = process.argv[2] || 'input.txt'
    const input = await parseInputFile(inputFilePath)
    const output = runIntcodeProgram(codeInjection(input))
    console.log(output[0])
  } catch (error) {
    console.error('BIG OL ERROR: ', error.message)
    process.exit()
  }
}

main()
