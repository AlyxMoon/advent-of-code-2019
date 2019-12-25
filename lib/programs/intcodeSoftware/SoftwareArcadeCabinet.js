import { PROGRAM_STATES } from '../_intcode_helpers.js'
import { spaceImageGenerator } from '../standalone/SpaceImageFormatDecoder.js'

export class SoftwareArcadeCabinet {
  #gameGrid
  #program

  constructor ({ program } = {}) {
    if (program) this.setProgram(program)
    this.#gameGrid = new Map()
  }

  setProgram (program = []) {
    if (!this._isValidProgram(program)) {
      throw new Error(`Invalid program provided to Software: ${program}`)
    }

    this.#program = program.slice()
    return this
  }

  сlearProgram () {
    this.#program = []
    return this
  }

  run (computer) {
    if (!this._isValidProgram(this.#program)) {
      throw new Error('Attempted to run Arcade Cabinet software with invalid arguments set')
    }

    if (!computer || !computer.constructor || computer.constructor.name !== 'IntcodeComputer') {
      throw new Error('Attempted to run Arcade Cabinet software on an invalid IntcodeComputer instance')
    }

    const processPID = computer.createProcess({
      program: this.#program,
      injections: [[0, 2]],
      flags: {
        pauseOnWrite: true,
        pauseOnInput: true,
        maxLinesBeforeError: 1000000,
      },
    })
    const process = computer.getProcess(processPID)

    // let countBlocks = 0
    // const tiles = {
    //   EMPTY: 0,
    //   WALL: 1,
    //   BLOCK: 2,
    //   PADDLE: 3,
    //   BALL: 4,
    // }

    const outputs = [0, 0, 0] // x, y, id
    for (
      let outputsIndex = 0, gameStarted = false;
      !process.isProgramFinished();
      process.run()
    ) {
      const currentCode = process.getCurrentStatusCode()

      if (currentCode === PROGRAM_STATES.PAUSED_ON_OUTPUT) {
        outputs[outputsIndex++] = process.getAndClearOutputs()[0]
      }

      if (currentCode === PROGRAM_STATES.WAIT_ON_INPUT) {
        gameStarted = true
        process.addToInputs(0, true)
      }

      if (outputsIndex === 3) {
        const gridKey = [outputs[0], outputs[1]].toString()
        this.#gameGrid.set(gridKey, outputs[2])
        outputsIndex = 0

        if (gameStarted) {
          this.drawGrid()
        }
      }
    }

    computer.deleteProcess(processPID)
    // return countBlocks
  }

  _isValidProgram (program) {
    return Array.isArray(program) && program.length > 1 && program.every(Number.isInteger)
  }

  drawGrid () {
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity]

    for (const coord of this.#gameGrid.keys()) {
      const [x, y] = coord.split(',').map(c => Number(c))
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }

    const [rows, cols] = [maxY - minY + 1, maxX - minX + 1]

    const grid = (Array(rows * cols).fill(0)).map((_, i) => {
      const position = [minX + i % cols, maxY - Math.floor(i / cols)]
      return this.#gameGrid.get(position.toString()) || 0
    })

    console.log(spaceImageGenerator([grid], cols, rows))
  }
}
