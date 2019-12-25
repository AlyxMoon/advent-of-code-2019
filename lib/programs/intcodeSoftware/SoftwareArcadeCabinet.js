
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
      flags: { pauseOnWriteSequence: true, maxLinesBeforeError: Infinity },
    })
    const process = computer.getProcess(processPID)

    let countBlocks = 0
    const tiles = {
      EMPTY: 0,
      WALL: 1,
      BLOCK: 2,
      PADDLE: 3,
      BALL: 4,
    }

    while (!process.isProgramFinished()) {
      const [x, y, id] = [
        process.run().getLastOutput(),
        process.run().getLastOutput(),
        process.run().getLastOutput(),
      ]

      const gridKey = [x, y].toString()
      if (id === tiles.BLOCK) {
        if (this.#gameGrid.get(gridKey) !== tiles.BLOCK) countBlocks++
      }
      else {
        if (this.#gameGrid.get(gridKey) === tiles.BLOCK) countBlocks--
      }

      this.#gameGrid.set(gridKey, id)
      process.getAndClearOutputs()
    }

    computer.deleteProcess(processPID)
    return countBlocks
  }

  _isValidProgram (program) {
    return Array.isArray(program) && program.length > 1 && program.every(Number.isInteger)
  }
}
