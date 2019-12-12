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

const recieveUserInput = () => {
  // Hah, we're not actually going to prompt for anything!
  return 1
}

const parseInstruction = (instruction = 0) => {
  return {
    opcode: instruction % 100,
    modes: [
      Math.floor(instruction / 100) % 10,
      Math.floor(instruction / 1000) % 10,
      Math.floor(instruction / 10000) % 10,
    ]
  }
}

const runIntcodeProgramDiagnosticMode = (input) => {
  let programCode = input.slice()
  let diagnosticOutput = []

  for (let i = 0, line = 1, bound = programCode.length; i < bound; i += 4, line += 1) {
    const { opcode, modes } = parseInstruction(programCode[i])

    const input1 = modes[0] ? programCode[i + 1] : programCode[programCode[i + 1]]
    const input2 = modes[1] ? programCode[i + 2] : programCode[programCode[i + 2]]
    const outputIndex = opcode > 2 ? programCode[i + 1] : programCode[i + 3]

    if (opcode === 99) break
    // Add
    else if (opcode === 1) programCode[outputIndex] = input1 + input2
    // Multiply
    else if (opcode === 2) programCode[outputIndex] = input1 * input2
    // Input
    else if (opcode === 3) programCode[outputIndex] = recieveUserInput()
    // Output
    else if (opcode === 4) diagnosticOutput.push(programCode[outputIndex])

    else throw new Error(`Unrecognized intcode opcode!: ${opcode}`)

    i -= opcode > 2 ? 2 : 0
  }

  return diagnosticOutput
}

const main = async () => {
  try {
    const inputFilePath = process.argv[2] || 'input.txt'
    const input = await parseInputFile(inputFilePath)
    const output = runIntcodeProgramDiagnosticMode(input)
    console.log(output)
  } catch (error) {
    console.error('BIG OL ERROR: ', error.message)
    process.exit()
  }
}

main()
