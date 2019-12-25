
export const COMMANDS = {
  ADD: 1,
  MULT: 2,
  READ: 3,
  WRITE: 4,
  JUMP_T: 5,
  JUMP_F: 6,
  LESS_THAN: 7,
  EQUAL_TO: 8,
  REL_OFFSET: 9,
  BREAK: 99,
}

export const MODES = {
  POSITION: 0,
  IMMEDIATE: 1,
  RELATIVE: 2,
}

export const VALID_COMMANDS = Object.keys(COMMANDS)
export const VALID_OPCODES = Object.values(COMMANDS)

export const fillMemoryToAddress = (arr, index, val = 0) => {
  if (!Array.isArray(arr)) {
    throw new Error(`Invalid array passed to fillMemoryToAddress: ${arr}`)
  }

  if (!Number.isInteger(index)) {
    throw new Error(`Invalid index passed to fillMemoryToAddress: ${index}, should be integer`)
  }

  if (!Number.isInteger(val)) {
    throw new Error(`Invalid fill value passed to fillMemoryToAddress: ${val}, should be integer`)
  }

  if (index >= arr.length) arr.push(...Array(index - arr.length + 1).fill(val))
}

export const parseInstruction = (instruction) => {
  if (!Number.isInteger(instruction) || instruction < 1) {
    throw new Error(`Invalid input provided to parseInstruction: ${instruction}`)
  }

  const opcode = instruction % 100
  const modes = [
    Math.floor(instruction / 100) % 10,
    Math.floor(instruction / 1000) % 10,
    Math.floor(instruction / 10000) % 10,
  ]

  if (!VALID_OPCODES.includes(opcode)) {
    throw new Error(`Unrecognized opcode: ${opcode}`)
  }

  if (!modes.every(mode => mode >= 0 && mode <= 2)) {
    throw new Error(`There was an invalid mode for instruction: ${modes}`)
  }

  return { opcode, modes }
}
