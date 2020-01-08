const { terminal } = require('terminal-kit')

const { IntcodeComputer } = require('../IntcodeComputer')
const { PROGRAM_STATES } = require('../_intcode_helpers')

// UP, DOWN, LEFT, RIGHT
const DIRECTION_CHANGE = [[0, 1], [0, -1], [-1, 0], [1, 0]]
const CHANGE_TO_DIRECTION = {
  '0,1': 0,
  '0,-1': 1,
  '-1,0': 2,
  '1,0': 3,
}

const TILES = {
  FLOOR: 1,
  WALL: 2,
  SYSTEM: 3,
  ROBOT: 4,
  UNKNOWN: 5,
}

const OUTPUT_MAP = [TILES.WALL, TILES.FLOOR, TILES.SYSTEM]

const drawOnTerminal = (grid = [], width = 0, height = 0, currPosition = [0, 0]) => {
  const drawOutput = grid.slice()
    .map((pixel, i) => {
      let newPixel = pixel

      if (pixel === TILES.ROBOT) newPixel = terminal.str.inverse('+')
      else if (pixel === TILES.FLOOR) newPixel = terminal.str.bgWhite(' ')
      else if (pixel === TILES.WALL) newPixel = terminal.str.bgRed(' ')
      else if (pixel === TILES.SYSTEM) newPixel = terminal.str.bgCyan(' ')
      else newPixel = ' '

      if ((i + 1) % width === 0) newPixel += '\n'
      return newPixel
    })
    .join('')

  terminal.moveTo(1, 14).eraseDisplayBelow()(drawOutput)
}

class RepairRobot {
  #grid
  #position
  #positionHistory

  #computer
  #activeProcess
  #activeProcessPID

  constructor () {
    this.initialize()
    this.#computer = new IntcodeComputer()
  }

  initialize () {
    this.#grid = new Map()
    this.#grid.set([0, 0].toString(), { tile: TILES.FLOOR, visited: true })
    this.#position = [0, 0]
    this.#positionHistory = []
  }

  applyProgram (program = []) {
    if (!this._isValidProgram(program)) {
      throw new Error('Attempted to initialize Repair Robot with an invalid Intcode program')
    }

    this.initialize()
    if (this.#activeProcessPID) {
      this.#computer.destroyProcess(this.#activeProcessPID)
    }

    this.#activeProcessPID = this.#computer.createProcess({
      program, flags: { pauseOnWrite: true, pauseOnInput: true },
    })
    this.#activeProcess = this.#computer.getProcess(this.#activeProcessPID)

    return this
  }

  run ({ showInProgress = true } = {}) {
    if (!this.#activeProcess) {
      throw new Error('Attempted to run Repair Robot before program was initialized')
    }
    const process = this.#activeProcess
    let distance = 0

    for (
      let output = null, backtracking = false, direction = null, currentCode = null;
      !process.isProgramFinished();
      output = null, process.run(), currentCode = process.getCurrentStatusCode()
    ) {
      if (currentCode === PROGRAM_STATES.WAIT_ON_INPUT) {
        direction = 0

        for (const location of this.getAdjacentLocations()) {
          const tile = this.#grid.get(location.toString())
          if (!tile || !tile.visited) break
          direction++
        }

        backtracking = (direction === 4)
        // Have not found a valid direction to go anymore, need to backtrack
        if (direction === 4) {
          if (!this.#positionHistory.length) break
          const previousPosition = this.#positionHistory.pop()
          distance--
          direction = CHANGE_TO_DIRECTION[[
            previousPosition[0] - this.#position[0],
            previousPosition[1] - this.#position[1],
          ].toString()]

          if (Number.isNaN(direction)) break
        }

        process.addToInputs(direction + 1, true)
      }

      if (currentCode === PROGRAM_STATES.PAUSED_ON_OUTPUT) {
        output = process.getAndClearOutputs()[0]

        if (output !== null) {
          const nextPosition = [
            this.#position[0] + DIRECTION_CHANGE[direction][0],
            this.#position[1] + DIRECTION_CHANGE[direction][1],
          ]

          this.#grid.set(nextPosition.toString(), {
            visited: true,
            tile: OUTPUT_MAP[output],
          })

          // Move and do stuff
          if ([TILES.FLOOR, TILES.SYSTEM].includes(OUTPUT_MAP[output])) {
            if (!backtracking) {
              this.#positionHistory.push([...this.#position])
              distance++
            }
            this.#position = nextPosition
          }

          if (OUTPUT_MAP[output] === TILES.SYSTEM) break
          if (showInProgress) this.drawGrid()
        }
        else break
      }
    }

    return distance
  }

  getAdjacentLocations () {
    return Object.values(DIRECTION_CHANGE).map(([dx, dy]) => [
      this.#position[0] + dx,
      this.#position[1] + dy,
    ])
  }

  drawGrid () {
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity]

    for (const coord of this.#grid.keys()) {
      const [x, y] = coord.split(',').map(c => Number(c))
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }

    const [rows, cols] = [maxY - minY + 1, maxX - minX + 1]

    const grid = (Array(rows * cols).fill(0)).map((_, i) => {
      const position = [minX + i % cols, maxY - Math.floor(i / cols)]

      return this.#position[0] === position[0] && this.#position[1] === position[1]
        ? TILES.ROBOT
        : (this.#grid.get(position.toString()) || {}).tile
    })

    drawOnTerminal(grid, cols, rows)
  }

  _isValidProgram (program) {
    return Array.isArray(program) && program.length > 1 && program.every(Number.isInteger)
  }
}

module.exports = {
  RepairRobot,
}
